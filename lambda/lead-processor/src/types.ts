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
  consentGiven: boolean
  consentTimestamp: number
}

export interface StoredLead {
  leadId: string
  name: string
  email: string
  company?: string
  message: string
  consentGiven: boolean
  consentTimestamp: number
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
  resendApiKey?: string
  lastFetch?: number
}

export const SECRETS_CACHE_TTL = 300000

/**
 * Privacy Request Types
 */

export interface PrivacyRequest {
  id: string
  requestType: "access" | "deletion" | "portability"
  requesterEmail: string
  requestedAt: number
  processedAt?: number
  status: "pending" | "verified" | "completed" | "rejected"
  notes?: string
  verificationToken?: string
  tokenExpiration?: number
  ttl: number
}

export interface AccessRequestResult {
  success: boolean
  data?: StoredLead[]
  error?: string
}

export interface DeletionRequestResult {
  success: boolean
  deletedCount: number
  error?: string
}

export interface PortabilityRequestResult {
  success: boolean
  data?: string
  error?: string
}

