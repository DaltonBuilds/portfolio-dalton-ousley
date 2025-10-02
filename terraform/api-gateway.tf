/**
 * API Gateway HTTP API Configuration
 * 
 * Creates API Gateway with Lambda integration and CORS
 */

# API Gateway HTTP API
resource "aws_apigatewayv2_api" "leads" {
  name          = "${local.name_prefix}-api"
  protocol_type = "HTTP"
  description   = "Lead capture API for portfolio"

  cors_configuration {
    allow_origins = var.allowed_origins
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = [
      "Content-Type",
      "X-HMAC-Signature",
      "X-HMAC-Timestamp",
      "X-Idempotency-Key",
      "X-Turnstile-Token"
    ]
    max_age = 300
  }

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name_prefix}-api"
    }
  )
}

# API Gateway Integration with Lambda
resource "aws_apigatewayv2_integration" "lead_processor" {
  api_id           = aws_apigatewayv2_api.leads.id
  integration_type = "AWS_PROXY"

  integration_method     = "POST"
  integration_uri        = aws_lambda_function.lead_processor.invoke_arn
  payload_format_version = "2.0"

  timeout_milliseconds = var.lambda_timeout * 1000 + 1000 # Lambda timeout + 1 second buffer
}

# API Gateway Route
resource "aws_apigatewayv2_route" "post_leads" {
  api_id    = aws_apigatewayv2_api.leads.id
  route_key = "POST /leads"

  target = "integrations/${aws_apigatewayv2_integration.lead_processor.id}"
}

# API Gateway Stage
resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.leads.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = var.api_throttle_burst_limit
    throttling_rate_limit  = var.api_throttle_rate_limit
  }

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
      errorMessage   = "$context.error.message"
    })
  }

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name_prefix}-api-stage"
    }
  )
}

# CloudWatch Log Group for API Gateway
resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/${local.name_prefix}"
  retention_in_days = var.lambda_log_retention_days

  tags = local.common_tags
}

# Lambda Permission for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lead_processor.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.leads.execution_arn}/*/*"
}

# CloudWatch Alarm for API Gateway 4XX Errors
resource "aws_cloudwatch_metric_alarm" "api_4xx" {
  alarm_name          = "${local.name_prefix}-api-4xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "4XXError"
  namespace           = "AWS/ApiGateway"
  period              = 300
  statistic           = "Sum"
  threshold           = 20
  alarm_description   = "Alert when API has more than 20 4xx errors in 5 minutes"
  treat_missing_data  = "notBreaching"

  dimensions = {
    ApiId = aws_apigatewayv2_api.leads.id
  }

  tags = local.common_tags
}

# CloudWatch Alarm for API Gateway 5XX Errors
resource "aws_cloudwatch_metric_alarm" "api_5xx" {
  alarm_name          = "${local.name_prefix}-api-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "5XXError"
  namespace           = "AWS/ApiGateway"
  period              = 300
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "Alert when API has more than 5 5xx errors in 5 minutes"
  treat_missing_data  = "notBreaching"

  dimensions = {
    ApiId = aws_apigatewayv2_api.leads.id
  }

  tags = local.common_tags
}

