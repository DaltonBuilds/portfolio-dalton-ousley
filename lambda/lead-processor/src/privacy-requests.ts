/**
 * Privacy Request Handler Module
 * 
 * Handles data subject rights requests (access, deletion, portability)
 * in compliance with GDPR and CCPA requirements
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  QueryCommand,
  DeleteCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb"
import { randomUUID, randomBytes } from "crypto"
import type {
  StoredLead,
  PrivacyRequest,
  AccessRequestResult,
  DeletionRequestResult,
  PortabilityRequestResult,
} from "./types"

// Initialize DynamoDB client
const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

/**
 * Generates a secure random verification token
 * 
 * @returns A URL-safe base64 encoded token (32 bytes = 43 characters)
 */
export function generateVerificationToken(): string {
  // Generate 32 random bytes and encode as URL-safe base64
  return randomBytes(32)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

/**
 * Calculates expiration timestamp for verification token (24 hours from now)
 * 
 * @returns Unix timestamp in milliseconds
 */
export function calculateTokenExpiration(): number {
  return Date.now() + (24 * 60 * 60 * 1000) // 24 hours
}

/**
 * Creates a log entry in the privacy-requests table
 * 
 * @param privacyRequestsTable - Privacy requests table name
 * @param requestType - Type of privacy request
 * @param requesterEmail - Email of the requester
 * @param status - Initial status of the request
 * @param notes - Optional notes
 * @returns Created privacy request log entry
 */
async function logPrivacyRequest(
  privacyRequestsTable: string,
  requestType: "access" | "deletion" | "portability",
  requesterEmail: string,
  status: "pending" | "verified" | "completed" | "rejected" = "completed",
  notes?: string
): Promise<PrivacyRequest> {
  const requestedAt = Date.now()
  const ttl = Math.floor(requestedAt / 1000) + (2 * 365 * 24 * 60 * 60) // 2 years

  const privacyRequest: PrivacyRequest = {
    id: randomUUID(),
    requestType,
    requesterEmail,
    requestedAt,
    processedAt: status === "completed" ? requestedAt : undefined,
    status,
    notes,
    ttl,
  }

  const command = new PutCommand({
    TableName: privacyRequestsTable,
    Item: privacyRequest,
  })

  try {
    await docClient.send(command)
    return privacyRequest
  } catch (error) {
    console.error("Failed to log privacy request:", error)
    throw new Error("Failed to log privacy request")
  }
}

/**
 * Creates a privacy request with verification token
 * 
 * @param privacyRequestsTable - Privacy requests table name
 * @param requestType - Type of privacy request
 * @param requesterEmail - Email of the requester
 * @returns Created privacy request with verification token
 */
export async function createPrivacyRequestWithVerification(
  privacyRequestsTable: string,
  requestType: "access" | "deletion" | "portability",
  requesterEmail: string
): Promise<PrivacyRequest> {
  const requestedAt = Date.now()
  const ttl = Math.floor(requestedAt / 1000) + (2 * 365 * 24 * 60 * 60) // 2 years
  const verificationToken = generateVerificationToken()
  const tokenExpiration = calculateTokenExpiration()

  const privacyRequest: PrivacyRequest = {
    id: randomUUID(),
    requestType,
    requesterEmail: requesterEmail.toLowerCase().trim(),
    requestedAt,
    status: "pending",
    verificationToken,
    tokenExpiration,
    ttl,
  }

  const command = new PutCommand({
    TableName: privacyRequestsTable,
    Item: privacyRequest,
  })

  try {
    await docClient.send(command)
    return privacyRequest
  } catch (error) {
    console.error("Failed to create privacy request:", error)
    throw new Error("Failed to create privacy request")
  }
}

/**
 * Handles access request - returns all data for a given email
 * 
 * @param leadsTable - Leads table name
 * @param privacyRequestsTable - Privacy requests table name
 * @param email - Email address to query
 * @returns Access request result with all matching submissions
 */
export async function handleAccessRequest(
  leadsTable: string,
  privacyRequestsTable: string,
  email: string
): Promise<AccessRequestResult> {
  try {
    // Query all submissions by email using GSI
    const queryCommand = new QueryCommand({
      TableName: leadsTable,
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email.toLowerCase().trim(),
      },
    })

    const response = await docClient.send(queryCommand)
    const data = (response.Items || []) as StoredLead[]

    // Create log entry
    await logPrivacyRequest(
      privacyRequestsTable,
      "access",
      email,
      "completed",
      `Returned ${data.length} record(s)`
    )

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Access request failed:", error)
    
    // Log failed request
    try {
      await logPrivacyRequest(
        privacyRequestsTable,
        "access",
        email,
        "rejected",
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    } catch (logError) {
      console.error("Failed to log failed access request:", logError)
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process access request",
    }
  }
}

/**
 * Handles deletion request - deletes all data for a given email
 * 
 * @param leadsTable - Leads table name
 * @param privacyRequestsTable - Privacy requests table name
 * @param email - Email address to delete
 * @returns Deletion request result with count of deleted records
 */
export async function handleDeletionRequest(
  leadsTable: string,
  privacyRequestsTable: string,
  email: string
): Promise<DeletionRequestResult> {
  try {
    // Query all submissions by email using GSI
    const queryCommand = new QueryCommand({
      TableName: leadsTable,
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email.toLowerCase().trim(),
      },
    })

    const response = await docClient.send(queryCommand)
    const items = (response.Items || []) as StoredLead[]

    // Delete all matching submissions
    let deletedCount = 0
    for (const item of items) {
      const deleteCommand = new DeleteCommand({
        TableName: leadsTable,
        Key: { leadId: item.leadId },
      })

      await docClient.send(deleteCommand)
      deletedCount++
    }

    // Verify deletion by querying again
    const verifyResponse = await docClient.send(queryCommand)
    const remainingItems = verifyResponse.Items || []

    if (remainingItems.length > 0) {
      throw new Error(`Deletion verification failed: ${remainingItems.length} record(s) still exist`)
    }

    // Create log entry
    await logPrivacyRequest(
      privacyRequestsTable,
      "deletion",
      email,
      "completed",
      `Deleted ${deletedCount} record(s)`
    )

    return {
      success: true,
      deletedCount,
    }
  } catch (error) {
    console.error("Deletion request failed:", error)
    
    // Log failed request
    try {
      await logPrivacyRequest(
        privacyRequestsTable,
        "deletion",
        email,
        "rejected",
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    } catch (logError) {
      console.error("Failed to log failed deletion request:", logError)
    }

    return {
      success: false,
      deletedCount: 0,
      error: error instanceof Error ? error.message : "Failed to process deletion request",
    }
  }
}

/**
 * Handles portability request - exports all data for a given email as JSON
 * 
 * @param leadsTable - Leads table name
 * @param privacyRequestsTable - Privacy requests table name
 * @param email - Email address to export
 * @returns Portability request result with JSON string of all data
 */
export async function handlePortabilityRequest(
  leadsTable: string,
  privacyRequestsTable: string,
  email: string
): Promise<PortabilityRequestResult> {
  try {
    // Query all submissions by email using GSI
    const queryCommand = new QueryCommand({
      TableName: leadsTable,
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email.toLowerCase().trim(),
      },
    })

    const response = await docClient.send(queryCommand)
    const data = (response.Items || []) as StoredLead[]

    // Export as JSON string
    const jsonData = JSON.stringify(data, null, 2)

    // Validate JSON is parseable and contains all fields
    try {
      const parsed = JSON.parse(jsonData)
      if (!Array.isArray(parsed)) {
        throw new Error("Exported data is not an array")
      }

      // Verify all required fields are present in each record
      for (const record of parsed) {
        const requiredFields = ["leadId", "name", "email", "message", "consentGiven", "consentTimestamp", "createdAt", "ttl"]
        for (const field of requiredFields) {
          if (!(field in record)) {
            throw new Error(`Missing required field: ${field}`)
          }
        }
      }
    } catch (validationError) {
      throw new Error(`JSON validation failed: ${validationError instanceof Error ? validationError.message : "Unknown error"}`)
    }

    // Create log entry
    await logPrivacyRequest(
      privacyRequestsTable,
      "portability",
      email,
      "completed",
      `Exported ${data.length} record(s) as JSON`
    )

    return {
      success: true,
      data: jsonData,
    }
  } catch (error) {
    console.error("Portability request failed:", error)
    
    // Log failed request
    try {
      await logPrivacyRequest(
        privacyRequestsTable,
        "portability",
        email,
        "rejected",
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    } catch (logError) {
      console.error("Failed to log failed portability request:", logError)
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process portability request",
    }
  }
}


/**
 * Verifies a privacy request token and updates status to 'verified'
 * 
 * @param privacyRequestsTable - Privacy requests table name
 * @param requestId - Privacy request ID
 * @param token - Verification token
 * @returns Verified privacy request or null if invalid
 */
export async function verifyPrivacyRequestToken(
  privacyRequestsTable: string,
  requestId: string,
  token: string
): Promise<PrivacyRequest | null> {
  try {
    // Get the privacy request
    const getCommand = new GetCommand({
      TableName: privacyRequestsTable,
      Key: { id: requestId },
    })

    const response = await docClient.send(getCommand)
    
    if (!response.Item) {
      console.log(`Privacy request not found: ${requestId}`)
      return null
    }

    const privacyRequest = response.Item as PrivacyRequest

    // Check if already verified or completed
    if (privacyRequest.status === "verified" || privacyRequest.status === "completed") {
      console.log(`Privacy request already processed: ${requestId}`)
      return privacyRequest
    }

    // Check if rejected
    if (privacyRequest.status === "rejected") {
      console.log(`Privacy request was rejected: ${requestId}`)
      return null
    }

    // Verify token matches
    if (privacyRequest.verificationToken !== token) {
      console.log(`Invalid verification token for request: ${requestId}`)
      return null
    }

    // Check if token expired
    if (privacyRequest.tokenExpiration && Date.now() > privacyRequest.tokenExpiration) {
      console.log(`Verification token expired for request: ${requestId}`)
      
      // Update status to rejected
      await docClient.send(new UpdateCommand({
        TableName: privacyRequestsTable,
        Key: { id: requestId },
        UpdateExpression: "SET #status = :rejected, notes = :notes",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":rejected": "rejected",
          ":notes": "Verification token expired",
        },
      }))
      
      return null
    }

    // Update status to verified
    const updateCommand = new UpdateCommand({
      TableName: privacyRequestsTable,
      Key: { id: requestId },
      UpdateExpression: "SET #status = :verified",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":verified": "verified",
      },
      ReturnValues: "ALL_NEW",
    })

    const updateResponse = await docClient.send(updateCommand)
    return updateResponse.Attributes as PrivacyRequest

  } catch (error) {
    console.error("Failed to verify privacy request token:", error)
    throw new Error("Failed to verify privacy request token")
  }
}

