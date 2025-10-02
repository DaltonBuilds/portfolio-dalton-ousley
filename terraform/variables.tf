/**
 * Terraform Input Variables
 * 
 * Define all configurable parameters for the infrastructure
 */

# ============================================================================
# General Configuration
# ============================================================================

variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "portfolio-leads"
}

variable "owner_email" {
  description = "Email address of the infrastructure owner"
  type        = string
}

# ============================================================================
# Domain Configuration
# ============================================================================

variable "allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default = [
    "https://daltonousley.com",
    "https://www.daltonousley.com",
    "http://localhost:3000"
  ]
}

# ============================================================================
# DynamoDB Configuration
# ============================================================================

variable "dynamodb_billing_mode" {
  description = "DynamoDB billing mode (PROVISIONED or PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"

  validation {
    condition     = contains(["PROVISIONED", "PAY_PER_REQUEST"], var.dynamodb_billing_mode)
    error_message = "Billing mode must be PROVISIONED or PAY_PER_REQUEST."
  }
}

variable "dynamodb_ttl_days" {
  description = "Number of days to retain leads (TTL for PII hygiene)"
  type        = number
  default     = 548 # 18 months

  validation {
    condition     = var.dynamodb_ttl_days > 0 && var.dynamodb_ttl_days <= 730
    error_message = "TTL must be between 1 and 730 days (2 years)."
  }
}

variable "enable_point_in_time_recovery" {
  description = "Enable point-in-time recovery for DynamoDB"
  type        = bool
  default     = true
}

# ============================================================================
# Lambda Configuration
# ============================================================================

variable "lambda_runtime" {
  description = "Lambda runtime version"
  type        = string
  default     = "nodejs20.x"
}

variable "lambda_memory_size" {
  description = "Lambda memory size in MB"
  type        = number
  default     = 256

  validation {
    condition     = var.lambda_memory_size >= 128 && var.lambda_memory_size <= 10240
    error_message = "Lambda memory must be between 128 and 10240 MB."
  }
}

variable "lambda_timeout" {
  description = "Lambda timeout in seconds"
  type        = number
  default     = 10

  validation {
    condition     = var.lambda_timeout >= 1 && var.lambda_timeout <= 900
    error_message = "Lambda timeout must be between 1 and 900 seconds."
  }
}

variable "lambda_log_retention_days" {
  description = "CloudWatch log retention period in days"
  type        = number
  default     = 30

  validation {
    condition = contains([
      1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180,
      365, 400, 545, 731, 1096, 1827, 2192, 2557,
      2922, 3288, 3653
    ], var.lambda_log_retention_days)
    error_message = "Invalid log retention period. Must be a valid CloudWatch Logs retention value."
  }
}

# ============================================================================
# API Gateway Configuration
# ============================================================================

variable "api_throttle_burst_limit" {
  description = "API Gateway throttle burst limit (requests per second)"
  type        = number
  default     = 10
}

variable "api_throttle_rate_limit" {
  description = "API Gateway throttle rate limit (steady-state requests per second)"
  type        = number
  default     = 5
}

# ============================================================================
# WAF Configuration
# ============================================================================

variable "waf_rate_limit" {
  description = "WAF rate limit (requests per 5 minutes per IP)"
  type        = number
  default     = 100

  validation {
    condition     = var.waf_rate_limit >= 100 && var.waf_rate_limit <= 20000000
    error_message = "WAF rate limit must be between 100 and 20,000,000."
  }
}

variable "enable_waf" {
  description = "Enable AWS WAF protection"
  type        = bool
  default     = true
}

# ============================================================================
# Email Configuration
# ============================================================================

variable "notification_email" {
  description = "Email address to receive lead notifications"
  type        = string
}

variable "notification_from_email" {
  description = "Email address to send notifications from (must be verified in Resend)"
  type        = string
}

# ============================================================================
# Secrets Configuration
# ============================================================================

variable "hmac_server_secret" {
  description = "HMAC server secret for request verification (leave empty to generate)"
  type        = string
  default     = ""
  sensitive   = true
}

# Note: Turnstile and Resend secrets should be set via terraform.tfvars or environment variables

