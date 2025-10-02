# AWS Lead Capture System - Project Tasks

**Project Goal:** Build a serverless, event-driven lead capture system on AWS that integrates with the existing Next.js portfolio site. This system will capture leads from "Let's Build Together" CTAs throughout the site, store them in DynamoDB, and send notifications via Resend.

**Tech Stack:**
- **Frontend:** Next.js 15, React 19, ShadCN UI, React Hook Form, Zod
- **Backend:** AWS Lambda (Node 20), API Gateway (HTTP API), DynamoDB, EventBridge
- **Security:** AWS WAF, Cloudflare Turnstile, HMAC request signing, AWS Secrets Manager
- **IaC:** Terraform
- **Email:** Resend API
- **Observability:** CloudWatch (basic logging for now)

**Resume Bullet Points This Demonstrates:**
- "Designed and deployed an event-driven serverless intake on AWS (API Gateway → Lambda → EventBridge → DynamoDB) with WAF, Secrets Manager, and Terraform"
- "Implemented idempotency, HMAC request signing, and bot protection (Turnstile + WAF); added structured logging"
- "Built full-stack lead capture system with React Hook Form, Zod validation, and AWS serverless architecture"

---

## ⚠️ Important Notes

### Quality Checks
**After completing each task, run the following checks:**
```bash
npm run lint        # ESLint checks
npm run build       # TypeScript type checks + build verification
```
**Do not proceed to the next task if there are linting or type errors.** Fix them immediately to avoid technical debt.

### Hosting Considerations
The site is currently hosted on **Cloudflare Pages** (evidenced by `@cloudflare/next-on-pages` in package.json). This is perfectly fine for now. The AWS infrastructure will handle only the lead capture API endpoint, which can be called from any hosting platform.

**Recommendation:** Keep the static site on Cloudflare for now. Benefits:
- ✅ Cloudflare has excellent global CDN and DDoS protection
- ✅ Free tier is generous and well-suited for static sites
- ✅ Fast edge deployments
- ✅ Already configured and working
- ✅ Cloudflare Turnstile integrates seamlessly (same ecosystem for bot protection)

**Future consideration:** If you want to move everything to AWS later (S3 + CloudFront + Route53), that's a great learning project. But for this sprint, keep frontend on Cloudflare and backend on AWS for a pragmatic multi-cloud architecture.

---

## Phase 1: Frontend Components & UI

### Task 1.1: Install Dependencies
**Description:** Add required packages for form handling, validation, bot protection, and API communication.

**Packages to install:**
- `react-hook-form` - Form state management
- `zod` - Runtime type validation
- `@hookform/resolvers` - Bridge between React Hook Form and Zod
- `@radix-ui/react-label` - ShadCN Label component (if not present)

**Acceptance Criteria:**
- [x] All packages installed via npm
- [x] package.json updated with correct versions
- [x] `npm run build` succeeds

---

### Task 1.2: Create ShadCN Dialog Component
**Description:** Add the ShadCN Dialog component if not already present (used for the popup modal).

**Files:**
- `src/components/ui/dialog.tsx`

**Acceptance Criteria:**
- [x] Dialog component follows ShadCN patterns
- [x] Supports theme-aware styling (light/dark mode)
- [x] Properly typed with TypeScript
- [x] No linting or type errors

---

### Task 1.3: Create ShadCN Input Component
**Description:** Add the ShadCN Input component for form fields.

**Files:**
- `src/components/ui/input.tsx`

**Acceptance Criteria:**
- [x] Input component follows ShadCN patterns
- [x] Theme-aware styling
- [x] Properly typed
- [x] No linting or type errors

---

### Task 1.4: Create ShadCN Textarea Component
**Description:** Add the ShadCN Textarea component for the message field.

**Files:**
- `src/components/ui/textarea.tsx`

**Acceptance Criteria:**
- [x] Textarea component follows ShadCN patterns
- [x] Theme-aware styling
- [x] Properly typed
- [x] No linting or type errors

---

### Task 1.5: Create ShadCN Label Component
**Description:** Add the ShadCN Label component for form field labels.

**Files:**
- `src/components/ui/label.tsx`

**Acceptance Criteria:**
- [x] Label component follows ShadCN patterns
- [x] Accessible (proper for/htmlFor associations)
- [x] Theme-aware styling
- [x] No linting or type errors

---

