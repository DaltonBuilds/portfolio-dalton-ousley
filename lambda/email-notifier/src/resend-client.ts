/**
 * Resend Email Client
 * 
 * Sends email notifications via Resend API
 */

import { Resend } from "resend"
import type { LeadSubmittedEvent } from "./types"
import { getResendApiKey } from "./secrets"

// Environment variables
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL!
const FROM_EMAIL = process.env.FROM_EMAIL!

/**
 * Formats lead data into HTML email
 */
function formatLeadEmail(lead: LeadSubmittedEvent): string {
  const date = new Date(lead.createdAt).toLocaleString()
  
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
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .content {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .field {
          margin-bottom: 20px;
          background: white;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #667eea;
        }
        .label {
          font-weight: 600;
          color: #667eea;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }
        .value {
          color: #333;
          font-size: 16px;
        }
        .message {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          color: #666;
          font-size: 12px;
        }
        .cta-button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 15px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0; font-size: 24px;">🎯 New Lead Submission</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone wants to work with you!</p>
      </div>
      
      <div class="content">
        <div class="field">
          <div class="label">Name</div>
          <div class="value">${escapeHtml(lead.name)}</div>
        </div>
        
        <div class="field">
          <div class="label">Email</div>
          <div class="value">
            <a href="mailto:${escapeHtml(lead.email)}" style="color: #667eea; text-decoration: none;">
              ${escapeHtml(lead.email)}
            </a>
          </div>
        </div>
        
        ${lead.company ? `
        <div class="field">
          <div class="label">Company</div>
          <div class="value">${escapeHtml(lead.company)}</div>
        </div>
        ` : ''}
        
        <div class="field">
          <div class="label">Message</div>
          <div class="value message">${escapeHtml(lead.message)}</div>
        </div>
        
        <div class="field">
          <div class="label">Received</div>
          <div class="value">${date}</div>
        </div>
        
        <div class="field">
          <div class="label">Lead ID</div>
          <div class="value" style="font-family: monospace; font-size: 14px;">${lead.leadId}</div>
        </div>
        
        <div style="text-align: center;">
          <a href="mailto:${escapeHtml(lead.email)}?subject=Re: Your inquiry" class="cta-button">
            Reply to Lead
          </a>
        </div>
      </div>
      
      <div class="footer">
        <p>This notification was sent by your portfolio lead capture system.</p>
        <p>Lead ID: <code>${lead.leadId}</code></p>
      </div>
    </body>
    </html>
  `
}

/**
 * Formats lead data into plain text email
 */
function formatLeadTextEmail(lead: LeadSubmittedEvent): string {
  const date = new Date(lead.createdAt).toLocaleString()
  
  return `
NEW LEAD SUBMISSION
===================

Name: ${lead.name}
Email: ${lead.email}
${lead.company ? `Company: ${lead.company}\n` : ''}
Message:
${lead.message}

Received: ${date}
Lead ID: ${lead.leadId}

---
Reply to this lead: ${lead.email}
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
 * Sends email notification for a new lead
 */
export async function sendLeadNotification(lead: LeadSubmittedEvent): Promise<void> {
  // Get Resend API key
  const apiKey = await getResendApiKey()
  
  // Initialize Resend client
  const resend = new Resend(apiKey)

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFICATION_EMAIL,
      subject: `New Lead: ${lead.name}${lead.company ? ` from ${lead.company}` : ''}`,
      html: formatLeadEmail(lead),
      text: formatLeadTextEmail(lead),
      replyTo: lead.email,
      tags: [
        { name: 'type', value: 'lead-notification' },
        { name: 'leadId', value: lead.leadId },
      ],
    })

  } catch (error) {
    console.error("Failed to send email:", error)
    throw new Error("Failed to send email notification")
  }
}

