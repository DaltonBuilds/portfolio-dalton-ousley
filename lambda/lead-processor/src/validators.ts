/**
 * Zod Validation Schemas
 * 
 * Runtime validation for incoming requests and data
 */

import { z } from "zod"

/**
 * Schema for lead submission payload
 * Must match the frontend schema
 */
export const leadSubmissionSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must not exceed 100 characters" })
    .trim(),
  
  email: z
    .string()
    .email({ message: "Invalid email address" })
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
    .min(1, { message: "Turnstile token is required" }),
})

/**
 * Schema for API Gateway event headers
 */
export const requestHeadersSchema = z.object({
  "x-idempotency-key": z.string().uuid(),
  "x-turnstile-token": z.string().min(1),
})

/**
 * Validate lead submission data
 */
export function validateLeadSubmission(data: unknown) {
  return leadSubmissionSchema.parse(data)
}

/**
 * Validate request headers
 */
export function validateRequestHeaders(headers: Record<string, string | undefined>) {

  const normalizedHeaders = Object.keys(headers).reduce((acc, key) => {
    acc[key.toLowerCase()] = headers[key]
    return acc
  }, {} as Record<string, string | undefined>)

  return requestHeadersSchema.parse(normalizedHeaders)
}

