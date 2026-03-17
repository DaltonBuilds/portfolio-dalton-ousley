# Portfolio: Dalton Ousley

My personal portfolio site built with Next.js and backed by a serverless AWS infrastructure managed entirely with Terraform. The frontend is a Next.js 16 application — the real focus of this repo is the backend: a production-grade, event-driven lead capture system deployed via containerized Lambdas and GitHub Actions with OIDC federation.

## Architecture

A contact form submission flows through the following path:

1. **API Gateway** (HTTP API) receives the POST request
2. **Lead Processor Lambda** validates the payload (Zod), verifies the Cloudflare Turnstile token, deduplicates via idempotency keys, and stores the lead in DynamoDB
3. **EventBridge** routes a `LeadSubmitted` event to the next stage, with a dead-letter queue for failed deliveries
4. **Email Notifier Lambda** picks up the event and sends a notification via Resend
5. **DynamoDB** stores leads with a TTL for automatic PII cleanup after 18 months

Both Lambda functions are packaged as container images, pushed to ECR, and deployed via GitHub Actions.

## Infrastructure Highlights

- **GitHub OIDC federation** — no long-lived AWS credentials; GitHub Actions assumes an IAM role scoped to `refs/heads/main`
- **Container-based Lambdas** — Docker images built, scanned with Trivy, and pushed to ECR on every deploy
- **Modular Terraform** — split into `bootstrap` (state backend), `identity` (OIDC/IAM), and `app-portfolio` (application stack)
- **Security scanning** — Trivy runs against every container image in CI
- **Observability** — OpenTelemetry CI/CD timing data exported to Honeycomb; CloudWatch alarms on Lambda errors, API Gateway 4xx/5xx rates, DynamoDB throttles, and DLQ depth
- **Secrets management** — all secrets in AWS Secrets Manager, populated out-of-band, never in Terraform state
- **Action pinning** — all GitHub Actions referenced by full commit SHA
- **Least-privilege IAM** — each Lambda gets its own role with narrowly scoped permissions for required resources

## Project Structure

```
terraform/
  bootstrap/       # S3 state backend
  identity/        # GitHub OIDC provider and deploy role
  app-portfolio/   # API Gateway, Lambda, DynamoDB, EventBridge, IAM, secrets, monitoring
lambda/
  lead-processor/  # Form validation, Turnstile verification, DynamoDB storage, event publishing
  email-notifier/  # EventBridge consumer, email dispatch via Resend
.github/workflows/
  lambda-deploy.yaml        # Build, scan, push, and deploy on merge to main
  export-timing-data.yaml   # CI/CD observability export to Honeycomb
src/                        # Next.js 16 frontend (React 19, TypeScript, Tailwind CSS)
```

## Tech Stack

**Infrastructure:** Terraform, AWS (Lambda, API Gateway, DynamoDB, EventBridge, ECR, Secrets Manager, IAM, CloudWatch), GitHub Actions, Docker

**Backend:** TypeScript, Node.js 24, Zod, AWS SDK v3, Resend, Cloudflare Turnstile

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, Velite CMS
