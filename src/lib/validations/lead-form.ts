import { z } from "zod"

const MAX_MESSAGE_LENGTH = 1000

const leadFormBaseSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must not exceed 100 characters" })
    .trim(),
  
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" })
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
    .max(MAX_MESSAGE_LENGTH, { message: `Message must not exceed ${MAX_MESSAGE_LENGTH} characters` })
    .trim(),
})

/**
 * Zod schema for UI form validation
 * Validates only user-entered fields in the contact modal.
 */
export const leadFormSchema = leadFormBaseSchema

/**
 * TypeScript type derived from the Zod schema
 * Ensures type safety across the application
 */
export type LeadFormData = z.infer<typeof leadFormSchema>

/**
 * Schema for the API request payload (includes turnstile token)
 */
export const leadSubmissionSchema = leadFormBaseSchema.extend({
  turnstileToken: z
    .string()
    .min(1, { message: "Please complete the security challenge" }),

  consentGiven: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the Privacy Policy and Terms of Use",
    }),

  consentTimestamp: z
    .number()
    .int()
    .positive(),
})

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
  consentGiven: z.boolean(),
  consentTimestamp: z.number(),
  createdAt: z.number(),
  type: z.literal("LEAD"),
  ttl: z.number(),
})

/**
 * Type for stored lead data
 */
export type StoredLead = z.infer<typeof storedLeadSchema>

