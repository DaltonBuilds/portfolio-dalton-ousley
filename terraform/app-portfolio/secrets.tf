resource "aws_secretsmanager_secret" "hmac_server" {
  name        = "portfolio/hmac-server-secret"
  description = "Server-side HMAC secret for request verification"

  recovery_window_in_days = 7

  tags = merge(local.common_tags, { Name = "HMAC Server Secret" })
}

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

resource "aws_secretsmanager_secret_rotation" "hmac_server" {
  count = var.enable_secret_rotation ? 1 : 0

  secret_id           = aws_secretsmanager_secret.hmac_server.id
  rotation_lambda_arn = var.secret_rotation_lambda_arn

  rotation_rules {
    automatically_after_days = 90
  }
}
