# Task 4.2: End-to-End Testing Checklist

**Status:** Ready to begin testing  
**Date:** October 3, 2025

## Pre-Test Verification ✅

- ✅ Infrastructure deployed to AWS (us-east-1)
- ✅ All secrets in AWS Secrets Manager (us-east-1)
- ✅ API Gateway URL: `https://v2f981iw9h.execute-api.us-east-1.amazonaws.com/`
- ✅ `.env.local` created with all environment variables
- ✅ Turnstile widget renders in form
- ⏳ Dev server needs restart to load new environment variables

---

## Testing Environment Setup

### Step 1: Restart Dev Server

Your `.env.local` file has been created with:
```bash
NEXT_PUBLIC_API_GATEWAY_URL=https://v2f981iw9h.execute-api.us-east-1.amazonaws.com/
NEXT_PUBLIC_HMAC_CLIENT_SECRET=f4598490e4aedb1559f1386b1bcdd7b79031aa9fc8e5858ac953bb720ccdaa1d
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA  # Test key (always passes)
```

**Restart your dev server:**
```bash
# Press Ctrl+C to stop current server
npm run dev
```

### Step 2: Verify Environment Variables Loaded

After restart, open your browser console and check:
```javascript
// Should NOT be undefined
console.log(process.env.NEXT_PUBLIC_API_GATEWAY_URL)
```

---

## Test Scenarios

### ✅ Test 1: Turnstile Widget Renders
**Status:** PASSED (you confirmed this!)
- Widget appears in the form
- No console errors

---

### Test 2: Form Validation (Client-Side)

**Test 2.1: Empty Form Submission**
1. Open contact modal
2. Click "Send Message" without filling anything
3. **Expected:** Validation errors appear for required fields

**Test 2.2: Invalid Email**
1. Enter name: "Test User"
2. Enter email: "not-an-email"
3. Enter message: "Test message"
4. **Expected:** Email validation error

**Test 2.3: Message Too Short**
1. Fill all fields correctly
2. Enter message: "Hi" (less than 10 chars)
3. **Expected:** Message length validation error

---

### Test 3: Valid Form Submission

**Test 3.1: Submit Valid Lead**
1. Fill out form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Company: "Test Company" (optional)
   - Message: "This is a test message from localhost testing"
2. Click "Send Message"
3. **Expected:**
   - Loading spinner appears
   - Button disabled during submission
   - Success toast: "Message sent! We'll be in touch soon."
   - Form closes automatically
   - No errors in browser console

**Verification Commands:**

Check DynamoDB for the lead:
```bash
aws dynamodb scan \
  --table-name portfolio-leads-prod \
  --region us-east-1 \
  --profile AdministratorAccess-123456789012 \
  --output table
```

Check CloudWatch logs for Lambda execution:
```bash
# Lead Processor logs
aws logs tail /aws/lambda/portfolio-lead-processor-prod \
  --region us-east-1 \
  --profile AdministratorAccess-123456789012 \
  --follow

# Email Notifier logs
aws logs tail /aws/lambda/portfolio-email-notifier-prod \
  --region us-east-1 \
  --profile AdministratorAccess-123456789012 \
  --follow
```

Check your email inbox for notification from Resend.

---

### Test 4: Idempotency (Duplicate Prevention)

**Test 4.1: Same Form Data, Different Session**
1. Submit the same lead data again (new form open)
2. **Expected:**
   - Should succeed (new idempotency key generated)
   - New lead created in DynamoDB
   - New email sent

**Test 4.2: Browser Refresh During Submission** (Advanced)
1. Submit form
2. Quickly refresh browser before completion
3. **Expected:**
   - Original submission should complete
   - No duplicate leads

---

### Test 5: Error Handling

**Test 5.1: Network Error Simulation**
1. Open browser DevTools → Network tab
2. Set throttling to "Offline"
3. Try to submit form
4. **Expected:**
   - Error toast: Descriptive network error message
   - Form remains open
   - Can retry after going back online

**Test 5.2: Invalid Turnstile Token**
For production testing (not localhost with test key):
1. Manipulate Turnstile token in browser console
2. Submit form
3. **Expected:**
   - Error from Lambda: "Invalid Turnstile token"
   - Appropriate error message shown to user

---

### Test 6: HMAC Signature Verification

**Test 6.1: Valid HMAC**
- Normal form submission should work (already tested in Test 3)

**Test 6.2: Missing HMAC Headers** (Manual API Test)
```bash
# Try to submit without HMAC headers
curl -X POST https://v2f981iw9h.execute-api.us-east-1.amazonaws.com/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "message": "This should fail"
  }'
```
**Expected:** 401 Unauthorized or validation error

---

### Test 7: Email Notifications

**Verify Email Received:**
1. Check your inbox (email configured in Terraform variables)
2. **Expected email should contain:**
   - Subject: "🎯 New Lead Submission"
   - Lead name, email, company, message
   - Formatted HTML email
   - Timestamp

**Check Resend Dashboard:**
1. Go to https://resend.com/emails
2. Verify email was sent successfully
3. Check delivery status

---

