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
    key          = "identity/terraform.tfstate"
    region       = "us-east-1"
    profile      = "portfolio-prod"
    encrypt      = true
    use_lockfile = true
  }
}

provider "aws" {
  region  = "us-east-1"
  profile = "portfolio-prod"
}
