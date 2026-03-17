resource "aws_secretsmanager_secret" "turnstile" {
  name        = "portfolio/turnstile-secret"
  description = "Cloudflare Turnstile secret key for bot protection"

  recovery_window_in_days = 7

  tags = merge(local.common_tags, { Name = "Turnstile Secret" })
}

resource "aws_secretsmanager_secret" "resend" {
  name        = "portfolio/resend-api-key"
  description = "Resend API key for email notifications"

  recovery_window_in_days = 7

  tags = merge(local.common_tags, { Name = "Resend API Key" })
}

# Secret values are NOT managed by Terraform to keep them out of state.
# Populate via: aws secretsmanager put-secret-value --secret-id <id> --secret-string <value>
# Or run: ./scripts/populate-secrets.sh
