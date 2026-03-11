resource "aws_dynamodb_table" "leads" {
  name         = "${local.name_prefix}-table"
  billing_mode = var.dynamodb_billing_mode
  hash_key     = "leadId"

  attribute {
    name = "leadId"
    type = "S"
  }

  attribute {
    name = "type"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "N"
  }

  attribute {
    name = "email"
    type = "S"
  }

  # Query all leads sorted by submission time
  global_secondary_index {
    name            = "createdAt-index"
    hash_key        = "type"
    range_key       = "createdAt"
    projection_type = "ALL"
  }

  # Lookup by email for privacy/deletion requests
  global_secondary_index {
    name            = "email-index"
    hash_key        = "email"
    projection_type = "ALL"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  point_in_time_recovery {
    enabled = var.enable_point_in_time_recovery
  }

  server_side_encryption {
    enabled = true
  }

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name_prefix}-table"
    }
  )
}

resource "aws_cloudwatch_metric_alarm" "dynamodb_throttle" {
  alarm_name          = "${local.name_prefix}-dynamodb-throttle"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  threshold           = 0
  treat_missing_data  = "notBreaching"
  alarm_description   = "Alert when DynamoDB throttles reads or writes"

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

resource "aws_dynamodb_table" "privacy_requests" {
  name         = "${local.name_prefix}-privacy-requests"
  billing_mode = var.dynamodb_billing_mode
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "requesterEmail"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  # Query by email + status for request lookups
  global_secondary_index {
    name            = "email-status-index"
    hash_key        = "requesterEmail"
    range_key       = "status"
    projection_type = "ALL"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  point_in_time_recovery {
    enabled = var.enable_point_in_time_recovery
  }

  server_side_encryption {
    enabled = true
  }

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name_prefix}-privacy-requests"
    }
  )
}
