#!/bin/bash
# Populate AWS Secrets Manager with required secrets
# Usage: ./scripts/populate-secrets.sh

set -e

PROFILE="portfolio-prod"
REGION="us-east-1"

echo "🔐 AWS Secrets Manager - Secret Population Script"
echo "=================================================="
echo ""

# Check if AWS CLI is configured
if ! aws sts get-caller-identity --profile $PROFILE --region $REGION &> /dev/null; then
    echo "❌ Error: AWS CLI is not configured or credentials are invalid"
    echo "Run: aws configure"
    exit 1
fi

echo "✅ AWS credentials verified"
echo ""

# Cloudflare Turnstile Secret
echo "📝 Enter your Cloudflare Turnstile SECRET KEY:"
echo "   (Get from: https://dash.cloudflare.com/ → Turnstile)"
read -r TURNSTILE_SECRET

if [ -z "$TURNSTILE_SECRET" ]; then
    echo "⚠️  Skipping Turnstile secret (empty value)"
else
    echo "⏳ Uploading Turnstile secret..."
    aws secretsmanager put-secret-value \
        --profile $PROFILE \
        --region $REGION \
        --secret-id portfolio/turnstile-secret \
        --secret-string "$TURNSTILE_SECRET"
    echo "✅ Turnstile secret uploaded"
fi

echo ""

# Resend API Key
echo "📝 Enter your Resend API KEY:"
echo "   (Get from: https://resend.com/api-keys)"
read -r RESEND_API_KEY

if [ -z "$RESEND_API_KEY" ]; then
    echo "⚠️  Skipping Resend API key (empty value)"
else
    echo "⏳ Uploading Resend API key..."
    aws secretsmanager put-secret-value \
        --profile $PROFILE \
        --region $REGION \
        --secret-id portfolio/resend-api-key \
        --secret-string "$RESEND_API_KEY"
    echo "✅ Resend API key uploaded"
fi

echo ""
echo "🎉 Secrets uploaded successfully!"
echo ""
echo "Next steps:"
echo "1. Restart your dev server: npm run dev"
echo "2. Test the contact form"
echo "3. Check for email notification"

