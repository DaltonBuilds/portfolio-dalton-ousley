# Security Best Practices - Terraform & AWS

## 🔒 Overview

This document outlines the security improvements made to protect sensitive data in our Terraform infrastructure.

---

## 🚨 The Problem

### What Was Wrong?

**CRITICAL ISSUE:** Secrets were stored in plaintext in Terraform state files.

```json
// terraform.tfstate (BAD - OLD APPROACH)
{
  "secret_string": "$-e{K#te2fK0IX{Q-?tM[OhDyXew5=6Fsfc6VYdsVPL56g4&PivuW+kbZrC1]EfJ"
}
```

### Why This Was Dangerous

1. **State File Exposure** - Anyone with access to `terraform.tfstate` has your secrets
2. **Git Leaks** - Easy to accidentally commit state files
3. **Local Storage** - State stored on local disk without encryption
4. **No Audit Trail** - Can't track who accessed secrets
5. **Variable Leaks** - Secrets passed as variables can leak in logs, shell history, CI/CD

---

## ✅ The Solution

### 1. External Secret Management

**Never manage secret VALUES in Terraform, only create the containers.**

#### Before (Insecure):
```hcl
resource "random_password" "hmac_server_secret" {
  length  = 64
  special = true
}

resource "aws_secretsmanager_secret_version" "hmac_server" {
  secret_id     = aws_secretsmanager_secret.hmac_server.id
  secret_string = random_password.hmac_server_secret.result  # ❌ BAD
}
```

#### After (Secure):
```hcl
resource "aws_secretsmanager_secret" "hmac_server" {
  name        = "portfolio/hmac-server-secret"
  description = "Server-side HMAC secret for request verification"
}

# ✅ No secret_version resource - populate externally
```

### 2. Populate Secrets Externally

#### Automated (Recommended):
```bash
./scripts/populate-secrets.sh
```

#### Manual:
```bash
# Generate and store HMAC secret
openssl rand -hex 32 | aws secretsmanager put-secret-value \
  --secret-id portfolio/hmac-server-secret \
  --secret-string file:///dev/stdin

# Store Turnstile secret
aws secretsmanager put-secret-value \
  --secret-id portfolio/turnstile-secret \
  --secret-string "YOUR_TURNSTILE_SECRET"

# Store Resend API key
aws secretsmanager put-secret-value \
  --secret-id portfolio/resend-api-key \
  --secret-string "YOUR_RESEND_API_KEY"
```

### 3. Secure Backend Storage

#### Use S3 + DynamoDB Backend with Encryption

```hcl
terraform {
  backend "s3" {
    bucket         = "dalton-portfolio-terraform-state"
    key            = "portfolio-leads/terraform.tfstate"
    region         = "us-east-1"
    
    # Encryption at rest
    encrypt        = true
    kms_key_id     = "alias/terraform-state-key"
    
    # State locking
    dynamodb_table = "terraform-state-locks"
    
    # Access control
    acl            = "private"
  }
}
```

**Setup:**
```bash
./scripts/setup-backend-infrastructure.sh
```

### 4. Remove Secrets from Variables

#### Before (Insecure):
```hcl
variable "hmac_server_secret" {
  type      = string
  sensitive = true  # ❌ Not enough - still in state
}
```

#### After (Secure):
```hcl
# ✅ No secret variables at all
# Secrets are managed outside Terraform
```

---

## 🔄 Migration Guide

### Step 1: Backup Current State

```bash
cd terraform
cp terraform.tfstate terraform.tfstate.backup-$(date +%Y%m%d)
```

### Step 2: Set Up Secure Backend

```bash
./scripts/setup-backend-infrastructure.sh
```

This creates:
- S3 bucket with encryption and versioning
- DynamoDB table for state locking
- KMS key for encryption

### Step 3: Migrate State to S3

1. Edit `terraform/backend-config.tf`
2. Uncomment the backend block
3. Run migration:

```bash
cd terraform
terraform init -migrate-state
```

4. Confirm migration when prompted
5. Delete local state:

```bash
rm terraform.tfstate*
```

### Step 4: Replace Secret Management

1. Replace `secrets.tf` with `secrets-secure.tf`:

```bash
cd terraform
mv secrets.tf secrets.tf.old
mv secrets-secure.tf secrets.tf
```

2. Replace `main.tf` with `main-secure.tf`:

```bash
mv main.tf main.tf.old
mv main-secure.tf main.tf
```

3. Replace `variables.tf` with `variables-secure.tf`:

```bash
mv variables.tf variables.tf.old
mv variables-secure.tf variables.tf
```

### Step 5: Remove Secrets from State

