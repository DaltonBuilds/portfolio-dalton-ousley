/**
 * TypeScript Type Definitions for Email Notifier
 */

export interface LeadSubmittedEvent {
  leadId: string
  name: string
  email: string
  company?: string
  message: string
  createdAt: number
}

export interface EventBridgeEvent {
  version: string
  id: string
  "detail-type": string
  source: string
  account: string
  time: string
  region: string
  resources: string[]
  detail: LeadSubmittedEvent
}

export interface SecretsCache {
  resendApiKey?: string
  lastFetch?: number
}

export const SECRETS_CACHE_TTL = 300000
