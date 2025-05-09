import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emailFormSchema } from "@/lib/validation";
import { sendEmail } from "./emailService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Email sending endpoint
  app.post("/api/send-email", async (req, res) => {
    try {
      // Validate request body against schema
      const validation = emailFormSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid form data", 
          errors: validation.error.errors 
        });
      }
      
      const { fullName, postcode, email, description, emailContent } = validation.data;
      
      // Make sure postcode is E20
      if (!postcode.toLowerCase().startsWith('e20')) {
        return res.status(400).json({ 
          message: "This form is only for E20 residents. Please enter a valid E20 postcode." 
        });
      }

      // Send the email
      await sendEmail({
        to: "uma.kumaran.mp@parliament.uk",
        cc: [email, "phone.thefts@andrewjones.uk"],
        subject: "Urgent Action Needed: Escalating Phone Thefts in E20, Stratford and Bow",
        text: emailContent,
        from: `${fullName} <no-reply@e20residents.org>`,
        replyTo: email
      });

      return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ 
        message: "Failed to send email. Please try again later." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
