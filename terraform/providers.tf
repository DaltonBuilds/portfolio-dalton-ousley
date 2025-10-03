/**
 * Terraform Providers Configuration
 * 
 * Configures the AWS provider and Terraform backend
 */

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  # Backend configuration for state management
  # For initial setup, we'll use local backend
  # In production, migrate to S3 + DynamoDB for state locking
  # 
  # To migrate to S3 backend later, uncomment and configure:
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"
  #   key            = "portfolio/lead-capture/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-state-locks"
  # }
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile

  default_tags {
    tags = {
      Project     = "portfolio-lead-capture"
      Environment = var.environment
      ManagedBy   = "terraform"
      Owner       = var.owner_email
    }
  }
}

