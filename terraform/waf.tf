/**
 * AWS WAF Configuration
 * 
 * Provides rate limiting and common attack protection
 */

# WAF Web ACL
resource "aws_wafv2_web_acl" "api" {
  count = var.enable_waf ? 1 : 0

  name  = "${local.name_prefix}-waf"
  scope = "REGIONAL"

  default_action {
    allow {}
  }

  # Rate Limiting Rule
  rule {
    name     = "RateLimitRule"
    priority = 1

    action {
      block {
        custom_response {
          response_code = 429
        }
      }
    }

    statement {
      rate_based_statement {
        limit              = var.waf_rate_limit
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name_prefix}-rate-limit"
      sampled_requests_enabled   = true
    }
  }

  # AWS Managed Rules - Core Rule Set (CRS)
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        vendor_name = "AWS"
        name        = "AWSManagedRulesCommonRuleSet"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name_prefix}-common-rules"
      sampled_requests_enabled   = true
    }
  }

  # AWS Managed Rules - Known Bad Inputs
  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 3

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        vendor_name = "AWS"
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name_prefix}-bad-inputs"
      sampled_requests_enabled   = true
    }
  }

  # AWS Managed Rules - Anonymous IP List
  rule {
    name     = "AWSManagedRulesAnonymousIpList"
    priority = 4

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        vendor_name = "AWS"
        name        = "AWSManagedRulesAnonymousIpList"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name_prefix}-anonymous-ip"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${local.name_prefix}-waf"
    sampled_requests_enabled   = true
  }

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name_prefix}-waf"
    }
  )
}

# Note: API Gateway HTTP API (v2) does not support direct WAF association
# Only REST APIs (v1) support WAF. For HTTP APIs, you need CloudFront in front.
# We're keeping the WAF rules created for future CloudFront integration if needed.
# The API Gateway still has rate limiting (10 req/sec burst, 5 steady-state).
#
# To enable WAF protection later:
# 1. Add CloudFront distribution in front of API Gateway
# 2. Associate WAF with CloudFront instead
#
# resource "aws_wafv2_web_acl_association" "api" {
#   count = var.enable_waf ? 1 : 0
#
#   resource_arn = aws_apigatewayv2_stage.prod.arn
#   web_acl_arn  = aws_wafv2_web_acl.api[0].arn
#
#   depends_on = [
#     aws_apigatewayv2_stage.prod,
#     aws_wafv2_web_acl.api
#   ]
# }

# CloudWatch Alarm for WAF Block Rate
resource "aws_cloudwatch_metric_alarm" "waf_blocked_requests" {
  count = var.enable_waf ? 1 : 0

  alarm_name          = "${local.name_prefix}-waf-blocked-requests"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "BlockedRequests"
  namespace           = "AWS/WAFV2"
  period              = 300
  statistic           = "Sum"
  threshold           = 100
  alarm_description   = "Alert when WAF blocks more than 100 requests in 5 minutes"
  treat_missing_data  = "notBreaching"

  dimensions = {
    Rule   = "ALL"
    WebACL = aws_wafv2_web_acl.api[0].name
    Region = var.aws_region
  }

  tags = local.common_tags
}

