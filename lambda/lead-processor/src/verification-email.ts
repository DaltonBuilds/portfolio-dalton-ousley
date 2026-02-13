/**
 * Verification Email Module
 * 
 * Sends verification emails for privacy requests using Resend
 */

import { Resend } from "resend"
import type { PrivacyRequest } from "./types"

// Environment variables
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@daltonousley.com"
const VERIFICATION_BASE_URL = process.env.VERIFICATION_BASE_URL || "https://daltonousley.com/api/verify-privacy-request"

/**
 * Formats verification email HTML
 */
function formatVerificationEmailHtml(
  privacyRequest: PrivacyRequest,
  verificationUrl: string
): string {
  const requestTypeLabel = {
    access: "Data Access",
    deletion: "Data Deletion",
    portability: "Data Portability",
  }[privacyRequest.requestType]

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .content {
          padding: 30px;
        }
        .button {
          display: inline-block;
          background: #667eea;
          color: white !important;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .info-box {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #667eea;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #e0e0e0;
        }
        .warning {
          background: #fff3cd;
          border-left-color: #ffc107;
          color: #856404;
        }
        code {
          background: #f4f4f4;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: monospace;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">🔐 Verify Your Privacy Request</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">${requestTypeLabel} Request</p>
        </div>
        
        <div class="content">
          <p>Hello,</p>
          
          <p>We received a <strong>${requestTypeLabel}</strong> request for the email address <strong>${escapeHtml(privacyRequest.requesterEmail)}</strong>.</p>
          
          <p>To verify that you made this request and to proceed with processing, please click the button below:</p>
          
          <div class="button-container">
            <a href="${escapeHtml(verificationUrl)}" class="button">
              Verify Privacy Request
            </a>
          </div>
          
          <div class="info-box">
            <strong>Request Details:</strong><br>
            <strong>Type:</strong> ${requestTypeLabel}<br>
            <strong>Email:</strong> ${escapeHtml(privacyRequest.requesterEmail)}<br>
            <strong>Request ID:</strong> <code>${privacyRequest.id}</code><br>
            <strong>Requested:</strong> ${new Date(privacyRequest.requestedAt).toLocaleString()}
          </div>
          
          <div class="info-box warning">
            <strong>⚠️ Important:</strong><br>
            • This verification link will expire in <strong>24 hours</strong><br>
            • If you did not make this request, you can safely ignore this email<br>
            • Do not share this link with anyone
          </div>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <code style="word-break: break-all;">${escapeHtml(verificationUrl)}</code>
          </p>
        </div>
        
        <div class="footer">
          <p>This email was sent by daltonousley.com privacy request system.</p>
          <p>Request ID: <code>${privacyRequest.id}</code></p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Formats verification email plain text
 */
function formatVerificationEmailText(
  privacyRequest: PrivacyRequest,
  verificationUrl: string
): string {
  const requestTypeLabel = {
    access: "Data Access",
    deletion: "Data Deletion",
    portability: "Data Portability",
  }[privacyRequest.requestType]

  return `
VERIFY YOUR PRIVACY REQUEST
============================

Hello,

We received a ${requestTypeLabel} request for the email address ${privacyRequest.requesterEmail}.

To verify that you made this request and to proceed with processing, please visit this link:

${verificationUrl}

REQUEST DETAILS:
Type: ${requestTypeLabel}
Email: ${privacyRequest.requesterEmail}
Request ID: ${privacyRequest.id}
Requested: ${new Date(privacyRequest.requestedAt).toLocaleString()}

IMPORTANT:
• This verification link will expire in 24 hours
• If you did not make this request, you can safely ignore this email
• Do not share this link with anyone

---
This email was sent by daltonousley.com privacy request system.
Request ID: ${privacyRequest.id}
  `.trim()
}

/**
 * Escapes HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char] || char)
}

/**
 * Sends verification email for privacy request
 * 
 * @param privacyRequest - Privacy request with verification token
 * @param resendApiKey - Resend API key
 * @returns Promise that resolves when email is sent
 */
export async function sendVerificationEmail(
  privacyRequest: PrivacyRequest,
  resendApiKey: string
): Promise<void> {
  if (!privacyRequest.verificationToken) {
    throw new Error("Privacy request missing verification token")
  }

  // Construct verification URL
  const verificationUrl = `${VERIFICATION_BASE_URL}?token=${encodeURIComponent(privacyRequest.verificationToken)}&id=${encodeURIComponent(privacyRequest.id)}`

  // Initialize Resend client
  const resend = new Resend(resendApiKey)

  const requestTypeLabel = {
    access: "Data Access",
    deletion: "Data Deletion",
    portability: "Data Portability",
  }[privacyRequest.requestType]

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: privacyRequest.requesterEmail,
      subject: `Verify Your ${requestTypeLabel} Request`,
      html: formatVerificationEmailHtml(privacyRequest, verificationUrl),
      text: formatVerificationEmailText(privacyRequest, verificationUrl),
      tags: [
        { name: 'type', value: 'privacy-request-verification' },
        { name: 'requestType', value: privacyRequest.requestType },
        { name: 'requestId', value: privacyRequest.id },
      ],
    })

    console.log(`Verification email sent to ${privacyRequest.requesterEmail} for request ${privacyRequest.id}`)
  } catch (error) {
    console.error("Failed to send verification email:", error)
    throw new Error("Failed to send verification email")
  }
}