### Task 1.6: Create Lead Form Schema & Types
**Description:** Define the Zod schema for form validation and derive TypeScript types.

**Files:**
- `src/lib/validations/lead-form.ts`

**Schema Fields:**
- `name` - Required, min 2 chars, max 100 chars
- `email` - Required, valid email format
- `company` - Optional, max 100 chars
- `message` - Required, min 10 chars, max 1000 chars
- `turnstileToken` - Required string (from Cloudflare Turnstile)

**Acceptance Criteria:**
- [x] Zod schema with proper validation rules
- [x] TypeScript types exported
- [x] No 'any' types
- [x] No linting or type errors

---

### Task 1.7: Create Contact Form Modal Component
**Description:** Build the main contact form modal component with React Hook Form, Zod validation, and proper UX.

**Files:**
- `src/components/ContactFormModal.tsx`

**Features:**
- Dialog modal with backdrop
- Form fields: Name, Email, Company (optional), Message
- Cloudflare Turnstile integration (placeholder for now)
- Loading states during submission
- Success/error toast notifications
- Client-side validation with Zod
- Accessible form with proper labels and ARIA attributes
- Theme-aware styling

**Acceptance Criteria:**
- [x] Form opens in modal dialog
- [x] All form fields present and styled
- [x] Client-side validation working
- [x] Loading state during submission
- [x] Error handling with user feedback
- [x] Theme-aware (light/dark mode)
- [x] Fully typed with TypeScript
- [x] No linting or type errors

---

### Task 1.8: Create Toast Notification Component
**Description:** Add a toast notification system for success/error messages using `sonner` - it should already be installed.

**Files:**
- `src/components/ui/toast.tsx` (if custom)
- Update `src/app/layout.tsx` to include Toaster

**Acceptance Criteria:**
- [x] Toast system installed/created
- [x] Success and error variants
- [x] Theme-aware styling
- [x] Accessible (ARIA live regions)
- [x] No linting or type errors

---

### Task 1.9: Update CTA Buttons to Open Modal
**Description:** Update all "Let's Build Together" CTAs to trigger the contact form modal.

**Files to Update:**
- `src/components/Hero.tsx` (line 60-62)
- `src/components/ServicesSection.tsx`
- `src/components/TerminalPhilosophy.tsx`
- `src/components/experience/ExperienceHero.tsx`
- Any other locations with contact CTAs

**Implementation:**
- Create a `useContactModal` hook or context to manage modal state globally
- Update buttons to call `openContactModal()` onClick
- Ensure modal can be opened from any page

**Acceptance Criteria:**
- [x] All CTA buttons open the contact modal
- [x] Modal state managed cleanly (context or hook)
- [x] No duplicate modal instances
- [x] Proper focus management and keyboard navigation
- [x] No linting or type errors

---

## Phase 2: API Client & HMAC Signing

### Task 2.1: Create HMAC Utility
**Description:** Build client-side HMAC signature generation for request authentication.

**Files:**
- `src/lib/api/hmac.ts`

**Implementation:**
- Generate HMAC-SHA256 signature of request payload
- Use Web Crypto API (browser-native)
- Include timestamp to prevent replay attacks
- Secret will be a public "client secret" (different from server secret)

**Acceptance Criteria:**
- [ ] HMAC signature generation function
- [ ] Timestamp included in signature
- [ ] Properly typed
- [ ] No linting or type errors

---

### Task 2.2: Create API Client for Lead Submission
**Description:** Build the API client to submit leads to AWS Lambda via API Gateway.

**Files:**
- `src/lib/api/lead-client.ts`

**Implementation:**
- POST request to API Gateway endpoint
- Include HMAC signature in headers
- Include Idempotency-Key header (UUID)
- Include Turnstile token
- Proper error handling and type safety
- Retry logic for network errors (optional but good practice)

**Acceptance Criteria:**
- [ ] API client function created
- [ ] HMAC signature included in request
- [ ] Idempotency-Key generated and included
- [ ] Proper error handling
- [ ] TypeScript types for request/response
- [ ] No 'any' types
- [ ] No linting or type errors

---

### Task 2.3: Create Environment Variables Config
**Description:** Set up environment variables for API endpoint and secrets.

**Files:**
- `.env.local.example` (for documentation)
- Update `.gitignore` to ensure `.env.local` is ignored

