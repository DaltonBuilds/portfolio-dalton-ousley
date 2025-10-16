/**
 * TypeScript Type Definitions
 * 
 * Shared types for the lead processor Lambda function
 */

export interface LeadSubmission {
  name: string
  email: string
  company?: string
  message: string
  turnstileToken: string
}

export interface StoredLead {
  leadId: string
  name: string
  email: string
  company?: string
  message: string
  createdAt: number
  type: "LEAD"
  ttl: number
}

export interface LeadSubmittedEvent {
  leadId: string
  name: string
  email: string
  company?: string
  message: string
  createdAt: number
}

export interface APIResponse {
  statusCode: number
  headers: Record<string, string>
  body: string
}

export interface SuccessResponse {
  success: true
  leadId: string
  message: string
}

export interface ErrorResponse {
  success: false
  error: string
  code?: string
  details?: Record<string, unknown>
}

export interface SecretsCache {
  hmacServerSecret?: string
  turnstileSecret?: string
  lastFetch?: number
}

export const SECRETS_CACHE_TTL = 300000

