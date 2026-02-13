/**
 * Privacy Request Verification Example
 * 
 * This example demonstrates how to create and process privacy requests
 * with email verification.
 */

import { createPrivacyRequestWithVerification } from '../privacy-requests'
import { sendVerificationEmail } from '../verification-email'
import { getResendApiKey } from '../secrets'

/**
 * Example: Create and send verification email for a privacy request
 */
export async function createPrivacyRequestExample() {
  const privacyRequestsTable = process.env.PRIVACY_REQUESTS_TABLE_NAME || 'privacy-requests'
  const userEmail = 'user@example.com'
  
  // Step 1: Create privacy request with verification token
  const privacyRequest = await createPrivacyRequestWithVerification(
    privacyRequestsTable,
    'access', // Can be 'access', 'deletion', or 'portability'
    userEmail
  )
  
  console.log('Privacy request created:', {
    id: privacyRequest.id,
    type: privacyRequest.requestType,
    email: privacyRequest.requesterEmail,
    status: privacyRequest.status, // 'pending'
    tokenExpiration: new Date(privacyRequest.tokenExpiration!).toISOString(),
  })
  
  // Step 2: Send verification email
  const resendApiKey = await getResendApiKey()
  await sendVerificationEmail(privacyRequest, resendApiKey)
  
  console.log('Verification email sent to:', userEmail)
  console.log('User must click the link in the email to verify and process the request')
  
  return privacyRequest
}

/**
 * Example: What happens when user clicks verification link
 * 
 * This is handled automatically by the verify-handler Lambda function.
 * The user clicks a link like:
 * https://daltonousley.com/api/verify-privacy-request?token=abc123&id=uuid
 * 
 * The handler will:
 * 1. Verify the token
 * 2. Process the request (access/deletion/portability)
 * 3. Send response email with results
 * 4. Show success page to user
 */

/**
 * Example: Manual verification flow (for testing)
 */
export async function manualVerificationExample() {
  // This would typically be called by the verify-handler Lambda
  // when a user clicks the verification link
  
  const { verifyPrivacyRequestToken, processVerifiedRequest } = await import('../privacy-requests')
  const { sendResponseEmail } = await import('../verification-email')
  const { getResendApiKey } = await import('../secrets')
  
  const privacyRequestsTable = process.env.PRIVACY_REQUESTS_TABLE_NAME || 'privacy-requests'
  const leadsTable = process.env.DYNAMODB_TABLE_NAME || 'contact-submissions'
  
  // These would come from query parameters in the real handler
  const requestId = 'example-request-id'
  const token = 'example-token'
  
  // Step 1: Verify token
  const verifiedRequest = await verifyPrivacyRequestToken(
    privacyRequestsTable,
    requestId,
    token
  )
  
  if (!verifiedRequest) {
    console.log('Verification failed: Invalid or expired token')
    return
  }
  
  console.log('Token verified successfully')
  
  // Step 2: Process the verified request
  const result = await processVerifiedRequest(
    leadsTable,
    privacyRequestsTable,
    verifiedRequest
  )
  
  if (!result.success) {
    console.log('Processing failed:', result.error)
    return
  }
  
  console.log('Request processed successfully')
  
  // Step 3: Send response email
  const resendApiKey = await getResendApiKey()
  const emailResult = {
    data: 'data' in result ? result.data : undefined,
    deletedCount: 'deletedCount' in result ? result.deletedCount : undefined,
  }
  
  await sendResponseEmail(verifiedRequest, emailResult, resendApiKey)
  
  console.log('Response email sent')
}

/**
 * Example: Complete flow for each request type
 */
export async function completeFlowExamples() {
  const privacyRequestsTable = process.env.PRIVACY_REQUESTS_TABLE_NAME || 'privacy-requests'
  const resendApiKey = await getResendApiKey()
  
  // Access Request
  console.log('\n=== Access Request Example ===')
  const accessRequest = await createPrivacyRequestWithVerification(
    privacyRequestsTable,
    'access',
    'user@example.com'
  )
  await sendVerificationEmail(accessRequest, resendApiKey)
  console.log('Access request created and verification email sent')
  
  // Deletion Request
  console.log('\n=== Deletion Request Example ===')
  const deletionRequest = await createPrivacyRequestWithVerification(
    privacyRequestsTable,
    'deletion',
    'user@example.com'
  )
  await sendVerificationEmail(deletionRequest, resendApiKey)
  console.log('Deletion request created and verification email sent')
  
  // Portability Request
  console.log('\n=== Portability Request Example ===')
  const portabilityRequest = await createPrivacyRequestWithVerification(
    privacyRequestsTable,
    'portability',
    'user@example.com'
  )
  await sendVerificationEmail(portabilityRequest, resendApiKey)
  console.log('Portability request created and verification email sent')
}

// Uncomment to run examples (requires proper AWS credentials and environment variables)
// createPrivacyRequestExample().catch(console.error)
// manualVerificationExample().catch(console.error)
// completeFlowExamples().catch(console.error)