**Environment Variables:**
- No secrets stored in code. All secrets should utilize AWS Secret Manager.
```bash
NEXT_PUBLIC_API_GATEWAY_URL=<will-be-set-after-terraform>
NEXT_PUBLIC_HMAC_CLIENT_SECRET=<generated-secret>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<cloudflare-turnstile-key>
```

**Acceptance Criteria:**
- [ ] `.env.local.example` created with all required vars
- [ ] `.gitignore` includes `.env.local`
- [ ] Documentation in example file
- [ ] No secrets committed to git

---

## Phase 3: AWS Infrastructure with Terraform

### Task 3.1: Set Up Terraform Project Structure
**Description:** Initialize Terraform project with proper structure and backend configuration.

**Files/Directories:**
```
terraform/
  ├── main.tf           # Main configuration
  ├── variables.tf      # Input variables
  ├── outputs.tf        # Output values (API Gateway URL, etc.)
  ├── providers.tf      # AWS provider config
  ├── dynamodb.tf       # DynamoDB table
  ├── lambda.tf         # Lambda function
  ├── api-gateway.tf    # API Gateway HTTP API
  ├── eventbridge.tf    # EventBridge bus
  ├── iam.tf            # IAM roles and policies
  ├── secrets.tf        # Secrets Manager
  ├── waf.tf            # WAF rules
  └── terraform.tfvars.example  # Example variables
```

**Acceptance Criteria:**
- [ ] Terraform directory structure created
- [ ] Provider configured for AWS
- [ ] Backend configured (S3 + DynamoDB for state lock - optional for now, can use local)
- [ ] Variables file with proper types
- [ ] Example tfvars file created
- [ ] .gitignore includes `*.tfvars` and `.terraform/`

---

### Task 3.2: Create DynamoDB Table with Terraform
**Description:** Provision DynamoDB table for lead storage.

**Table Schema:**
- **Table Name:** `portfolio-leads`
- **Partition Key:** `leadId` (String) - UUID
- **Sort Key:** None
- **GSI:** `createdAt-index` for querying leads by date
  - GSI Partition Key: `type` (String, always "LEAD")
  - GSI Sort Key: `createdAt` (Number, Unix timestamp)
- **Attributes:**
  - `leadId` (String)
  - `name` (String)
  - `email` (String)
  - `company` (String, optional)
  - `message` (String)
  - `createdAt` (Number)
  - `type` (String) - always "LEAD" for GSI
  - `ttl` (Number) - 18 months from creation for PII hygiene
- **Billing Mode:** PAY_PER_REQUEST (on-demand)
- **Point-in-time Recovery:** Enabled
- **TTL Enabled:** Yes, on `ttl` attribute

**Files:**
- `terraform/dynamodb.tf`

**Acceptance Criteria:**
- [ ] DynamoDB table defined in Terraform
- [ ] GSI configured for createdAt queries
- [ ] TTL enabled for automatic PII cleanup
- [ ] Point-in-time recovery enabled
- [ ] Proper tags for organization
- [ ] No hardcoded values (use variables)

---

### Task 3.3: Create Lambda Function Code
**Description:** Write the Lambda function code in Node 20 to handle lead submissions.

**Files/Directories:**
```
lambda/
  ├── src/
  │   ├── index.ts              # Main handler
  │   ├── validators.ts         # Zod schemas
  │   ├── dynamodb.ts           # DynamoDB operations
  │   ├── eventbridge.ts        # EventBridge client
  │   ├── hmac.ts               # HMAC verification
  │   ├── turnstile.ts          # Cloudflare Turnstile verification
  │   └── types.ts              # TypeScript types
  ├── package.json
  ├── tsconfig.json
  └── esbuild.config.js         # Build config
```

**Lambda Handler Logic:**
1. Parse incoming API Gateway event
2. Verify HMAC signature
3. Verify Cloudflare Turnstile token
4. Validate payload with Zod
5. Check idempotency key in DynamoDB (prevent duplicates)
6. Store lead in DynamoDB
7. Publish "LeadSubmitted" event to EventBridge
8. Return success response

**Acceptance Criteria:**
- [ ] Lambda handler function created
- [ ] HMAC verification implemented
- [ ] Turnstile verification implemented
- [ ] Zod validation for incoming payload
- [ ] Idempotency check with DynamoDB
- [ ] Lead stored in DynamoDB with TTL
- [ ] Event published to EventBridge
- [ ] Structured JSON logging (no PII in logs)
- [ ] Error handling with proper HTTP status codes
- [ ] TypeScript with no 'any' types
- [ ] Build script creates deployment package

