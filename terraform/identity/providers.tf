terraform {
  required_version = ">= 1.10.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket     = "dalton-portfolio-terraform-state"
    key        = "identity/terraform.tfstate"
    region     = "us-east-1"
    profile    = "prod-admin"
    encrypt    = true
    use_lockfile = true
  }
}

provider "aws" {
  region  = "us-east-1"
  profile = "prod-admin"
}
