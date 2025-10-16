/**
 * Email Notifier Lambda Handler
 * 
 * Processes LeadSubmitted events from EventBridge and sends
 * email notifications via Resend
 */

import type { EventBridgeEvent } from "./types"
import { sendLeadNotification } from "./resend-client"

/**
 * Main Lambda handler
 */
export async function handler(event: EventBridgeEvent): Promise<void> {

  try {
    // Validate event type
    if (event["detail-type"] !== "LeadSubmitted") {
      console.warn("Unexpected event type:", event["detail-type"])
      return
    }

    // Extract lead data from event
    const lead = event.detail

    if (!lead || !lead.leadId) {
      console.error("Invalid event detail:", event.detail)
      throw new Error("Event detail is missing required fields")
    }

    // Send email notification
    await sendLeadNotification(lead)

  } catch (error) {
    console.error("Failed to process event:", error)
    
    // Throw error to trigger Lambda retry
    throw error
  }
}