---

### Task 3.4: Create Lambda Function with Terraform
**Description:** Define Lambda function resource in Terraform.

**Configuration:**
- **Runtime:** Node.js 20.x
- **Handler:** `index.handler`
- **Memory:** 256 MB (adjust after testing)
- **Timeout:** 10 seconds
- **Environment Variables:**
  - `DYNAMODB_TABLE_NAME`
  - `EVENTBRIDGE_BUS_NAME`
  - `HMAC_SERVER_SECRET` (from Secrets Manager)
  - `TURNSTILE_SECRET_KEY` (from Secrets Manager)
  - `RESEND_API_KEY` (from Secrets Manager)
- **IAM Role:** With least-privilege permissions
- **Layers:** None needed (keep deps small)

**Files:**
- `terraform/lambda.tf`

**Acceptance Criteria:**
- [ ] Lambda function resource defined
- [ ] Deployment package from build output
- [ ] Environment variables configured
- [ ] IAM role attached with proper permissions
- [ ] CloudWatch log group created
- [ ] No hardcoded secrets

---

### Task 3.5: Create IAM Roles and Policies
**Description:** Define least-privilege IAM roles for Lambda function.

**Lambda Execution Role Permissions:**
- CloudWatch Logs: `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`
- DynamoDB: `dynamodb:PutItem`, `dynamodb:GetItem`, `dynamodb:Query`
- EventBridge: `events:PutEvents`
- Secrets Manager: `secretsmanager:GetSecretValue` (specific secrets only)

**Files:**
- `terraform/iam.tf`

**Acceptance Criteria:**
- [ ] Lambda execution role created
- [ ] Policies attached with least-privilege access
- [ ] Resource-level permissions (not `*`)
- [ ] Proper trust relationships
- [ ] No overly broad permissions

---

### Task 3.6: Create API Gateway HTTP API
**Description:** Provision API Gateway HTTP API with CORS and throttling.

**Configuration:**
- **Type:** HTTP API (cheaper and simpler than REST API)
- **Endpoint:** POST `/leads`
- **Integration:** Lambda function
- **CORS:** Allow origin `https://daltonousley.com` (and localhost for dev)
- **Throttling:** 10 requests/second burst, 5 steady-state
- **Authorization:** None (handled by HMAC + Turnstile)

**Files:**
- `terraform/api-gateway.tf`

**Acceptance Criteria:**
- [ ] API Gateway HTTP API created
- [ ] POST route to Lambda integration
- [ ] CORS configured for portfolio domain
- [ ] Throttling limits configured
- [ ] API Gateway URL output for frontend

---

### Task 3.7: Create EventBridge Event Bus
**Description:** Provision EventBridge custom event bus for lead events.

**Configuration:**
- **Bus Name:** `portfolio-leads-bus`
- **Event Pattern:** `LeadSubmitted`
- **Initial Target:** Lambda function for Resend email notification

**Files:**
- `terraform/eventbridge.tf`

**Acceptance Criteria:**
- [ ] Custom event bus created
- [ ] Event rule for `LeadSubmitted` events
- [ ] Target configured (Lambda for email)
- [ ] Proper IAM permissions for EventBridge to invoke Lambda

---

### Task 3.8: Create Email Notification Lambda
**Description:** Create a separate Lambda function to send email notifications via Resend when leads are submitted.

**Files:**
```
lambda/email-notifier/
  ├── src/
  │   ├── index.ts              # Handler for EventBridge events
  │   ├── resend-client.ts      # Resend API client
  │   └── types.ts
  ├── package.json
  └── tsconfig.json
```

**Lambda Logic:**
1. Receive `LeadSubmitted` event from EventBridge
2. Extract lead details from event
3. Send email to your address via Resend
4. Email body: Include lead name, email, company, message
5. Log success/failure (no PII)

**Acceptance Criteria:**
- [ ] Email notifier Lambda created
- [ ] Resend API integration working
- [ ] Email template with lead details
- [ ] Error handling and logging
- [ ] TypeScript with no 'any' types
- [ ] Terraform resource for this Lambda

---

### Task 3.9: Create AWS Secrets Manager Resources
**Description:** Store sensitive credentials in Secrets Manager.

