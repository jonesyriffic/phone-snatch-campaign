import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Keep the users table for reference
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Email metrics table to track emails sent
export const emailMetrics = pgTable("email_metrics", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  postcode: text("postcode").notNull(),
  email: text("email").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  userAgent: text("user_agent"),
  customizedTemplate: boolean("customized_template").default(false),
  anonymous: boolean("anonymous").default(false),
});

export const insertEmailMetricSchema = createInsertSchema(emailMetrics).omit({
  id: true,
  sentAt: true,
});

export type InsertEmailMetric = z.infer<typeof insertEmailMetricSchema>;
export type EmailMetric = typeof emailMetrics.$inferSelect;

// Dashboard statistics schema
export const dashboardStatsSchema = z.object({
  totalEmailsSent: z.number(),
  emailsToday: z.number(),
  uniquePostcodesCount: z.number(),
  emailsByPostcode: z.array(z.object({
    postcode: z.string(),
    count: z.number()
  })),
  recentEmails: z.array(z.object({
    fullName: z.string(),
    postcode: z.string(), // This will be removed from UI display for privacy
    sentAt: z.string(),
    anonymous: z.boolean().optional(),
  })).optional(),
  emailsSentByDay: z.array(z.object({
    date: z.string(),
    count: z.number()
  })).optional()
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

// Add email form schema
export const emailFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  postcode: z.string()
    .min(1, "Postcode is required")
    .refine(val => {
      // Basic UK E20 postcode validation
      const regex = /^[Ee]20\s*[0-9][A-Za-z]{2}$/;
      return regex.test(val);
    }, {
      message: "Please enter a valid E20 postcode (e.g., E20 1JG)",
    }),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  anonymous: z.boolean().default(false),
  emailContent: z.string().min(1, "Email content is required")
});

export type EmailFormData = z.infer<typeof emailFormSchema>;