/**
 * Processes a verified privacy request
 * 
 * @param leadsTable - Leads table name
 * @param privacyRequestsTable - Privacy requests table name
 * @param privacyRequest - Verified privacy request
 * @returns Result of the privacy request processing
 */
export async function processVerifiedRequest(
  leadsTable: string,
  privacyRequestsTable: string,
  privacyRequest: PrivacyRequest
): Promise<AccessRequestResult | DeletionRequestResult | PortabilityRequestResult> {
  if (privacyRequest.status !== "verified") {
    throw new Error("Privacy request must be verified before processing")
  }

  let result: AccessRequestResult | DeletionRequestResult | PortabilityRequestResult

  try {
    // Process based on request type
    switch (privacyRequest.requestType) {
      case "access":
        result = await processAccessRequest(leadsTable, privacyRequest.requesterEmail)
        break
      case "deletion":
        result = await processDeletionRequest(leadsTable, privacyRequest.requesterEmail)
        break
      case "portability":
        result = await processPortabilityRequest(leadsTable, privacyRequest.requesterEmail)
        break
      default:
        throw new Error(`Unknown request type: ${privacyRequest.requestType}`)
    }

    // Update privacy request status to completed
    await docClient.send(new UpdateCommand({
      TableName: privacyRequestsTable,
      Key: { id: privacyRequest.id },
      UpdateExpression: "SET #status = :completed, processedAt = :processedAt, notes = :notes",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":completed": "completed",
        ":processedAt": Date.now(),
        ":notes": result.success 
          ? `Successfully processed ${privacyRequest.requestType} request`
          : `Failed: ${result.error}`,
      },
    }))

    return result

  } catch (error) {
    console.error("Failed to process verified request:", error)
    
    // Update privacy request status to rejected
    await docClient.send(new UpdateCommand({
      TableName: privacyRequestsTable,
      Key: { id: privacyRequest.id },
      UpdateExpression: "SET #status = :rejected, notes = :notes",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":rejected": "rejected",
        ":notes": `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
    }))

    throw error
  }
}

/**
 * Internal function to process access request (without logging)
 */
async function processAccessRequest(
  leadsTable: string,
  email: string
): Promise<AccessRequestResult> {
  const queryCommand = new QueryCommand({
    TableName: leadsTable,
    IndexName: "email-index",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email.toLowerCase().trim(),
    },
  })

  const response = await docClient.send(queryCommand)
  const data = (response.Items || []) as StoredLead[]

  return {
    success: true,
    data,
  }
}

/**
 * Internal function to process deletion request (without logging)
 */
async function processDeletionRequest(
  leadsTable: string,
  email: string
): Promise<DeletionRequestResult> {
  const queryCommand = new QueryCommand({
    TableName: leadsTable,
    IndexName: "email-index",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email.toLowerCase().trim(),
    },
  })

  const response = await docClient.send(queryCommand)
  const items = (response.Items || []) as StoredLead[]

  let deletedCount = 0
  for (const item of items) {
    const deleteCommand = new DeleteCommand({
      TableName: leadsTable,
      Key: { leadId: item.leadId },
    })

    await docClient.send(deleteCommand)
    deletedCount++
  }

  // Verify deletion
  const verifyResponse = await docClient.send(queryCommand)
  const remainingItems = verifyResponse.Items || []

  if (remainingItems.length > 0) {
    throw new Error(`Deletion verification failed: ${remainingItems.length} record(s) still exist`)
  }

  return {
    success: true,
    deletedCount,
  }
}

/**
 * Internal function to process portability request (without logging)
 */
async function processPortabilityRequest(
  leadsTable: string,
  email: string
): Promise<PortabilityRequestResult> {
  const queryCommand = new QueryCommand({
    TableName: leadsTable,
    IndexName: "email-index",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email.toLowerCase().trim(),
    },
  })

  const response = await docClient.send(queryCommand)
  const data = (response.Items || []) as StoredLead[]

  const jsonData = JSON.stringify(data, null, 2)

  // Validate JSON
  try {
    const parsed = JSON.parse(jsonData)
    if (!Array.isArray(parsed)) {
      throw new Error("Exported data is not an array")
    }

    for (const record of parsed) {
      const requiredFields = ["leadId", "name", "email", "message", "consentGiven", "consentTimestamp", "createdAt", "ttl"]
      for (const field of requiredFields) {
        if (!(field in record)) {
          throw new Error(`Missing required field: ${field}`)
        }
      }
    }
  } catch (validationError) {
    throw new Error(`JSON validation failed: ${validationError instanceof Error ? validationError.message : "Unknown error"}`)
  }

  return {
    success: true,
    data: jsonData,
  }
}