**Secrets:**
- `portfolio/hmac-server-secret` - For HMAC verification
- `portfolio/turnstile-secret` - Cloudflare Turnstile secret key
- `portfolio/resend-api-key` - Resend API key

**Files:**
- `terraform/secrets.tf`

**Note:** Secrets will need to be manually populated after `terraform apply` or use `terraform import` for existing secrets.

**Acceptance Criteria:**
- [ ] Secrets Manager resources defined
- [ ] Lambda has permission to read secrets
- [ ] Secret ARNs output for reference
- [ ] Documentation on how to populate secrets

---

### Task 3.10: Create AWS WAF Rules (Basic)
**Description:** Add basic AWS WAF rules for rate limiting and common attack protection.

**Rules:**
- Rate limiting: 100 requests per 5 minutes per IP
- AWS Managed Rules: Core Rule Set (CRS)
- Block common attacks (SQL injection, XSS)

**Files:**
- `terraform/waf.tf`

**Acceptance Criteria:**
- [ ] WAF Web ACL created
- [ ] Rate limiting rule configured
- [ ] Managed rule groups attached
- [ ] Web ACL associated with API Gateway
- [ ] CloudWatch metrics enabled

---

### Task 3.11: Create Terraform Outputs
**Description:** Define outputs for important resource values needed by the frontend.

**Outputs:**
- `api_gateway_url` - Full URL for API endpoint
- `dynamodb_table_name` - Table name for reference
- `eventbridge_bus_name` - Event bus name

**Files:**
- `terraform/outputs.tf`

**Acceptance Criteria:**
- [ ] All important values output
- [ ] Outputs documented with descriptions
- [ ] Sensitive values marked as sensitive

---

### Task 3.12: Deploy Infrastructure with Terraform
**Description:** Run Terraform to provision all AWS resources.

**Steps:**
1. `cd terraform`
2. `terraform init`
3. `terraform plan`
4. Review plan carefully
5. `terraform apply`
6. Copy API Gateway URL to `.env.local`

**Acceptance Criteria:**
- [ ] Terraform successfully applied
- [ ] All resources created in AWS
- [ ] No errors in Terraform output
- [ ] Outputs saved and documented
- [ ] API Gateway URL added to `.env.local`

---

## Phase 4: Integration & Testing

### Task 4.1: Integrate Cloudflare Turnstile
**Description:** Add Cloudflare Turnstile widget to contact form for bot protection.

**Files:**
- `src/components/ContactFormModal.tsx` (update)
- Add Turnstile script to `layout.tsx` or use npm package

**Implementation:**
- Use `@marsidev/react-turnstile` package (recommended)
- Add Turnstile widget to form
- Capture token on successful challenge
- Include token in form submission

**Acceptance Criteria:**
- [ ] Turnstile widget renders in form
- [ ] Token captured on challenge completion
- [ ] Token included in API request
- [ ] Form cannot submit without valid token
- [ ] No linting or type errors

---

### Task 4.2: End-to-End Testing - Local Development
**Description:** Test the complete flow locally before deploying.

**Test Scenarios:**
1. Open contact modal from CTA button
2. Fill out form with valid data
3. Submit form and verify loading state
4. Check success toast appears
5. Verify lead stored in DynamoDB (AWS Console)
6. Verify EventBridge event triggered
7. Verify email received via Resend
8. Test form validation (empty fields, invalid email)
9. Test duplicate submission (idempotency)
10. Test with bot protection (Turnstile)

**Acceptance Criteria:**
- [ ] All test scenarios pass
- [ ] No console errors
- [ ] Success/error feedback works
- [ ] Idempotency prevents duplicates
- [ ] Email notifications received
- [ ] Data correctly stored in DynamoDB

---

### Task 4.3: Create Admin View for Leads (Optional - Future)
**Description:** Build a simple admin page to view submitted leads.

**Note:** This is optional for the initial launch. Can be added later.

**Files:**
- `src/app/admin/leads/page.tsx`
- API route to fetch leads from DynamoDB (with authentication)

**Acceptance Criteria:**
- [ ] Protected admin route (password or auth)
- [ ] List view of all leads
- [ ] Sortable by date
- [ ] Proper pagination
- [ ] Theme-aware styling

---

## Phase 5: CI/CD with GitHub Actions

### Task 5.1: Create GitHub OIDC IAM Role
**Description:** Set up AWS IAM role for GitHub Actions to deploy via OIDC (no long-lived credentials).

