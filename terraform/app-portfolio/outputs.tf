output "api_gateway_url" {
  description = "API Gateway endpoint URL for lead submission"
  value       = aws_apigatewayv2_stage.prod.invoke_url
}

output "api_gateway_id" {
  description = "API Gateway ID"
  value       = aws_apigatewayv2_api.leads.id
}

output "dynamodb_table_name" {
  description = "DynamoDB table name for leads"
  value       = aws_dynamodb_table.leads.name
}

output "dynamodb_table_arn" {
  description = "DynamoDB table ARN"
  value       = aws_dynamodb_table.leads.arn
}

output "eventbridge_bus_name" {
  description = "EventBridge custom event bus name"
  value       = aws_cloudwatch_event_bus.leads.name
}

output "eventbridge_bus_arn" {
  description = "EventBridge custom event bus ARN"
  value       = aws_cloudwatch_event_bus.leads.arn
}

output "lead_processor_function_name" {
  description = "Lead processor Lambda function name"
  value       = aws_lambda_function.lead_processor.function_name
}

output "email_notifier_function_name" {
  description = "Email notifier Lambda function name"
  value       = aws_lambda_function.email_notifier.function_name
}

output "secrets_manager_arns" {
  description = "Secrets Manager secret ARNs"
  value = {
    hmac_server_secret = aws_secretsmanager_secret.hmac_server.arn
    turnstile_secret   = aws_secretsmanager_secret.turnstile.arn
    resend_api_key     = aws_secretsmanager_secret.resend.arn
  }
}

output "configuration_summary" {
  description = "Summary of deployed infrastructure"
  value = {
    environment        = var.environment
    region             = var.aws_region
    api_endpoint       = aws_apigatewayv2_stage.prod.invoke_url
    dynamodb_table     = aws_dynamodb_table.leads.name
    notification_email = var.notification_email
  }
}
