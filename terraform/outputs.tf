/**
 * Terraform Outputs
 * 
 * Export important values for frontend integration and documentation
 */

# ============================================================================
# API Gateway Outputs
# ============================================================================

output "api_gateway_url" {
  description = "API Gateway endpoint URL for lead submission"
  value       = aws_apigatewayv2_stage.prod.invoke_url
}

output "api_gateway_id" {
  description = "API Gateway ID"
  value       = aws_apigatewayv2_api.leads.id
}

# ============================================================================
# DynamoDB Outputs
# ============================================================================

output "dynamodb_table_name" {
  description = "DynamoDB table name for leads"
  value       = aws_dynamodb_table.leads.name
}

output "dynamodb_table_arn" {
  description = "DynamoDB table ARN"
  value       = aws_dynamodb_table.leads.arn
}

# ============================================================================
# EventBridge Outputs
# ============================================================================

output "eventbridge_bus_name" {
  description = "EventBridge custom event bus name"
  value       = aws_cloudwatch_event_bus.leads.name
}

output "eventbridge_bus_arn" {
  description = "EventBridge custom event bus ARN"
  value       = aws_cloudwatch_event_bus.leads.arn
}

# ============================================================================
# Lambda Outputs
# ============================================================================

output "lead_processor_function_name" {
  description = "Lead processor Lambda function name"
  value       = aws_lambda_function.lead_processor.function_name
}

output "email_notifier_function_name" {
  description = "Email notifier Lambda function name"
  value       = aws_lambda_function.email_notifier.function_name
}

# ============================================================================
# Secrets Manager Outputs
# ============================================================================

output "secrets_manager_arns" {
  description = "Map of Secrets Manager secret ARNs"
  value = {
    hmac_server_secret = aws_secretsmanager_secret.hmac_server.arn
    turnstile_secret   = aws_secretsmanager_secret.turnstile.arn
    resend_api_key     = aws_secretsmanager_secret.resend.arn
  }
}

# ============================================================================
# WAF Outputs
# ============================================================================

output "waf_web_acl_id" {
  description = "WAF Web ACL ID"
  value       = var.enable_waf ? aws_wafv2_web_acl.api[0].id : null
}

output "waf_web_acl_arn" {
  description = "WAF Web ACL ARN"
  value       = var.enable_waf ? aws_wafv2_web_acl.api[0].arn : null
}

# ============================================================================
# Configuration Summary
# ============================================================================

output "configuration_summary" {
  description = "Summary of deployed infrastructure"
  value = {
    environment        = var.environment
    region             = var.aws_region
    api_endpoint       = aws_apigatewayv2_stage.prod.invoke_url
    dynamodb_table     = aws_dynamodb_table.leads.name
    waf_created        = var.enable_waf
    waf_note           = "WAF created but not associated (HTTP API limitation). Use CloudFront for WAF protection."
    notification_email = var.notification_email
  }
}

# ============================================================================
# Backend Infrastructure Outputs (when bootstrapping)
# ============================================================================

output "backend_configuration" {
  description = "Backend infrastructure details (only when create_backend_infrastructure=true)"
  value = var.create_backend_infrastructure ? {
    bucket         = aws_s3_bucket.terraform_state[0].bucket
    region         = aws_s3_bucket.terraform_state[0].region
    dynamodb_table = aws_dynamodb_table.terraform_locks[0].name
    kms_key_alias  = aws_kms_alias.terraform_state[0].name
  } : null
}

# ============================================================================
# Next Steps Instructions
# ============================================================================

output "next_steps" {
  description = "Instructions for completing the setup"
  value       = <<-EOT
    
    ✅ Infrastructure deployed successfully!
    
    Next Steps:
    
    1. Populate Secrets in AWS Secrets Manager:
       - Turnstile Secret: aws secretsmanager put-secret-value --secret-id ${aws_secretsmanager_secret.turnstile.name} --secret-string "YOUR_TURNSTILE_SECRET"
       - Resend API Key: aws secretsmanager put-secret-value --secret-id ${aws_secretsmanager_secret.resend.name} --secret-string "YOUR_RESEND_API_KEY"
       - HMAC Server Secret: openssl rand -hex 32 | aws secretsmanager put-secret-value --secret-id ${aws_secretsmanager_secret.hmac_server.name} --secret-string file:///dev/stdin
    
    2. Update Frontend Environment Variables (.env.local):
       NEXT_PUBLIC_API_GATEWAY_URL=${aws_apigatewayv2_stage.prod.invoke_url}
       NEXT_PUBLIC_TURNSTILE_SITE_KEY=<from-cloudflare-dashboard>
    
    3. Update Cloudflare Pages Environment Variables (Production):
       - Same variables as step 2
    
    4. Test the integration:
       - Fill out contact form on your site
       - Check DynamoDB for lead record
       - Verify email notification received
    
    5. Monitor:
       - CloudWatch Logs: /aws/lambda/${aws_lambda_function.lead_processor.function_name}
       - WAF: Created but not associated (HTTP API limitation - use CloudFront for WAF)
       - API Gateway: Has rate limiting (10 req/sec burst, 5 steady-state)
       - Metrics: CloudWatch Console
    
  EOT
}

