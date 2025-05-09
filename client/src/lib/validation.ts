import { z } from "zod";
import { validatePostcode } from "./utils";

export const emailFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  postcode: z.string()
    .min(1, "Postcode is required")
    .refine(val => validatePostcode(val), {
      message: "Please enter a valid E20 postcode (e.g., E20 1JG)",
    }),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  anonymous: z.boolean().default(false),
  emailContent: z.string().min(1, "Email content is required")
});

export type EmailFormData = z.infer<typeof emailFormSchema>;