### Test 8: Rate Limiting (WAF - Optional)

**Note:** WAF was created but not associated with API Gateway (HTTP API limitation). API Gateway has its own rate limiting configured.

**Test throttling limits:**
- Burst: 10 requests/second
- Steady: 5 requests/second

**Manual test:**
```bash
# Send multiple requests rapidly
for i in {1..15}; do
  echo "Request $i"
  curl -X POST https://v2f981iw9h.execute-api.us-east-1.amazonaws.com/ \
    -H "Content-Type: application/json" \
    -d '{"test": true}' &
done
wait
```

**Expected:** Some requests return 429 Too Many Requests

---

### Test 9: CloudWatch Metrics

**View metrics in AWS Console:**
1. Go to CloudWatch → Metrics
2. Check:
   - Lambda invocations
   - Lambda errors
   - Lambda duration
   - API Gateway 4xx/5xx errors
   - DynamoDB read/write capacity

---

### Test 10: Data Verification

**Check DynamoDB Lead Record:**
```bash
aws dynamodb get-item \
  --table-name portfolio-leads-prod \
  --key '{"leadId": {"S": "LEAD_ID_FROM_RESPONSE"}}' \
  --region us-east-1 \
  --profile AdministratorAccess-123456789012
```

**Expected fields:**
- `leadId` (UUID)
- `name`
- `email`
- `company`
- `message`
- `createdAt` (timestamp)
- `type` ("LEAD")
- `ttl` (18 months from now)

**Check TTL calculation:**
```bash
# Current timestamp
date +%s

# TTL should be ~18 months in the future (about 47,304,000 seconds)
# TTL = createdAt + 47304000
```

---

## Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| 1. Turnstile Renders | ✅ PASSED | Confirmed by user |
| 2. Form Validation | ⏳ Pending | |
| 3. Valid Submission | ⏳ Pending | |
| 4. Idempotency | ⏳ Pending | |
| 5. Error Handling | ⏳ Pending | |
| 6. HMAC Verification | ⏳ Pending | |
| 7. Email Notifications | ⏳ Pending | |
| 8. Rate Limiting | ⏳ Pending | |
| 9. CloudWatch Metrics | ⏳ Pending | |
| 10. Data Verification | ⏳ Pending | |

---

## Common Issues & Troubleshooting

### Issue: "API Gateway URL not configured"
**Solution:** 
- Verify `.env.local` exists and has `NEXT_PUBLIC_API_GATEWAY_URL`
- Restart dev server: `npm run dev`

### Issue: "Failed to submit lead"
**Solution:**
1. Check browser console for detailed error
2. Check CloudWatch logs:
   ```bash
   aws logs tail /aws/lambda/portfolio-lead-processor-prod \
     --region us-east-1 \
     --profile AdministratorAccess-123456789012 \
     --follow
   ```

### Issue: No email received
**Solution:**
1. Check Resend dashboard for delivery status
2. Check spam folder
3. Verify email address in Terraform variables
4. Check EventBridge rule is enabled
5. Check Email Notifier Lambda logs

### Issue: CORS errors in browser
**Solution:**
- API Gateway is configured for `https://daltonousley.com`
- Localhost should also work (configured in Terraform)
- If issues persist, check API Gateway CORS settings

### Issue: Turnstile widget not appearing
**Solution:**
- Check `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set
- Check browser console for errors
- Test key `1x00000000000000000000AA` should work on any domain

---

## Next Steps After Testing

Once all tests pass:

1. ✅ Update task checklist in `docs/aws-lead-capture-tasks.md`
2. Create production Turnstile site key for `daltonousley.com`
3. Update Cloudflare Pages environment variables
4. Deploy to production
5. Run production smoke test
6. Monitor for 24 hours

---

## Helper Scripts

Save these for quick testing:

**Check recent leads:**
```bash
aws dynamodb scan \
  --table-name portfolio-leads-prod \
  --region us-east-1 \
  --profile AdministratorAccess-123456789012 \
  --limit 5 \
  --output table
```

**Watch Lambda logs (both functions):**
```bash
# Terminal 1: Lead Processor
aws logs tail /aws/lambda/portfolio-lead-processor-prod \
  --region us-east-1 \
  --profile AdministratorAccess-123456789012 \
  --follow

# Terminal 2: Email Notifier  
aws logs tail /aws/lambda/portfolio-email-notifier-prod \
  --region us-east-1 \
  --profile AdministratorAccess-123456789012 \
  --follow
```

**Delete test leads:**
```bash
# Get all lead IDs
aws dynamodb scan \
  --table-name portfolio-leads-prod \
  --region us-east-1 \
  --profile AdministratorAccess-123456789012 \
  --projection-expression "leadId" \
  --output json | jq -r '.Items[].leadId.S'

# Delete a specific lead
aws dynamodb delete-item \
  --table-name portfolio-leads-prod \
  --key '{"leadId": {"S": "LEAD_ID_HERE"}}' \
  --region us-east-1 \
  --profile AdministratorAccess-123456789012
```

---

**Ready to start testing!** 🚀

Begin by restarting your dev server to load the new environment variables, then work through each test scenario.

