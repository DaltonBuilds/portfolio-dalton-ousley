/**
 * Terraform Backend Configuration - PRODUCTION GRADE
 * 
 * This file sets up a secure S3 backend with encryption and state locking.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create the S3 bucket and DynamoDB table using the provided script
 * 2. Uncomment the backend configuration below
 * 3. Run: terraform init -migrate-state
 */

terraform {
  backend "s3" {
    bucket         = "dalton-portfolio-terraform-state"
    key            = "portfolio-leads/terraform.tfstate"
    region         = "us-east-1"
    profile        = "prod-admin"
    
    # Security: Server-side encryption
    encrypt        = true
    kms_key_id     = "alias/terraform-state-key"
    
    # State locking prevents concurrent modifications
    dynamodb_table = "terraform-state-locks"
    
    # Access control
    acl            = "private"
  }
}

# ==============================================================================
# S3 Backend Infrastructure (Bootstrap)
# ==============================================================================

# Create this infrastructure FIRST in a separate workspace, then uncomment above
# and migrate state using: terraform init -migrate-state

resource "aws_s3_bucket" "terraform_state" {
  count = var.create_backend_infrastructure ? 1 : 0

  bucket = "dalton-portfolio-terraform-state"

  tags = {
    Name        = "Terraform State Bucket"
    Description = "Stores Terraform state files securely"
    ManagedBy   = "terraform"
  }
}

# Enable versioning for state history and recovery
resource "aws_s3_bucket_versioning" "terraform_state" {
  count = var.create_backend_infrastructure ? 1 : 0

  bucket = aws_s3_bucket.terraform_state[0].id

  versioning_configuration {
    status = "Enabled"
  }
}

# Enable server-side encryption by default
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  count = var.create_backend_infrastructure ? 1 : 0

  bucket = aws_s3_bucket.terraform_state[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.terraform_state[0].id
    }
    bucket_key_enabled = true
  }
}

# Block all public access
resource "aws_s3_bucket_public_access_block" "terraform_state" {
  count = var.create_backend_infrastructure ? 1 : 0

  bucket = aws_s3_bucket.terraform_state[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Note: Object lock disabled to avoid race condition with versioning
# Versioning + KMS encryption provides sufficient protection for state files
# If needed, enable manually in AWS Console after infrastructure creation

# KMS key for encrypting state files
resource "aws_kms_key" "terraform_state" {
  count = var.create_backend_infrastructure ? 1 : 0

  description             = "KMS key for Terraform state encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = {
    Name      = "Terraform State KMS Key"
    ManagedBy = "terraform"
  }
}

resource "aws_kms_alias" "terraform_state" {
  count = var.create_backend_infrastructure ? 1 : 0

  name          = "alias/terraform-state-key"
  target_key_id = aws_kms_key.terraform_state[0].key_id
}

# DynamoDB table for state locking
resource "aws_dynamodb_table" "terraform_locks" {
  count = var.create_backend_infrastructure ? 1 : 0

  name         = "terraform-state-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled = true
  }

  tags = {
    Name        = "Terraform State Locks"
    Description = "Prevents concurrent Terraform operations"
    ManagedBy   = "terraform"
  }
}

# ==============================================================================
# Notes
# ==============================================================================

# Outputs for backend configuration are in outputs.tf for consistency

