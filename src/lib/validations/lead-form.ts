import { z } from "zod"

/**
 * Zod schema for lead form validation
 * Used for both client-side and server-side validation
 */
export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must not exceed 100 characters" })
    .trim(),
  
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" })
    .max(100, { message: "Email must not exceed 100 characters" })
    .trim()
    .toLowerCase(),
  
  company: z
    .string()
    .max(100, { message: "Company name must not exceed 100 characters" })
    .trim()
    .optional()
    .or(z.literal("")),
  
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must not exceed 1000 characters" })
    .trim(),
  
  turnstileToken: z
    .string()
    .min(1, { message: "Please complete the security challenge" }),
})

/**
 * TypeScript type derived from the Zod schema
 * Ensures type safety across the application
 */
export type LeadFormData = z.infer<typeof leadFormSchema>

/**
 * Schema for the API request payload (includes turnstile token)
 */
export const leadSubmissionSchema = leadFormSchema

/**
 * Type for the API request payload
 */
export type LeadSubmission = z.infer<typeof leadSubmissionSchema>

/**
 * Schema for stored lead data in DynamoDB (without turnstile token)
 */
export const storedLeadSchema = z.object({
  leadId: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string(),
  createdAt: z.number(),
  type: z.literal("LEAD"),
  ttl: z.number(),
})

/**
 * Type for stored lead data
 */
export type StoredLead = z.infer<typeof storedLeadSchema>

