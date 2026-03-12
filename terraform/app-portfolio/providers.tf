terraform {
  required_version = ">= 1.10.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket       = "dalton-portfolio-prod-terraform-state"
    key          = "portfolio-leads/terraform.tfstate"
    region       = "us-east-1"
    profile      = "portfolio-prod"
    encrypt      = true
    use_lockfile = true
  }
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
