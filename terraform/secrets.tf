/**
 * AWS Secrets Manager Configuration - SECURE VERSION
 * 
 * This configuration creates secret containers but does NOT manage secret values.
 * Secret values are populated externally via AWS CLI, Console, or a separate
 * secrets management process.
 * 
 * WHY: This prevents sensitive values from being stored in Terraform state.
 */

# ==============================================================================
# HMAC Server Secret
# ==============================================================================

resource "aws_secretsmanager_secret" "hmac_server" {
  name        = "portfolio/hmac-server-secret"
  description = "Server-side HMAC secret for request verification"

  recovery_window_in_days = 7

  tags = merge(
    local.common_tags,
    {
      Name = "HMAC Server Secret"
    }
  )
}

# NOTE: Secret value is NOT managed by Terraform
# Populate manually or via automated secret rotation:
#
# Method 1: AWS CLI
#   openssl rand -hex 32 | aws secretsmanager put-secret-value \
#     --secret-id portfolio/hmac-server-secret \
#     --secret-string file:///dev/stdin
#
# Method 2: Automated (see scripts/populate-secrets.sh)

# ==============================================================================
# Cloudflare Turnstile Secret
# ==============================================================================

resource "aws_secretsmanager_secret" "turnstile" {
  name        = "portfolio/turnstile-secret"
  description = "Cloudflare Turnstile secret key for bot protection"

  recovery_window_in_days = 7

  tags = merge(
    local.common_tags,
    {
      Name = "Turnstile Secret"
    }
  )
}

# ==============================================================================
# Resend API Key
# ==============================================================================

resource "aws_secretsmanager_secret" "resend" {
  name        = "portfolio/resend-api-key"
  description = "Resend API key for email notifications"

  recovery_window_in_days = 7

  tags = merge(
    local.common_tags,
    {
      Name = "Resend API Key"
    }
  )
}

# ==============================================================================
# Data Sources for Reading Existing Secrets
# ==============================================================================

# If you need to reference secret values in Terraform (e.g., for outputs),
# use data sources instead of managing the values directly:

# data "aws_secretsmanager_secret_version" "hmac_server" {
#   secret_id  = aws_secretsmanager_secret.hmac_server.id
#   depends_on = [aws_secretsmanager_secret.hmac_server]
# }

# Note: Even data sources will expose secrets in state, so avoid referencing
# secret values in Terraform unless absolutely necessary.

# ==============================================================================
# Secret Rotation Configuration (Optional - Recommended for Production)
# ==============================================================================

# Automatic secret rotation for enhanced security
resource "aws_secretsmanager_secret_rotation" "hmac_server" {
  count = var.enable_secret_rotation ? 1 : 0

  secret_id           = aws_secretsmanager_secret.hmac_server.id
  rotation_lambda_arn = var.secret_rotation_lambda_arn

  rotation_rules {
    automatically_after_days = 90
  }
}

# ==============================================================================
# Outputs
# ==============================================================================

# Only output ARNs and names, NEVER output secret values
output "secret_arns" {
  description = "ARNs of secrets (safe to expose)"
  value = {
    hmac_server    = aws_secretsmanager_secret.hmac_server.arn
    turnstile      = aws_secretsmanager_secret.turnstile.arn
    resend_api_key = aws_secretsmanager_secret.resend.arn
  }
}

# Instructions for populating secrets
output "secret_population_instructions" {
  value = <<-EOT
    
    ┌─────────────────────────────────────────────────────────────┐
    │  IMPORTANT: Populate Secrets Manually                       │
    └─────────────────────────────────────────────────────────────┘
    
    Terraform has created the secret containers but NOT the values.
    Use the provided script or manual commands below:
    
    🔧 Automated Method (Recommended):
       ./scripts/populate-secrets.sh
    
    📝 Manual Method:
    
    1. HMAC Server Secret (auto-generate):
       openssl rand -hex 32 | aws secretsmanager put-secret-value \
         --secret-id ${aws_secretsmanager_secret.hmac_server.id} \
         --secret-string file:///dev/stdin
    
    2. Turnstile Secret (from Cloudflare Dashboard):
       aws secretsmanager put-secret-value \
         --secret-id ${aws_secretsmanager_secret.turnstile.id} \
         --secret-string "YOUR_TURNSTILE_SECRET"
    
    3. Resend API Key (from Resend Dashboard):
       aws secretsmanager put-secret-value \
         --secret-id ${aws_secretsmanager_secret.resend.id} \
         --secret-string "YOUR_RESEND_API_KEY"
    
  EOT
}

