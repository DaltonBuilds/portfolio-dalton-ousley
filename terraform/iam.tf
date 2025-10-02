/**
 * IAM Roles and Policies
 * 
 * Defines least-privilege IAM roles for Lambda functions
 */

# ============================================================================
# Lead Processor Lambda Role
# ============================================================================

resource "aws_iam_role" "lead_processor" {
  name = "${local.name_prefix}-lead-processor-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name_prefix}-lead-processor-role"
    }
  )
}

# CloudWatch Logs policy for lead processor
resource "aws_iam_role_policy" "lead_processor_logs" {
  name = "cloudwatch-logs"
  role = aws_iam_role.lead_processor.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:${var.aws_region}:*:log-group:/aws/lambda/${local.name_prefix}-lead-processor:*"
      }
    ]
  })
}

# DynamoDB policy for lead processor
resource "aws_iam_role_policy" "lead_processor_dynamodb" {
  name = "dynamodb-access"
  role = aws_iam_role.lead_processor.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query"
        ]
        Resource = [
          aws_dynamodb_table.leads.arn,
          "${aws_dynamodb_table.leads.arn}/index/*"
        ]
      }
    ]
  })
}

# EventBridge policy for lead processor
resource "aws_iam_role_policy" "lead_processor_eventbridge" {
  name = "eventbridge-access"
  role = aws_iam_role.lead_processor.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "events:PutEvents"
        ]
        Resource = aws_cloudwatch_event_bus.leads.arn
      }
    ]
  })
}

# Secrets Manager policy for lead processor
resource "aws_iam_role_policy" "lead_processor_secrets" {
  name = "secrets-manager-access"
  role = aws_iam_role.lead_processor.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [
          aws_secretsmanager_secret.hmac_server.arn,
          aws_secretsmanager_secret.turnstile.arn
        ]
      }
    ]
  })
}

# ============================================================================
# Email Notifier Lambda Role
# ============================================================================

resource "aws_iam_role" "email_notifier" {
  name = "${local.name_prefix}-email-notifier-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name_prefix}-email-notifier-role"
    }
  )
}

# CloudWatch Logs policy for email notifier
resource "aws_iam_role_policy" "email_notifier_logs" {
  name = "cloudwatch-logs"
  role = aws_iam_role.email_notifier.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:${var.aws_region}:*:log-group:/aws/lambda/${local.name_prefix}-email-notifier:*"
      }
    ]
  })
}

# Secrets Manager policy for email notifier
resource "aws_iam_role_policy" "email_notifier_secrets" {
  name = "secrets-manager-access"
  role = aws_iam_role.email_notifier.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = aws_secretsmanager_secret.resend.arn
      }
    ]
  })
}

# ============================================================================
# EventBridge IAM Role for DLQ
# ============================================================================

resource "aws_iam_role" "eventbridge_dlq" {
  name = "${local.name_prefix}-eventbridge-dlq-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "events.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name_prefix}-eventbridge-dlq-role"
    }
  )
}

resource "aws_iam_role_policy" "eventbridge_dlq_sqs" {
  name = "sqs-access"
  role = aws_iam_role.eventbridge_dlq.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "sqs:SendMessage"
        ]
        Resource = aws_sqs_queue.email_notifier_dlq.arn
      }
    ]
  })
}

