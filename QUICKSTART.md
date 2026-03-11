# 🚀 Quick Start - Add Secrets & Test

Your AWS infrastructure is deployed! Follow these steps to complete the setup.

---

## Step 1: Add Secrets to AWS (2 minutes)

### Add Turnstile Secret

```bash
aws secretsmanager put-secret-value \
  --secret-id portfolio/turnstile-secret \
  --secret-string "YOUR_TURNSTILE_SECRET_KEY_HERE" \
  --region us-east-1 \
  --profile AdministratorAccess-123456789012
```

### Add Resend API Key

Get your API key from: https://resend.com/api-keys

```bash
aws secretsmanager put-secret-value \
  --secret-id portfolio/resend-api-key \
  --secret-string "YOUR_RESEND_API_KEY_HERE" \
  --region us-east-1 \
  --profile AdministratorAccess-123456789012
```

### Verify Secrets (Optional)

```bash
# Check Turnstile
aws secretsmanager get-secret-value \
  --secret-id portfolio/turnstile-secret \
  --region us-east-1 \
  --profile AdministratorAccess-123456789012 \
  --query 'SecretString' \
  --output text

# Check Resend
aws secretsmanager get-secret-value \
  --secret-id portfolio/resend-api-key \
  --region us-east-1 \
  --profile AdministratorAccess-123456789012 \
  --query 'SecretString' \
  --output text
```

---

## Step 2: Update .env.local (1 minute)

```bash
# Generate HMAC client secret
HMAC_SECRET=$(openssl rand -hex 32)

# Create/update .env.local
cat > .env.local << EOF
# API Gateway URL (base URL from Terraform output; app appends /leads automatically)
NEXT_PUBLIC_API_GATEWAY_URL=https://v2f981iw9h.execute-api.us-east-1.amazonaws.com/

# Turnstile site key (you already have this)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<YOUR_SITE_KEY>

# HMAC client secret (auto-generated)
NEXT_PUBLIC_HMAC_CLIENT_SECRET=$HMAC_SECRET
EOF

echo "✅ .env.local created!"
echo "⚠️  Don't forget to add your Turnstile site key!"
```

---

## Step 3: Test Locally (2 minutes)

```bash
# Start dev server
npm run dev
```

1. Open http://localhost:3000
2. Click "Let's Build Together" button
3. Fill out contact form
4. Submit and check:
   - Success message appears
   - Email notification received
   - No errors in console

---

## Step 4: Deploy to Production (2 minutes)

### Update Cloudflare Pages Environment Variables

1. Go to: https://dash.cloudflare.com
2. Navigate to: **Pages → Your Site → Settings → Environment Variables**
3. Add for **Production**:
   - `NEXT_PUBLIC_API_GATEWAY_URL` = `https://v2f981iw9h.execute-api.us-east-1.amazonaws.com/`
   - `NEXT_PUBLIC_HMAC_CLIENT_SECRET` = (copy from .env.local)
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = (copy from .env.local)
4. Save and redeploy

---

## Troubleshooting

### "API Gateway URL not configured"
- Check `.env.local` has `NEXT_PUBLIC_API_GATEWAY_URL`
- Restart dev server: `npm run dev`

### "Please complete the security challenge"
- Check `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is correct
- Use test key for development: `1x00000000000000000000AA`

### "Failed to send message"
- Check browser console for errors
- Check Lambda logs:
  ```bash
  aws logs tail /aws/lambda/portfolio-leads-prod-lead-processor \
    --follow \
    --region us-east-1 \
    --profile AdministratorAccess-123456789012
  ```

### "Email not received"
- Check Resend API key is correct in Secrets Manager
- Check email notifier logs:
  ```bash
  aws logs tail /aws/lambda/portfolio-leads-prod-email-notifier \
    --follow \
    --region us-east-1 \
    --profile AdministratorAccess-123456789012
  ```
- Check DLQ for failed events:
  ```bash
  aws sqs receive-message \
    --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/portfolio-leads-prod-email-notifier-dlq \
    --region us-east-1 \
    --profile AdministratorAccess-123456789012
  ```

---

## View Infrastructure

### API Gateway URL
```
https://v2f981iw9h.execute-api.us-east-1.amazonaws.com/
```

### DynamoDB Table
```bash
# List all leads
aws dynamodb scan \
  --table-name portfolio-leads-prod-table \
  --region us-east-1 \
  --profile AdministratorAccess-123456789012

# Query recent leads
aws dynamodb query \
  --table-name portfolio-leads-prod-table \
  --index-name createdAt-index \
  --key-condition-expression "#type = :type" \
  --expression-attribute-names '{"#type":"type"}' \
  --expression-attribute-values '{":type":{"S":"LEAD"}}' \
  --scan-index-forward false \
  --limit 10 \
  --region us-east-1 \
  --profile AdministratorAccess-123456789012
```

### CloudWatch Logs
- Lead Processor: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252Fportfolio-leads-prod-lead-processor
- Email Notifier: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252Fportfolio-leads-prod-email-notifier

---

## What's Next?

### ✅ Complete
- AWS infrastructure deployed
- Secrets management configured
- Security layers active

### 📋 To Do
- [ ] Add Turnstile secret to AWS
- [ ] Add Resend API key to AWS
- [ ] Update .env.local
- [ ] Test locally
- [ ] Update Cloudflare Pages env vars
- [ ] Test in production

### 🚀 Future Enhancements
- [ ] Add CloudFront for WAF protection
- [ ] Set up admin dashboard to view leads
- [ ] Add email auto-responder
- [ ] Implement lead scoring
- [ ] Add analytics tracking

---

**Need help?** Check the detailed guides:
- `docs/secrets-setup-guide.md` - Comprehensive secrets guide
- `docs/deployment-fixes-summary.md` - What was deployed and why
- `docs/aws-sso-setup.md` - AWS authentication guide

