# Security Migration Checklist

## ⚠️ IMPORTANT: Complete Migration to Secure Secret Management

This checklist guides you through migrating from insecure to secure Terraform secret management.

---

## Pre-Migration

### ✅ Backup Everything

- [ ] Backup current Terraform state:
  ```bash
  cd terraform
  cp terraform.tfstate terraform.tfstate.backup-$(date +%Y%m%d)
  cp terraform.tfstate.backup terraform.tfstate.backup.backup-$(date +%Y%m%d)
  ```

- [ ] Backup current configuration:
  ```bash
  cp secrets.tf secrets.tf.backup
  cp main.tf main.tf.backup
  cp variables.tf variables.tf.backup
  ```

- [ ] Export current secret values (you'll need these):
  ```bash
  # Save current HMAC secret
  terraform output -raw secrets_manager_arns
  aws secretsmanager get-secret-value \
    --secret-id portfolio/hmac-server-secret \
    --query SecretString --output text > /tmp/hmac-backup.txt
  
  # Secure this file
  chmod 600 /tmp/hmac-backup.txt
  ```

### ✅ Verify AWS Access

- [ ] Confirm AWS CLI is configured:
  ```bash
  aws sts get-caller-identity --profile dalton-portfolio
  ```

- [ ] Verify required permissions:
  - S3 bucket creation
  - DynamoDB table creation
  - KMS key creation
  - Secrets Manager access

---

## Phase 1: Set Up Secure Backend (30 minutes)

### Step 1: Create Backend Infrastructure

- [ ] Run the backend setup script:
  ```bash
  ./scripts/setup-backend-infrastructure.sh
  ```

- [ ] Verify creation:
  ```bash
  aws s3 ls | grep terraform-state
  aws dynamodb list-tables | grep terraform-state-locks
  ```

### Step 2: Enable Backend Configuration

- [ ] Edit `terraform/backend-config.tf`
- [ ] Uncomment the backend block (lines ~25-40)
- [ ] Save the file

### Step 3: Migrate State to S3

- [ ] Initialize with new backend:
  ```bash
  cd terraform
  terraform init -migrate-state
  ```

- [ ] Confirm migration when prompted (type "yes")

- [ ] Verify migration:
  ```bash
  aws s3 ls s3://dalton-portfolio-terraform-state/portfolio-leads/
  ```

- [ ] Delete local state files:
  ```bash
  rm terraform.tfstate terraform.tfstate.backup
  ```

- [ ] Verify Terraform still works:
  ```bash
  terraform plan
  ```

**✅ Checkpoint:** State is now in S3 with encryption

---

## Phase 2: Secure Secret Management (20 minutes)

### Step 4: Replace Secret Configuration

- [ ] Replace secrets.tf:
  ```bash
  cd terraform
  mv secrets.tf secrets.tf.old
  mv secrets-secure.tf secrets.tf
  ```

- [ ] Replace main.tf:
  ```bash
  mv main.tf main.tf.old
  mv main-secure.tf main.tf
  ```

- [ ] Replace variables.tf:
  ```bash
  mv variables.tf variables.tf.old
  mv variables-secure.tf variables.tf
  ```

### Step 5: Remove Secrets from State

- [ ] Remove secret version from state:
  ```bash
  terraform state rm aws_secretsmanager_secret_version.hmac_server
  ```

- [ ] Remove random password from state:
  ```bash
  terraform state rm random_password.hmac_server_secret
  ```

- [ ] Verify removal:
  ```bash
  terraform state list | grep -i secret
  # Should only show aws_secretsmanager_secret resources, not secret_version
  ```

### Step 6: Plan Changes

- [ ] Review the plan:
  ```bash
  terraform plan
  ```

- [ ] Expected changes:
  - No changes to secrets (only metadata/tags)
  - Removal of random_password resource
  - Removal of secret_version resources

- [ ] Apply if plan looks good:
  ```bash
  terraform apply
  ```

**✅ Checkpoint:** Secrets are no longer in Terraform state

---

## Phase 3: Populate Secrets Externally (10 minutes)

### Step 7: Verify Existing Secrets

- [ ] Check current secret values:
  ```bash
  aws secretsmanager list-secrets --filters Key=name,Values=portfolio/
  ```

- [ ] The secrets should already exist (created by old Terraform)
- [ ] Values should still be present from before migration

### Step 8: (Optional) Rotate Secrets

Since you're migrating, this is a good time to rotate:

- [ ] Rotate HMAC server secret:
  ```bash
  ./scripts/rotate-secrets.sh hmac-server
  ```

- [ ] Update Turnstile secret (if needed):
  ```bash
  aws secretsmanager put-secret-value \
    --secret-id portfolio/turnstile-secret \
    --secret-string "YOUR_NEW_TURNSTILE_SECRET"
  ```

- [ ] Update Resend API key (if needed):
  ```bash
  aws secretsmanager put-secret-value \
    --secret-id portfolio/resend-api-key \
    --secret-string "YOUR_NEW_RESEND_API_KEY"
  ```

**✅ Checkpoint:** Secrets are managed externally

---

## Phase 4: Update Configuration Files (10 minutes)

### Step 9: Update terraform.tfvars

- [ ] Edit `terraform/terraform.tfvars`
- [ ] Remove these lines:
  ```hcl
  hmac_server_secret = ""
  hmac_client_secret = "..."
  ```

- [ ] Ensure you have HMAC client secret saved elsewhere (you'll need it for frontend)

### Step 10: Clean Up Old Files

- [ ] Remove old backups (after verifying everything works):
  ```bash
  cd terraform
  rm -f secrets.tf.old main.tf.old variables.tf.old
  rm -f terraform.tfstate.backup-*  # After 30 days
  ```

- [ ] Remove temporary secret backups:
  ```bash
  shred -u /tmp/hmac-backup.txt  # Secure delete
  ```

**✅ Checkpoint:** Configuration cleaned up

---

## Phase 5: Verification (10 minutes)

### Step 11: Test Infrastructure

- [ ] Plan should show no changes:
  ```bash
  terraform plan
  # Should output: "No changes. Your infrastructure matches the configuration."
  ```

- [ ] Verify secrets are accessible:
  ```bash
  aws secretsmanager get-secret-value \
    --secret-id portfolio/hmac-server-secret \
    --query SecretString --output text
  ```

- [ ] Test Lambda can access secrets:
  ```bash
  aws lambda invoke \
    --function-name portfolio-leads-prod-lead-processor \
    --payload '{"test": true}' \
    /tmp/test-response.json
  
  # Check CloudWatch logs for secret access
  ```

### Step 12: Verify State Security

- [ ] Check S3 state encryption:
  ```bash
  aws s3api get-object \
    --bucket dalton-portfolio-terraform-state \
    --key portfolio-leads/terraform.tfstate \
    /tmp/state-test.json
  
  # Verify it's encrypted
  cat /tmp/state-test.json | jq . | grep -i secret
  # Should NOT show secret values
  ```

- [ ] Verify state locking:
  ```bash
  # In terminal 1:
  cd terraform && terraform plan
  
  # In terminal 2 (should fail):
  cd terraform && terraform plan
  # Should error: "Error acquiring the state lock"
  ```

### Step 13: Test End-to-End

- [ ] Submit a test form on your website
- [ ] Verify lead captured in DynamoDB
- [ ] Verify email notification received
- [ ] Check CloudWatch logs for errors

**✅ Checkpoint:** Everything works with secure setup

---

## Phase 6: Documentation & Monitoring (5 minutes)

### Step 14: Update Documentation

- [ ] Review `docs/SECURITY-BEST-PRACTICES.md`
- [ ] Update team documentation with new process
- [ ] Document secret rotation schedule

### Step 15: Set Up Monitoring

- [ ] Enable CloudTrail logging for Secrets Manager:
  ```bash
  aws cloudtrail lookup-events \
    --lookup-attributes AttributeKey=ResourceType,AttributeValue=AWS::SecretsManager::Secret \
    --max-results 10
  ```

- [ ] Set up CloudWatch alarms for:
  - Unauthorized secret access attempts
  - Secret rotation failures
  - State lock timeouts

**✅ Checkpoint:** Monitoring and docs updated

---

## Post-Migration

### ✅ Security Validation

- [ ] Run security scan:
  ```bash
  # Check for secrets in Git history
  git log --all --source --full-history -- terraform.tfstate
  # Should be minimal/none
  
  # Scan for leaked secrets
  gitleaks detect --verbose
  ```

- [ ] Review IAM policies:
  ```bash
  aws iam get-role-policy \
    --role-name portfolio-leads-prod-lead-processor-role \
    --policy-name SecretsAccess
  ```

- [ ] Verify no secrets in state:
  ```bash
  aws s3 cp s3://dalton-portfolio-terraform-state/portfolio-leads/terraform.tfstate - | \
    jq '.resources[] | select(.type == "aws_secretsmanager_secret_version")'
  # Should return empty
  ```

### ✅ Final Checklist

- [ ] Secrets not in Terraform state ✓
- [ ] State stored in encrypted S3 ✓
- [ ] State locking enabled ✓
- [ ] No secret variables in terraform.tfvars ✓
- [ ] Secrets populated externally ✓
- [ ] Infrastructure still functional ✓
- [ ] Documentation updated ✓
- [ ] Team trained on new process ✓

---

## Rollback Plan (If Needed)

If something goes wrong during migration:

```bash
# Restore from backup
cd terraform
cp terraform.tfstate.backup-YYYYMMDD terraform.tfstate

# Restore old configuration
cp secrets.tf.old secrets.tf
cp main.tf.old main.tf
cp variables.tf.old variables.tf

# Re-initialize
terraform init

# Verify
terraform plan
```

---

## Timeline

| Phase | Duration | Can Do During |
|-------|----------|---------------|
| Pre-Migration | 15 min | Business hours |
| Phase 1: Backend | 30 min | Business hours |
| Phase 2: Secrets | 20 min | Business hours |
| Phase 3: Population | 10 min | Business hours |
| Phase 4: Cleanup | 10 min | Business hours |
| Phase 5: Verification | 10 min | Business hours |
| Phase 6: Docs | 5 min | Anytime |
| **Total** | **~90 minutes** | |

---

## Success Criteria

✅ Migration is successful when:

1. `terraform plan` shows no changes
2. No secrets appear in `terraform.tfstate` (in S3)
3. Secrets are accessible via AWS Secrets Manager
4. Application continues to function normally
5. State locking prevents concurrent modifications
6. All tests pass

---

## Support

If you encounter issues:

1. Check the rollback plan above
2. Review CloudWatch logs: `/aws/lambda/portfolio-leads-prod-*`
3. Check CloudTrail for API errors
4. Verify IAM permissions
5. Review `docs/SECURITY-BEST-PRACTICES.md`

Contact: example@gmail.com

---

## Next Steps After Migration

1. **Set up automated secret rotation** (90 days)
2. **Enable GuardDuty** for threat detection
3. **Implement secret scanning** in CI/CD pipeline
4. **Schedule quarterly security audits**
5. **Document incident response procedures**

---

**Remember:** The goal is to have ZERO secrets in Terraform state while maintaining full functionality. Take your time and verify each step.

