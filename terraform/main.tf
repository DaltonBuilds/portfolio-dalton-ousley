/**
 * Main Terraform Configuration - SECURE VERSION
 * 
 * This file contains the primary resource definitions and
 * orchestrates the infrastructure components.
 * 
 * SECURITY: No secret generation or management here.
 * Secrets are managed externally to keep them out of Terraform state.
 */

# Local values for consistent naming and configuration
locals {
  name_prefix = "${var.project_name}-${var.environment}"

  # Common tags for all resources
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

