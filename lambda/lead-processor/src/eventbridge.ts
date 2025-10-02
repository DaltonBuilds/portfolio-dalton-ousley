/**
 * EventBridge Client Module
 * 
 * Publishes events to EventBridge custom event bus
 */

import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge"
import type { LeadSubmittedEvent } from "./types"

// Initialize EventBridge client
const client = new EventBridgeClient({})

/**
 * Publishes a LeadSubmitted event to EventBridge
 * 
 * @param eventBusName - EventBridge event bus name
 * @param leadEvent - Lead event data
 */
export async function publishLeadSubmittedEvent(
  eventBusName: string,
  leadEvent: LeadSubmittedEvent
): Promise<void> {
  const command = new PutEventsCommand({
    Entries: [
      {
        Source: "portfolio.leads",
        DetailType: "LeadSubmitted",
        Detail: JSON.stringify(leadEvent),
        EventBusName: eventBusName,
      },
    ],
  })

  try {
    const response = await client.send(command)
    
    if (response.FailedEntryCount && response.FailedEntryCount > 0) {
      console.error("Failed to publish event:", response.Entries)
      throw new Error("EventBridge publish failed")
    }

    console.log("Event published successfully", {
      eventId: response.Entries?.[0]?.EventId,
      leadId: leadEvent.leadId,
    })
  } catch (error) {
    console.error("EventBridge publish error:", error)
    throw new Error("Failed to publish event to EventBridge")
  }
}

/**
 * Publishes a custom event to EventBridge
 * 
 * @param eventBusName - EventBridge event bus name
 * @param source - Event source identifier
 * @param detailType - Event type
 * @param detail - Event detail object
 */
export async function publishEvent(
  eventBusName: string,
  source: string,
  detailType: string,
  detail: Record<string, unknown>
): Promise<void> {
  const command = new PutEventsCommand({
    Entries: [
      {
        Source: source,
        DetailType: detailType,
        Detail: JSON.stringify(detail),
        EventBusName: eventBusName,
      },
    ],
  })

  try {
    const response = await client.send(command)
    
    if (response.FailedEntryCount && response.FailedEntryCount > 0) {
      console.error("Failed to publish event:", response.Entries)
      throw new Error("EventBridge publish failed")
    }

    console.log("Event published successfully", {
      eventId: response.Entries?.[0]?.EventId,
      source,
      detailType,
    })
  } catch (error) {
    console.error("EventBridge publish error:", error)
    throw new Error("Failed to publish event to EventBridge")
  }
}

