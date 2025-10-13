/**
 * AWS Secrets Manager Configuration
 * 
 * Stores sensitive credentials securely
 */

# HMAC Server Secret
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

resource "aws_secretsmanager_secret_version" "hmac_server" {
  secret_id     = aws_secretsmanager_secret.hmac_server.id
  secret_string = local.hmac_server_secret
}

# Cloudflare Turnstile Secret
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

# Resend API Key
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

# Note: Secret values for Turnstile and Resend must be populated manually
# after terraform apply using AWS CLI or Console:
#
# aws secretsmanager put-secret-value \
#   --secret-id portfolio/turnstile-secret \
#   --secret-string "YOUR_TURNSTILE_SECRET"
#
# aws secretsmanager put-secret-value \
#   --secret-id portfolio/resend-api-key \
#   --secret-string "YOUR_RESEND_API_KEY"