/**
 * Formats response email HTML for access request
 */
function formatAccessResponseEmailHtml(
  privacyRequest: PrivacyRequest,
  data: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .content {
          padding: 30px;
        }
        .data-box {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #28a745;
          margin: 20px 0;
          font-family: monospace;
          font-size: 12px;
          overflow-x: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #e0e0e0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">✅ Your Data Access Request</h1>
        </div>
        
        <div class="content">
          <p>Hello,</p>
          
          <p>Your data access request has been processed. Below is all the personal data we have stored for <strong>${escapeHtml(privacyRequest.requesterEmail)}</strong>:</p>
          
          <div class="data-box">${escapeHtml(data)}</div>
          
          <p>This data is provided in JSON format for easy portability.</p>
          
          <p>If you have any questions or would like to request deletion of this data, please reply to this email.</p>
        </div>
        
        <div class="footer">
          <p>This email was sent by daltonousley.com privacy request system.</p>
          <p>Request ID: <code>${privacyRequest.id}</code></p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Formats response email HTML for deletion request
 */
function formatDeletionResponseEmailHtml(
  privacyRequest: PrivacyRequest,
  deletedCount: number
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .content {
          padding: 30px;
        }
        .success-box {
          background: #d4edda;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #28a745;
          margin: 20px 0;
          color: #155724;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #e0e0e0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">✅ Your Data Deletion Request</h1>
        </div>
        
        <div class="content">
          <p>Hello,</p>
          
          <p>Your data deletion request has been processed successfully.</p>
          
          <div class="success-box">
            <strong>✓ Deletion Complete</strong><br>
            We have permanently deleted <strong>${deletedCount}</strong> record(s) associated with <strong>${escapeHtml(privacyRequest.requesterEmail)}</strong>.
          </div>
          
          <p>Your personal data has been removed from our systems and cannot be recovered.</p>
          
          <p>If you have any questions, please reply to this email.</p>
        </div>
        
        <div class="footer">
          <p>This email was sent by daltonousley.com privacy request system.</p>
          <p>Request ID: <code>${privacyRequest.id}</code></p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Formats response email HTML for portability request
 */
function formatPortabilityResponseEmailHtml(
  privacyRequest: PrivacyRequest,
  data: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .content {
          padding: 30px;
        }
        .data-box {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #28a745;
          margin: 20px 0;
          font-family: monospace;
          font-size: 12px;
          overflow-x: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #e0e0e0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">✅ Your Data Portability Request</h1>
        </div>
        
        <div class="content">
          <p>Hello,</p>
          
          <p>Your data portability request has been processed. Below is all your personal data in machine-readable JSON format:</p>
          
          <div class="data-box">${escapeHtml(data)}</div>
          
          <p>You can copy this data and import it into other systems as needed.</p>
          
          <p>If you have any questions, please reply to this email.</p>
        </div>
        
        <div class="footer">
          <p>This email was sent by daltonousley.com privacy request system.</p>
          <p>Request ID: <code>${privacyRequest.id}</code></p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Sends response email after privacy request is processed
 * 
 * @param privacyRequest - Completed privacy request
 * @param result - Result data (JSON string for access/portability, count for deletion)
 * @param resendApiKey - Resend API key
 */
export async function sendResponseEmail(
  privacyRequest: PrivacyRequest,
  result: { data?: string; deletedCount?: number },
  resendApiKey: string
): Promise<void> {
  const resend = new Resend(resendApiKey)

  let subject: string
  let html: string
  let text: string

  switch (privacyRequest.requestType) {
    case "access":
      subject = "Your Data Access Request - Complete"
      html = formatAccessResponseEmailHtml(privacyRequest, result.data || "[]")
      text = `Your data access request has been processed.\n\nData:\n${result.data || "[]"}\n\nRequest ID: ${privacyRequest.id}`
      break

    case "deletion":
      subject = "Your Data Deletion Request - Complete"
      html = formatDeletionResponseEmailHtml(privacyRequest, result.deletedCount || 0)
      text = `Your data deletion request has been processed.\n\nDeleted ${result.deletedCount || 0} record(s).\n\nRequest ID: ${privacyRequest.id}`
      break

    case "portability":
      subject = "Your Data Portability Request - Complete"
      html = formatPortabilityResponseEmailHtml(privacyRequest, result.data || "[]")
      text = `Your data portability request has been processed.\n\nData:\n${result.data || "[]"}\n\nRequest ID: ${privacyRequest.id}`
      break
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: privacyRequest.requesterEmail,
      subject,
      html,
      text,
      tags: [
        { name: 'type', value: 'privacy-request-response' },
        { name: 'requestType', value: privacyRequest.requestType },
        { name: 'requestId', value: privacyRequest.id },
      ],
    })

    console.log(`Response email sent to ${privacyRequest.requesterEmail} for request ${privacyRequest.id}`)
  } catch (error) {
    console.error("Failed to send response email:", error)
    throw new Error("Failed to send response email")
  }
}