**Files:**
- `terraform/github-actions-role.tf`

**IAM Role Configuration:**
- Trust relationship with GitHub OIDC provider
- Permissions to run Terraform (read/write for all resources)
- Condition: Only your GitHub repo

**Acceptance Criteria:**
- [ ] OIDC provider configured in AWS
- [ ] IAM role created with trust relationship
- [ ] Role ARN output for GitHub Actions
- [ ] Permissions scoped to necessary actions

---

### Task 5.2: Create GitHub Actions Workflow for Terraform
**Description:** Build CI/CD pipeline to deploy infrastructure changes automatically.

**Files:**
- `.github/workflows/terraform-deploy.yml`

**Workflow Steps:**
1. Checkout code
2. Configure AWS credentials via OIDC
3. Setup Terraform
4. Terraform init
5. Terraform plan (on PR)
6. Terraform apply (on merge to main)
7. Update Lambda function code if changed
8. Post plan output as PR comment

**Acceptance Criteria:**
- [ ] Workflow runs on PR and push to main
- [ ] OIDC authentication works
- [ ] Terraform plan on PR
- [ ] Terraform apply on merge
- [ ] Lambda code automatically deployed
- [ ] No hardcoded credentials

---

### Task 5.3: Create GitHub Actions Workflow for Frontend
**Description:** Ensure frontend builds and deploys correctly with new components (Cloudflare Pages should already have this set up).

**Note:** Cloudflare Pages likely auto-deploys on push. This task is just to verify.

**Verification:**
- [ ] Cloudflare Pages deploys on push to main
- [ ] Environment variables configured in Cloudflare
- [ ] Build succeeds with new components
- [ ] Contact form accessible on production

---

## Phase 6: Documentation & Polish

### Task 6.1: Update README
**Description:** Document the new lead capture system in the main README.

**Sections to Add:**
- Overview of lead capture system
- Architecture diagram (optional but nice)
- Environment variables needed
- How to deploy infrastructure
- How to test locally

**Files:**
- `README.md`

**Acceptance Criteria:**
- [ ] Clear documentation added
- [ ] Setup instructions included
- [ ] Architecture explained
- [ ] Screenshots/GIFs of form (optional)

---

### Task 6.2: Create Infrastructure Documentation
**Description:** Document the AWS infrastructure and how to manage it.

**Files:**
- `terraform/README.md`

**Sections:**
- Prerequisites (AWS CLI, Terraform)
- How to deploy infrastructure
- How to update Lambda functions
- How to view logs in CloudWatch
- How to query leads in DynamoDB
- Cost estimation (should be $0-5/month)

**Acceptance Criteria:**
- [ ] Comprehensive infrastructure docs
- [ ] Common operations documented
- [ ] Troubleshooting section
- [ ] Cost breakdown included

---

### Task 6.3: Create Runbook for Operations
**Description:** Document operational procedures and troubleshooting.

**Files:**
- `docs/lead-capture-runbook.md`

**Sections:**
- How to view CloudWatch logs
- How to manually test the API
- How to query DynamoDB for leads
- How to rotate secrets
- Common errors and solutions
- How to monitor costs

**Acceptance Criteria:**
- [ ] Runbook covers common scenarios
- [ ] Step-by-step instructions
- [ ] Screenshots where helpful
- [ ] Emergency procedures documented

---

### Task 6.4: Add Monitoring & Alerts (Optional - Future)
**Description:** Set up CloudWatch alarms for errors and high costs.

**Note:** This is optional for the initial launch but valuable for production.

**Alarms:**
- Lambda error rate > 5%
- API Gateway 5xx errors > 10/minute
- DynamoDB throttling events
- Estimated charges > $10/month

**Acceptance Criteria:**
- [ ] CloudWatch alarms created in Terraform
- [ ] SNS topic for notifications
- [ ] Email subscribed to SNS topic

---

### Task 6.5: Security Review Checklist
**Description:** Perform a security review of the entire system.

**Checklist:**
- [ ] No secrets in git history
- [ ] Environment variables properly secured
- [ ] HMAC verification working correctly
- [ ] Turnstile bot protection enabled
- [ ] WAF rules active and tested
- [ ] IAM roles follow least-privilege
- [ ] PII hygiene: TTL on DynamoDB items
- [ ] No PII in CloudWatch logs
- [ ] CORS properly configured
- [ ] Rate limiting tested
- [ ] Idempotency working
- [ ] Input validation on both client and server
- [ ] HTTPS only (no HTTP)

