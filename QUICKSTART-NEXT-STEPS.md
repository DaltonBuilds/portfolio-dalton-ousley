# Quick Start - Next Steps

**Date:** October 4, 2025  
**Status:** Infrastructure Deployed ✅ | Secrets Need Population ⚠️

## Current Situation

You successfully submitted a test lead! 🎉 The data is in DynamoDB. However:

- ❌ Turnstile widget not showing (needs dev server restart)
- ❌ No email notifications (Resend API key not populated)

## What You Need to Do Right Now

### Step 1: Restart Your Dev Server

Your `.env.local` file was just created with these values:
```bash
NEXT_PUBLIC_API_GATEWAY_URL=https://v2f981iw9h.execute-api.us-east-1.amazonaws.com/leads
NEXT_PUBLIC_HMAC_CLIENT_SECRET=dev-secret-key-change-in-production-1234567890abcdef
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA  # Test key (always passes)
```

**Action:** Stop your dev server (Ctrl+C) and restart it:
```bash
npm run dev
```

After restart, you should see the Cloudflare Turnstile widget in the contact form instead of the error message.

### Step 2: Populate AWS Secrets Manager

Run this interactive script:
```bash
./scripts/populate-secrets.sh
```

You'll be prompted for:
1. **Cloudflare Turnstile Secret Key** - Get from https://dash.cloudflare.com/ → Turnstile
2. **Resend API Key** - Get from https://resend.com/api-keys

**Don't have these yet?** You can get them:
- **Turnstile:** Create a new site at https://dash.cloudflare.com/?to=/:account/turnstile
  - Site domain: `daltonousley.com` (or `localhost` for testing)
  - Widget mode: Managed
  - Copy both Site Key and Secret Key
- **Resend:** Sign up at https://resend.com and create an API key

### Step 3: Test End-to-End

1. Open your contact form
2. Fill it out and submit
3. Check your email inbox (example@gmail.com)
4. You should receive a notification email!

## Environment Variables Needed

### Local Development (`.env.local`) - ✅ Already Created
```bash
NEXT_PUBLIC_API_GATEWAY_URL=https://v2f981iw9h.execute-api.us-east-1.amazonaws.com/leads
NEXT_PUBLIC_HMAC_CLIENT_SECRET=dev-secret-key-change-in-production-1234567890abcdef
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

### Production (Cloudflare Pages) - ⏳ Todo
When you're ready to deploy to production:

1. Go to Cloudflare Pages dashboard
2. Settings → Environment Variables → Production
3. Add these variables:
   ```
   NEXT_PUBLIC_API_GATEWAY_URL=https://v2f981iw9h.execute-api.us-east-1.amazonaws.com/leads
   NEXT_PUBLIC_HMAC_CLIENT_SECRET=<generate with: openssl rand -hex 32>
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=<your real site key from Cloudflare>
   ```

**Important:** Use a different HMAC client secret for production!

## Manual Secret Population (Alternative to Script)

If you prefer to do it manually:

```bash
# Turnstile Secret
aws secretsmanager put-secret-value \
  --region us-east-1 \
  --secret-id portfolio/turnstile-secret \
  --secret-string "YOUR_TURNSTILE_SECRET_HERE"

# Resend API Key
aws secretsmanager put-secret-value \
  --region us-east-1 \
  --secret-id portfolio/resend-api-key \
  --secret-string "YOUR_RESEND_API_KEY_HERE"
```

## What's Already Done ✅

- Infrastructure deployed (Terraform)
- DynamoDB table created
- Lambda functions deployed
- API Gateway configured
- EventBridge event bus set up
- Secrets Manager resources created
- HMAC server secret auto-generated
- Frontend form built with validation
- Turnstile integration code added
- Local environment file created

## Next Phase (After Secrets Are Populated)

**Task 4.2:** End-to-End Testing
- Test all form validation scenarios
- Test bot protection
- Test email notifications
- Test idempotency (duplicate submissions)
- Test error handling

## Troubleshooting

### Turnstile widget still not showing
- Did you restart the dev server?
- Check browser console for errors
- Verify `.env.local` exists and has `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

### No email received
- Check spam folder
- Verify Resend API key is valid
- Check CloudWatch logs: `/aws/lambda/portfolio-leads-prod-email-notifier`
- Verify email address in `terraform/terraform.tfvars` matches your inbox

### Form submission fails
- Check browser console for API errors
- Check CloudWatch logs: `/aws/lambda/portfolio-leads-prod-lead-processor`
- Verify API Gateway URL is correct in `.env.local`

## Resources

- **API Gateway URL:** https://v2f981iw9h.execute-api.us-east-1.amazonaws.com/leads
- **DynamoDB Table:** portfolio-leads-prod-table
- **Event Bus:** portfolio-leads-prod-bus
- **Notification Email:** example@gmail.com

---

**Questions?** Check `docs/aws-lead-capture-tasks.md` for the full task list.

