/**
 * Main Terraform Configuration
 * 
 * This file contains the primary resource definitions and
 * orchestrates the infrastructure components.
 */

# Generate a random HMAC server secret if not provided
resource "random_password" "hmac_server_secret" {
  count = var.hmac_server_secret == "" ? 1 : 0

  length  = 64
  special = true
}

# Local values for consistent naming and configuration
locals {
  name_prefix = "${var.project_name}-${var.environment}"

  # Use provided secret or generated one
  hmac_server_secret = var.hmac_server_secret != "" ? var.hmac_server_secret : random_password.hmac_server_secret[0].result

  # Expose client secret via locals for clarity (value comes directly from var)
  hmac_client_secret = var.hmac_client_secret

  # Common tags for all resources
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

