import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
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
  description: z.string().optional(),
  emailContent: z.string().min(1, "Email content is required")
});

export type EmailFormData = z.infer<typeof emailFormSchema>;
