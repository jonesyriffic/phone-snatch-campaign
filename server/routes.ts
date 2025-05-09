import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { emailMetrics, emailFormSchema, dashboardStatsSchema } from "@shared/schema";
import { count, desc, eq, sql } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import { addTestEmailRecord, clearAllEmailRecords } from "./dev-utilities";
import { generateEmailVariation } from "./aiService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Record email metrics and return success
  app.post("/api/track-email", async (req, res) => {
    try {
      // Validate request body against schema
      const validation = emailFormSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid form data", 
          errors: validation.error.errors 
        });
      }
      
      const { fullName, postcode, email, anonymous, emailContent } = validation.data;
      const userAgent = req.headers["user-agent"] || "";
      
      // Make sure postcode is E20
      if (!postcode.toLowerCase().startsWith('e20')) {
        return res.status(400).json({ 
          message: "This form is only for E20 residents. Please enter a valid E20 postcode." 
        });
      }

      // Check if the template was customized (simple check by looking for differences in length)
      const originalLength = emailContent.indexOf("[Your Full Name") - emailContent.indexOf("Dear Ms. Kumaran,");
      const customizedTemplate = originalLength !== 3050;  // This is an approximate length of the default template

      // Record the email metrics
      await db.insert(emailMetrics).values({
        fullName,
        postcode: postcode.toUpperCase(),
        email,
        userAgent,
        customizedTemplate,
        anonymous
      });

      return res.status(200).json({ message: "Email metrics recorded successfully" });
    } catch (error) {
      console.error("Error recording email metrics:", error);
      return res.status(500).json({ 
        message: "Failed to record email metrics. Please try again later." 
      });
    }
  });

  // Get dashboard stats
  app.get("/api/dashboard-stats", async (req, res) => {
    try {
      // Get total emails sent
      const [totalResult] = await db.select({ count: count() }).from(emailMetrics);
      const totalEmailsSent = totalResult?.count || 0;

      // Get emails sent today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [todayResult] = await db
        .select({ count: count() })
        .from(emailMetrics)
        .where(sql`DATE(sent_at) = CURRENT_DATE`);
      const emailsToday = todayResult?.count || 0;

      // Get count of unique postcodes
      const [uniquePostcodesResult] = await db
        .select({
          uniqueCount: sql`COUNT(DISTINCT ${emailMetrics.postcode})`,
        })
        .from(emailMetrics);
      
      const uniquePostcodesCount = Number(uniquePostcodesResult?.uniqueCount) || 0;

      // Only get emails by postcode breakdown if we have at least 5 different postcodes
      // This ensures sufficient anonymity in the stats
      let emailsByPostcode: { postcode: string; count: number }[] = [];
      if (uniquePostcodesCount >= 5) {
        emailsByPostcode = await db
          .select({
            postcode: emailMetrics.postcode,
            count: count(),
          })
          .from(emailMetrics)
          .groupBy(emailMetrics.postcode)
          .orderBy(desc(count()))
          .limit(5);
      }

      // Get 10 most recent emails
      const recentEmails = await db
        .select({
          fullName: emailMetrics.fullName,
          postcode: emailMetrics.postcode,
          sentAt: emailMetrics.sentAt,
          anonymous: emailMetrics.anonymous,
        })
        .from(emailMetrics)
        .orderBy(desc(emailMetrics.sentAt))
        .limit(10);

      // Format recent emails for display with privacy (first name + last initial only)
      const formattedRecentEmails = recentEmails.map(email => {
        // If anonymous is true, return "Anonymous"
        if (email.anonymous) {
          return {
            ...email,
            fullName: "Anonymous",
            sentAt: formatDate(email.sentAt.toISOString())
          };
        }
        
        // Otherwise, format as first name + last initial
        const nameParts = email.fullName.trim().split(/\s+/);
        let formattedName;
        
        if (nameParts.length > 1) {
          // First name + last initial (e.g., "John S.")
          formattedName = `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0)}.`;
        } else {
          // Just first name if that's all we have
          formattedName = nameParts[0];
        }
        
        return {
          ...email,
          fullName: formattedName,
          sentAt: formatDate(email.sentAt.toISOString())
        };
      });

      // Get emails sent by day (last 7 days)
      const emailsSentByDay = await db
        .select({
          date: sql`to_char(sent_at, 'YYYY-MM-DD')`.as('date'),
          count: count(),
        })
        .from(emailMetrics)
        .where(sql`sent_at > CURRENT_DATE - INTERVAL '7 days'`)
        .groupBy(sql`to_char(sent_at, 'YYYY-MM-DD')`)
        .orderBy(sql`to_char(sent_at, 'YYYY-MM-DD')`);

      const stats = {
        totalEmailsSent,
        emailsToday,
        uniquePostcodesCount,
        emailsByPostcode,
        recentEmails: formattedRecentEmails,
        emailsSentByDay
      };

      return res.status(200).json(stats);
    } catch (error) {
      console.error("Error getting dashboard stats:", error);
      return res.status(500).json({ 
        message: "Failed to get dashboard stats. Please try again later." 
      });
    }
  });

  // Development utility endpoint to add test data
  // This is for demonstration purposes only and should be disabled in production
  app.post("/api/dev/add-test-data", addTestEmailRecord);
  
  // Endpoint to clear all email records for production deployment
  app.post("/api/dev/clear-data", clearAllEmailRecords);
  
  // Endpoint to generate email content variations using AI
  app.post("/api/generate-email-variation", async (req, res) => {
    try {
      // Validate the input
      const { emailContent, fullName, postcode } = req.body;
      
      if (!emailContent || !fullName || !postcode) {
        return res.status(400).json({ 
          message: "Missing required fields: emailContent, fullName, or postcode" 
        });
      }
      
      // Generate a variation of the email content
      const userContext = { fullName, postcode };
      const variationContent = await generateEmailVariation(emailContent, userContext);
      
      return res.status(200).json({ 
        message: "Email variation generated successfully",
        emailContent: variationContent
      });
    } catch (error) {
      console.error("Error generating email variation:", error);
      return res.status(500).json({ 
        message: "Failed to generate email variation. Using original content." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