---

### Task 6.6: Performance Testing
**Description:** Test system performance and optimize if needed.

**Tests:**
- [ ] Form submission latency < 2 seconds
- [ ] Cold start Lambda < 1 second
- [ ] Warm Lambda < 200ms
- [ ] Email notification sent within 5 seconds
- [ ] API Gateway handles 10 req/sec burst

**Optimization Ideas:**
- Reduce Lambda package size
- Use Lambda provisioned concurrency (if needed)
- Optimize DynamoDB queries
- Enable API Gateway caching (if needed)

---

## Phase 7: Launch & Monitoring

### Task 7.1: Pre-Launch Checklist
**Description:** Final checks before going live.

**Checklist:**
- [ ] All environment variables configured in production
- [ ] Secrets populated in AWS Secrets Manager
- [ ] Resend API key verified and working
- [ ] Cloudflare Turnstile configured for production domain
- [ ] HMAC secrets generated and stored securely
- [ ] Terraform state backed up
- [ ] Frontend deployed to Cloudflare Pages
- [ ] Infrastructure deployed to AWS
- [ ] End-to-end test on production
- [ ] All CTAs link to contact modal
- [ ] Email notifications working
- [ ] WAF rules active

---

### Task 7.2: Soft Launch
**Description:** Deploy to production and test with limited traffic.

**Steps:**
1. Deploy frontend with contact form
2. Test form submission personally
3. Verify email received
4. Check DynamoDB for lead record
5. Review CloudWatch logs
6. Monitor for errors

**Acceptance Criteria:**
- [ ] Form accessible on production
- [ ] Submissions working end-to-end
- [ ] No errors in logs
- [ ] Performance acceptable

---

### Task 7.3: Post-Launch Retrospective
**Description:** Document learnings and areas for improvement.

**Questions:**
- What went well?
- What challenges did you face?
- What would you do differently?
- What should be improved next?

**Files:**
- `docs/lead-capture-retrospective.md`

**Acceptance Criteria:**
- [ ] Retrospective document created
- [ ] Learnings documented
- [ ] Future improvements listed

---

## Future Enhancements (Backlog)

These are not part of the current sprint but good ideas for later:

- [ ] Admin dashboard to view and manage leads
- [ ] Export leads to CSV
- [ ] Integration with CRM (if not using GoHighLevel in future)
- [ ] Email auto-responder to leads (thank you message)
- [ ] Lead scoring based on content
- [ ] A/B testing different form variations
- [ ] Analytics: conversion rate tracking
- [ ] Migrate static site from Cloudflare to AWS (S3 + CloudFront)
- [ ] Add CloudWatch dashboards
- [ ] Implement distributed tracing (X-Ray)
- [ ] Set up automated backups beyond point-in-time recovery
- [ ] Multi-region deployment for high availability

---

## Summary

**Total Tasks:** 50+ individual tasks across 7 phases
**Estimated Time:** 2-3 full days of focused work (for an experienced developer)
**Key Technologies:** Next.js, React, AWS (Lambda, DynamoDB, API Gateway, EventBridge, Secrets Manager, WAF), Terraform, Resend, Cloudflare Turnstile

**Success Criteria:**
- ✅ Professional contact form integrated into portfolio
- ✅ Serverless, event-driven architecture on AWS
- ✅ Secure with HMAC, Turnstile, and WAF
- ✅ Leads stored in DynamoDB with TTL for PII hygiene
- ✅ Email notifications via Resend
- ✅ Infrastructure as Code with Terraform
- ✅ CI/CD with GitHub Actions
- ✅ Production-ready with monitoring and documentation
- ✅ Demonstrates cloud engineering skills for recruiters

**Resume Bullet Points:**
1. "Designed and deployed an event-driven serverless intake on AWS (API Gateway → Lambda → EventBridge → DynamoDB) with WAF, Secrets Manager, and Terraform"
2. "Implemented idempotency, HMAC request signing, and bot protection (Turnstile + WAF); added structured logging"
3. "Built full-stack lead capture system with React Hook Form, Zod validation, and AWS serverless architecture; integrated with Resend for notifications"
4. "Established CI/CD pipeline using GitHub Actions with OIDC for secure, automated infrastructure deployments"

---

**Let's build something amazing! 🚀**

