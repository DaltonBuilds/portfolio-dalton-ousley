/**
 * DynamoDB Table Configuration
 * 
 * Creates the leads table with GSI for querying by date
 * and TTL for automatic PII cleanup
 */

resource "aws_dynamodb_table" "leads" {
  name             = "${local.name_prefix}-table"
  billing_mode     = var.dynamodb_billing_mode
  hash_key         = "leadId"
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  # Partition Key
  attribute {
    name = "leadId"
    type = "S" # String (UUID)
  }

  # GSI Attributes
  attribute {
    name = "type"
    type = "S" # String (always "LEAD")
  }

  attribute {
    name = "createdAt"
    type = "N" # Number (Unix timestamp)
  }

  # Global Secondary Index for querying leads by date
  global_secondary_index {
    name            = "createdAt-index"
    hash_key        = "type"
    range_key       = "createdAt"
    projection_type = "ALL"

    # For PAY_PER_REQUEST, read/write capacity is not specified
    # For PROVISIONED billing, uncomment these:
    # read_capacity  = 5
    # write_capacity = 5
  }

  # TTL configuration for automatic PII cleanup
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  # Point-in-time recovery for data protection
  point_in_time_recovery {
    enabled = var.enable_point_in_time_recovery
  }

  # Server-side encryption
  server_side_encryption {
    enabled = true
  }

  # Tags
  tags = merge(
    local.common_tags,
    {
      Name        = "${local.name_prefix}-table"
      Description = "Lead capture storage with TTL for PII hygiene"
    }
  )
}

# CloudWatch alarm for table throttling
resource "aws_cloudwatch_metric_alarm" "dynamodb_throttle" {
  alarm_name          = "${local.name_prefix}-dynamodb-throttle"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  threshold           = 0
  treat_missing_data  = "notBreaching"
  alarm_description   = "Alert when DynamoDB throttles reads/writes"
  metric_query {
    id          = "read"
    return_data = false
    metric {
      namespace   = "AWS/DynamoDB"
      metric_name = "ReadThrottleEvents"
      period      = 300
      stat        = "Sum"
      dimensions  = { TableName = aws_dynamodb_table.leads.name }
    }
  }
  metric_query {
    id          = "write"
    return_data = false
    metric {
      namespace   = "AWS/DynamoDB"
      metric_name = "WriteThrottleEvents"
      period      = 300
      stat        = "Sum"
      dimensions  = { TableName = aws_dynamodb_table.leads.name }
    }
  }
  metric_query {
    id          = "total"
    expression  = "read + write"
    label       = "TotalThrottleEvents"
    return_data = true
  }
  tags = local.common_tags
}


