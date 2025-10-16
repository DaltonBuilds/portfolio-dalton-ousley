/**
 * Lambda Functions Configuration
 * 
 * Defines Lambda functions for lead processing and email notifications
 */

# ============================================================================
# Lead Processor Lambda
# ============================================================================

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "lead_processor" {
  name              = "/aws/lambda/${local.name_prefix}-lead-processor"
  retention_in_days = var.lambda_log_retention_days

  tags = local.common_tags
}

# Lambda Function
resource "aws_lambda_function" "lead_processor" {
  filename      = "${path.module}/../lambda/lead-processor/dist/lambda.zip"
  function_name = "${local.name_prefix}-lead-processor"
  role          = aws_iam_role.lead_processor.arn
  handler       = "index.handler"
  runtime       = var.lambda_runtime
  timeout       = var.lambda_timeout
  memory_size   = var.lambda_memory_size
  architectures = ["arm64"]

  source_code_hash = filebase64sha256("${path.module}/../lambda/lead-processor/dist/lambda.zip")

  environment {
    variables = {
      DYNAMODB_TABLE_NAME     = aws_dynamodb_table.leads.name
      EVENTBRIDGE_BUS_NAME    = aws_cloudwatch_event_bus.leads.name
      HMAC_SERVER_SECRET_NAME = aws_secretsmanager_secret.hmac_server.name
      TURNSTILE_SECRET_NAME   = aws_secretsmanager_secret.turnstile.name
      TTL_DAYS                = tostring(var.dynamodb_ttl_days)
      NODE_OPTIONS            = "--enable-source-maps"
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.lead_processor,
    aws_iam_role_policy_attachment.lead_processor_logs_managed,
    aws_iam_role_policy.lead_processor_dynamodb,
    aws_iam_role_policy.lead_processor_eventbridge,
    aws_iam_role_policy.lead_processor_secrets,
  ]

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name_prefix}-lead-processor"
    }
  )
}

# CloudWatch Alarm for Lead Processor Errors
resource "aws_cloudwatch_metric_alarm" "lead_processor_errors" {
  alarm_name          = "${local.name_prefix}-lead-processor-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "Alert when lead processor has more than 5 errors in 5 minutes"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = aws_lambda_function.lead_processor.function_name
  }

  tags = local.common_tags
}

# CloudWatch Alarm for Lead Processor Duration
resource "aws_cloudwatch_metric_alarm" "lead_processor_duration" {
  alarm_name          = "${local.name_prefix}-lead-processor-duration"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "Duration"
  namespace           = "AWS/Lambda"
  period              = 300
  extended_statistic  = "p95"
  threshold           = 8000 # 8 seconds (80% of timeout)
  alarm_description   = "p95 duration > 80% of timeout"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = aws_lambda_function.lead_processor.function_name
  }

  tags = local.common_tags
}

# ============================================================================
# Email Notifier Lambda
# ============================================================================

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "email_notifier" {
  name              = "/aws/lambda/${local.name_prefix}-email-notifier"
  retention_in_days = var.lambda_log_retention_days

  tags = local.common_tags
}

# Lambda Function
resource "aws_lambda_function" "email_notifier" {
  filename      = "${path.module}/../lambda/email-notifier/dist/lambda.zip"
  function_name = "${local.name_prefix}-email-notifier"
  role          = aws_iam_role.email_notifier.arn
  handler       = "index.handler"
  runtime       = var.lambda_runtime
  timeout       = var.lambda_timeout
  memory_size   = var.lambda_memory_size
  architectures = ["arm64"]

  source_code_hash = filebase64sha256("${path.module}/../lambda/email-notifier/dist/lambda.zip")

  environment {
    variables = {
      RESEND_API_KEY_SECRET_NAME = aws_secretsmanager_secret.resend.name
      NOTIFICATION_EMAIL         = var.notification_email
      FROM_EMAIL                 = var.notification_from_email
      NODE_OPTIONS               = "--enable-source-maps"
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.email_notifier,
    aws_iam_role_policy_attachment.email_notifier_logs_managed,
    aws_iam_role_policy.email_notifier_secrets,
  ]

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name_prefix}-email-notifier"
    }
  )
}

# CloudWatch Alarm for Email Notifier Errors
resource "aws_cloudwatch_metric_alarm" "email_notifier_errors" {
  alarm_name          = "${local.name_prefix}-email-notifier-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 3
  alarm_description   = "Alert when email notifier has more than 3 errors in 5 minutes"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = aws_lambda_function.email_notifier.function_name
  }

  tags = local.common_tags
}

