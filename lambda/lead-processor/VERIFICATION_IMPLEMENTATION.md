# Privacy Request Email Verification Implementation

## Overview

This implementation adds email verification for privacy requests (access, deletion, portability) to ensure that only the legitimate data subject can process their request.

## What Was Implemented

### 1. Verification Token Generation (`privacy-requests.ts`)

- `generateVerificationToken()`: Generates a secure 32-byte URL-safe token
- `calculateTokenExpiration()`: Sets token expiration to 24 hours from creation
- `createPrivacyRequestWithVerification()`: Creates a privacy request with verification token and stores it in DynamoDB

### 2. Verification Email Templates (`verification-email.ts`)

- `sendVerificationEmail()`: Sends verification email with clickable link
- `sendResponseEmail()`: Sends result email after request is processed
- Email templates for:
  - Verification request (with 24-hour expiration notice)
  - Access request response (with JSON data)
  - Deletion request response (with confirmation)
  - Portability request response (with JSON export)

### 3. Verification Endpoint (`verify-handler.ts`)

- API Gateway Lambda handler for GET requests
- Verifies token and request ID from query parameters
- Processes verified requests (access/deletion/portability)
- Sends response email with results
- Returns user-friendly HTML pages for success/error states

### 4. Supporting Functions (`privacy-requests.ts`)

- `verifyPrivacyRequestToken()`: Validates token and updates status to 'verified'
- `processVerifiedRequest()`: Processes the verified request and updates status to 'completed'
- Internal processing functions that don't create duplicate log entries

## How It Works

### Flow Diagram

```
1. User submits privacy request
   ↓
2. System creates request with verification token (status: 'pending')
   ↓
3. System sends verification email with link
   ↓
4. User clicks verification link
   ↓
5. Verification endpoint validates token
   ↓
6. System updates status to 'verified'
   ↓
7. System processes request (access/deletion/portability)
   ↓
8. System updates status to 'completed'
   ↓
9. System sends response email with results
   ↓
10. User receives HTML success page
```

## API Endpoints

### Verification Endpoint

**URL**: `GET /api/verify-privacy-request`

**Query Parameters**:
- `token` (required): Verification token from email
- `id` (required): Privacy request ID

**Example**:
```
https://daltonousley.com/api/verify-privacy-request?token=abc123...&id=uuid-here
```

**Responses**:
- 200: Success HTML page (request verified and processed)
- 400: Error HTML page (invalid/expired token)
- 500: Error HTML page (processing failed)

## Environment Variables

The following environment variables need to be configured:

```bash
# Existing variables
DYNAMODB_TABLE_NAME=contact-submissions
PRIVACY_REQUESTS_TABLE_NAME=privacy-requests

# New variables for verification
FROM_EMAIL=noreply@daltonousley.com
VERIFICATION_BASE_URL=https://daltonousley.com/api/verify-privacy-request
RESEND_API_KEY_NAME=portfolio/resend-api-key
```

## Database Schema Updates

The `PrivacyRequest` type now includes:
- `verificationToken?: string` - Secure random token for verification
- `tokenExpiration?: number` - Unix timestamp when token expires (24 hours)

## Usage Example

### Creating a Privacy Request with Verification

```typescript
import { createPrivacyRequestWithVerification } from './privacy-requests'
import { sendVerificationEmail } from './verification-email'
import { getResendApiKey } from './secrets'

// Create privacy request
const privacyRequest = await createPrivacyRequestWithVerification(
  'privacy-requests',
  'access', // or 'deletion' or 'portability'
  'user@example.com'
)

// Send verification email
const resendApiKey = await getResendApiKey()
await sendVerificationEmail(privacyRequest, resendApiKey)
```

### Verification Endpoint (Automatic)

The verification endpoint is handled automatically by the Lambda function. Users simply click the link in their email.

## Security Features

1. **Secure Token Generation**: 32-byte cryptographically random tokens
2. **URL-Safe Encoding**: Tokens are base64-encoded and URL-safe
3. **24-Hour Expiration**: Tokens expire after 24 hours
4. **One-Time Use**: Tokens are marked as used after verification
5. **Email Verification**: Ensures request comes from the email owner
6. **Status Tracking**: Prevents duplicate processing

## Deployment

### 1. Build the Lambda Functions

```bash
cd lambda/lead-processor
npm install
npm run build
```

This creates two Lambda handlers:
- `dist/index.js` - Main lead processor
- `dist/verify-handler.js` - Verification endpoint

### 2. Deploy Lambda Functions

You'll need to create a new Lambda function for the verification endpoint:

**Function Name**: `privacy-request-verifier`
**Handler**: `verify-handler.handler`
**Runtime**: Node.js 20.x
**Environment Variables**: See above

### 3. Configure API Gateway

Create a new API Gateway route:
- Path: `/api/verify-privacy-request`
- Method: GET
- Integration: Lambda function `privacy-request-verifier`

### 4. Update Secrets Manager

Ensure the Resend API key is stored in Secrets Manager:
```bash
aws secretsmanager create-secret \
  --name portfolio/resend-api-key \
  --secret-string "your-resend-api-key"
```

## Testing

### Manual Testing

1. Create a privacy request with verification:
```typescript
const request = await createPrivacyRequestWithVerification(
  'privacy-requests',
  'access',
  'test@example.com'
)
```

2. Check email for verification link

3. Click verification link

4. Verify success page appears

5. Check email for response with data

### Token Expiration Testing

1. Create a request
2. Wait 24+ hours
3. Try to verify - should fail with expiration message

## Error Handling

The implementation handles:
- Invalid tokens
- Expired tokens
- Missing query parameters
- Already processed requests
- DynamoDB errors
- Email sending failures (non-blocking)

## Next Steps

1. **Deploy Infrastructure**: Update Terraform to create the verification Lambda and API Gateway route
2. **Configure DNS**: Ensure the verification URL is accessible
3. **Test End-to-End**: Test the complete flow from request to verification
4. **Monitor**: Set up CloudWatch alarms for failed verifications
5. **Documentation**: Update user-facing privacy policy with verification process

## Files Modified/Created

### Created
- `lambda/lead-processor/src/verification-email.ts` - Email templates and sending
- `lambda/lead-processor/src/verify-handler.ts` - Verification endpoint handler
- `lambda/lead-processor/VERIFICATION_IMPLEMENTATION.md` - This file

### Modified
- `lambda/lead-processor/src/privacy-requests.ts` - Added verification functions
- `lambda/lead-processor/src/secrets.ts` - Added Resend API key retrieval
- `lambda/lead-processor/src/types.ts` - Updated PrivacyRequest type
- `lambda/lead-processor/package.json` - Added Resend dependency
- `lambda/lead-processor/esbuild.config.js` - Added verify-handler build

## Dependencies Added

- `resend@^4.0.1` - Email sending service