```bash
# Remove the secret version resource from state
terraform state rm aws_secretsmanager_secret_version.hmac_server

# Remove the random password resource
terraform state rm random_password.hmac_server_secret
```

### Step 6: Populate Secrets Externally

```bash
./scripts/populate-secrets.sh
```

### Step 7: Plan and Apply

```bash
terraform plan
terraform apply
```

---

## 🛡️ Security Checklist

### ✅ Terraform State

- [ ] State stored in S3 with encryption
- [ ] KMS key rotation enabled
- [ ] S3 bucket versioning enabled
- [ ] Public access blocked on S3
- [ ] DynamoDB state locking configured
- [ ] No `.tfstate` files in Git repository

### ✅ Secret Management

- [ ] No secrets in Terraform variables
- [ ] No secrets in Terraform state
- [ ] Secrets populated via AWS CLI/scripts
- [ ] Secrets rotation process documented
- [ ] IAM policies restrict secret access
- [ ] CloudTrail logging enabled for Secrets Manager

### ✅ Access Control

- [ ] S3 bucket policy restricts access
- [ ] IAM roles follow least privilege
- [ ] MFA required for sensitive operations
- [ ] Audit logs enabled (CloudTrail)

### ✅ Code Security

- [ ] `.gitignore` includes `*.tfstate`
- [ ] `.gitignore` includes `*.tfvars`
- [ ] Pre-commit hooks scan for secrets
- [ ] No hardcoded credentials in code

---

## 🔑 Secret Rotation

### Automated Rotation (Production)

Enable automatic rotation in `terraform/secrets-secure.tf`:

```hcl
resource "aws_secretsmanager_secret_rotation" "hmac_server" {
  secret_id           = aws_secretsmanager_secret.hmac_server.id
  rotation_lambda_arn = aws_lambda_function.rotate_secret.arn

  rotation_rules {
    automatically_after_days = 90
  }
}
```

### Manual Rotation

```bash
./scripts/rotate-secrets.sh
```

---

## 📊 Comparison: Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| **State Storage** | Local disk | S3 with encryption |
| **State Encryption** | None | KMS encryption |
| **State Locking** | None | DynamoDB |
| **Secret Storage** | Terraform state | AWS Secrets Manager |
| **Secret Values** | In state file | External only |
| **Secret Rotation** | Manual | Automated option |
| **Audit Trail** | None | CloudTrail |
| **Access Control** | File permissions | IAM policies |
| **Compliance** | ❌ Non-compliant | ✅ Compliant |

---

## 🚀 Additional Recommendations

### 1. Use AWS SSO for Authentication

```bash
aws configure sso
aws sso login --profile dalton-portfolio
```

### 2. Enable CloudTrail Logging

Monitor all API calls to Secrets Manager:

```hcl
resource "aws_cloudtrail" "secrets_audit" {
  name           = "secrets-manager-audit"
  s3_bucket_name = aws_s3_bucket.cloudtrail.id
  
  event_selector {
    read_write_type           = "All"
    include_management_events = true
    
    data_resource {
      type   = "AWS::SecretsManager::Secret"
      values = ["arn:aws:secretsmanager:*:*:secret:portfolio/*"]
    }
  }
}
```

### 3. Implement Secret Scanning

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Scan for secrets before commit
gitleaks detect --verbose --no-git
```

### 4. Use Terraform Cloud (Optional)

Consider migrating to Terraform Cloud for:
- Remote state management
- Policy as Code (Sentinel)
- Team collaboration
- Audit logs

---

## 📚 References

- [AWS Secrets Manager Best Practices](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html)
- [Terraform Backend Configuration](https://developer.hashicorp.com/terraform/language/settings/backends/s3)
- [AWS Security Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## ❓ FAQ

### Q: Can I use data sources to read secrets in Terraform?

**A:** Avoid it. Even with `data` sources, secret values will end up in state. Only reference secrets in Lambda/application code at runtime.

### Q: What about `sensitive = true` on variables?

**A:** This only prevents printing to console. Secrets are still stored in plaintext in state files.

### Q: Should I use Terraform Vault provider?

**A:** For production, yes. HashiCorp Vault provides enterprise-grade secret management with dynamic secrets, leasing, and revocation.

### Q: How do I handle secrets in CI/CD?

**A:** Use your CI/CD provider's secret management (GitHub Secrets, GitLab CI/CD variables, AWS Systems Manager Parameter Store).

---

## 🆘 Support

If you encounter issues:

1. Check CloudTrail logs for API errors
2. Verify IAM permissions
3. Ensure KMS key grants are configured
4. Check S3 bucket policies

For questions, contact: example@gmail.com

