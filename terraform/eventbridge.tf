/**
 * EventBridge Configuration
 * 
 * Creates custom event bus and rules for lead events
 */

# Custom Event Bus
resource "aws_cloudwatch_event_bus" "leads" {
  name = "${local.name_prefix}-bus"

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name_prefix}-event-bus"
    }
  )
}

# Event Rule for LeadSubmitted events
resource "aws_cloudwatch_event_rule" "lead_submitted" {
  name           = "${local.name_prefix}-lead-submitted"
  description    = "Triggers when a new lead is submitted"
  event_bus_name = aws_cloudwatch_event_bus.leads.name

  event_pattern = jsonencode({
    source      = ["portfolio.leads"]
    detail-type = ["LeadSubmitted"]
  })

  tags = local.common_tags
}

# Target: Email Notifier Lambda
resource "aws_cloudwatch_event_target" "email_notifier" {
  rule           = aws_cloudwatch_event_rule.lead_submitted.name
  event_bus_name = aws_cloudwatch_event_bus.leads.name
  target_id      = "EmailNotifierLambda"
  arn            = aws_lambda_function.email_notifier.arn

  retry_policy {
    maximum_retry_attempts       = 2
    maximum_event_age_in_seconds = 3600 # 1 hour
  }

  dead_letter_config {
    arn = aws_sqs_queue.email_notifier_dlq.arn
  }
}

# Permission for EventBridge to invoke email notifier Lambda
resource "aws_lambda_permission" "eventbridge_email_notifier" {
  statement_id  = "AllowEventBridgeInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.email_notifier.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.lead_submitted.arn
}

# Dead Letter Queue for failed email notifications
resource "aws_sqs_queue" "email_notifier_dlq" {
  name                      = "${local.name_prefix}-email-notifier-dlq"
  message_retention_seconds = 1209600 # 14 days

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name_prefix}-email-notifier-dlq"
    }
  )
}

# CloudWatch alarm for DLQ messages
resource "aws_cloudwatch_metric_alarm" "dlq_messages" {
  alarm_name          = "${local.name_prefix}-dlq-messages"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = 300
  statistic           = "Average"
  threshold           = 0
  alarm_description   = "Alert when messages appear in DLQ"
  treat_missing_data  = "notBreaching"

  dimensions = {
    QueueName = aws_sqs_queue.email_notifier_dlq.name
  }

  tags = local.common_tags
}

