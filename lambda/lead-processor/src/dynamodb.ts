/**
 * DynamoDB Operations Module
 * 
 * Handles lead storage and idempotency checks
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb"
import type { StoredLead, LeadSubmission } from "./types"

// Initialize DynamoDB client
const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

/**
 * Checks if an idempotency key has been used before
 * 
 * @param tableName - DynamoDB table name
 * @param idempotencyKey - UUID idempotency key
 * @returns Lead ID if key exists, null otherwise
 */
export async function checkIdempotency(
  tableName: string,
  idempotencyKey: string
): Promise<string | null> {
  const command = new GetCommand({
    TableName: tableName,
    Key: { leadId: idempotencyKey },
  })

  try {
    const response = await docClient.send(command)
    return response.Item ? (response.Item.leadId as string) : null
  } catch (error) {
    console.error("Idempotency check error:", error)
    throw new Error("Failed to check idempotency")
  }
}

/**
 * Stores a lead in DynamoDB
 * 
 * @param tableName - DynamoDB table name
 * @param leadId - UUID lead identifier
 * @param leadData - Lead submission data
 * @param ttlDays - Number of days until TTL expires
 * @returns Stored lead record
 */
export async function storeLead(
  tableName: string,
  leadId: string,
  leadData: LeadSubmission,
  ttlDays: number = 548 // 18 months default
): Promise<StoredLead> {
  const createdAt = Date.now()
  const ttl = Math.floor(createdAt / 1000) + (ttlDays * 24 * 60 * 60)

  const lead: StoredLead = {
    leadId,
    name: leadData.name,
    email: leadData.email,
    company: leadData.company || undefined,
    message: leadData.message,
    createdAt,
    type: "LEAD",
    ttl,
  }

  const command = new PutCommand({
    TableName: tableName,
    Item: lead,
    // Prevent overwriting existing items
    ConditionExpression: "attribute_not_exists(leadId)",
  })

  try {
    await docClient.send(command)
    return lead
  } catch (error) {
    if (error instanceof Error && error.name === "ConditionalCheckFailedException") {
      throw new Error("Duplicate lead ID")
    }
    console.error("Failed to store lead:", error)
    throw new Error("Failed to store lead in database")
  }
}

/**
 * Queries leads by date range
 * 
 * @param tableName - DynamoDB table name
 * @param startDate - Start timestamp
 * @param endDate - End timestamp
 * @returns Array of leads
 */
export async function queryLeadsByDate(
  tableName: string,
  startDate: number,
  endDate: number
): Promise<StoredLead[]> {
  const command = new QueryCommand({
    TableName: tableName,
    IndexName: "createdAt-index",
    KeyConditionExpression: "#type = :type AND createdAt BETWEEN :start AND :end",
    ExpressionAttributeNames: {
      "#type": "type",
    },
    ExpressionAttributeValues: {
      ":type": "LEAD",
      ":start": startDate,
      ":end": endDate,
    },
  })

  try {
    const response = await docClient.send(command)
    return (response.Items || []) as StoredLead[]
  } catch (error) {
    console.error("Failed to query leads:", error)
    throw new Error("Failed to query leads from database")
  }
}

/**
 * Gets a lead by ID
 * 
 * @param tableName - DynamoDB table name
 * @param leadId - Lead identifier
 * @returns Lead record or null
 */
export async function getLead(
  tableName: string,
  leadId: string
): Promise<StoredLead | null> {
  const command = new GetCommand({
    TableName: tableName,
    Key: { leadId },
  })

  try {
    const response = await docClient.send(command)
    return response.Item ? (response.Item as StoredLead) : null
  } catch (error) {
    console.error("Failed to get lead:", error)
    throw new Error("Failed to retrieve lead from database")
  }
}

