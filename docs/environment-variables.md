# Environment Variables Configuration

This document describes all environment variables needed for the AWS Lead Capture System.

## Required Environment Variables

### API Configuration

#### `NEXT_PUBLIC_API_GATEWAY_URL`
- **Description:** AWS API Gateway endpoint URL for lead submission
- **Example:** `https://abc123.execute-api.us-east-1.amazonaws.com/prod/leads`
- **When to set:** After Terraform deployment in Phase 3
- **Visibility:** Public (exposed to browser)

### Security & Authentication

#### `NEXT_PUBLIC_HMAC_CLIENT_SECRET`
- **Description:** HMAC client secret for request signing
- **Format:** Hex string, 32+ characters recommended
- **Generate with:** `openssl rand -hex 32`
- **Note:** This is a "public" secret embedded in client-side code. The server uses a different secret for verification stored in AWS Secrets Manager.
- **Visibility:** Public (exposed to browser)
- **Security:** While this is visible in the browser, the server secret remains secure in AWS Secrets Manager. Both secrets are required for successful verification.

### Bot Protection

#### `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- **Description:** Cloudflare Turnstile site key for bot protection
- **Get from:** https://dash.cloudflare.com/?to=/:account/turnstile
- **Note:** Use the "Site Key" (not the Secret Key)
- **Visibility:** Public (exposed to browser)

## Setting Up Environment Variables

### Local Development

1. Create a `.env.local` file in the project root:
   ```bash
   touch .env.local
   ```

2. Add the following content:
   ```bash
   # API Configuration
   NEXT_PUBLIC_API_GATEWAY_URL=
   
   # Security
   NEXT_PUBLIC_HMAC_CLIENT_SECRET=
   
   # Bot Protection
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=
   ```

3. Fill in the values after AWS infrastructure is deployed

### Cloudflare Pages Production

1. Go to your Cloudflare Pages dashboard
2. Navigate to: **Settings → Environment Variables**
3. Add each variable for the **Production** environment
4. Click **Save**

## Development/Testing Values

### Turnstile Test Keys

Cloudflare provides test keys for development:

- **Always passes:** `1x00000000000000000000AA`
- **Always fails:** `2x00000000000000000000AB`
- **Forces interactive challenge:** `3x00000000000000000000FF`

Documentation: https://developers.cloudflare.com/turnstile/reference/testing/

### Local Development Setup

Before AWS infrastructure is deployed, you can use placeholder values:

```bash
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:3001/dev/leads
NEXT_PUBLIC_HMAC_CLIENT_SECRET=dev-secret-key-change-in-production-12345678
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

## Security Best Practices

1. ✅ **Never commit** `.env.local` to git (it's already in `.gitignore`)
2. ✅ **Rotate secrets** periodically (every 90 days recommended)
3. ✅ **Use different secrets** for development and production
4. ✅ **Server secrets** (HMAC verification, Turnstile secret, Resend API key) are stored in AWS Secrets Manager, NOT in environment variables
5. ✅ **Document** all environment variables in this file

## Server-Side Secrets (AWS Secrets Manager)

These secrets are **NOT** set as environment variables but are stored securely in AWS Secrets Manager:

- `portfolio/hmac-server-secret` - Server-side HMAC verification secret
- `portfolio/turnstile-secret` - Cloudflare Turnstile secret key
- `portfolio/resend-api-key` - Resend API key for email notifications

Lambda functions retrieve these secrets at runtime using the AWS SDK.

## Troubleshooting

### "API Gateway URL not configured" error
- Ensure `NEXT_PUBLIC_API_GATEWAY_URL` is set in `.env.local`
- Restart the dev server after adding environment variables

### "HMAC client secret not configured" error
- Ensure `NEXT_PUBLIC_HMAC_CLIENT_SECRET` is set in `.env.local`
- Generate a new secret with: `openssl rand -hex 32`

### Changes not taking effect
- Environment variables are loaded at build time
- Restart the dev server: `npm run dev`
- For production, redeploy the application

## Next Steps

After AWS infrastructure is deployed (Phase 3):
1. Copy the API Gateway URL from Terraform outputs
2. Generate HMAC client secret: `openssl rand -hex 32`
3. Get Turnstile site key from Cloudflare dashboard
4. Update `.env.local` with actual values
5. Update Cloudflare Pages environment variables

