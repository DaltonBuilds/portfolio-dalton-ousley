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
    region         = var.aws_region
    dynamodb_table = aws_dynamodb_table.terraform_locks[0].name
    kms_key_alias  = aws_kms_alias.terraform_state[0].name
  } : null
}



