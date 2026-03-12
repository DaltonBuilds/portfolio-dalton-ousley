locals {
  bucket_name = "dalton-portfolio-terraform-state"
}

# ---------------------------------------------------------------------------
# Import blocks — run `terraform apply` once to adopt the existing bucket.
# After the first successful apply these blocks can be removed.
# ---------------------------------------------------------------------------

import {
  to = aws_s3_bucket.terraform_state
  id = local.bucket_name
}

import {
  to = aws_s3_bucket_versioning.terraform_state
  id = local.bucket_name
}

import {
  to = aws_s3_bucket_server_side_encryption_configuration.terraform_state
  id = local.bucket_name
}

import {
  to = aws_s3_bucket_public_access_block.terraform_state
  id = local.bucket_name
}

# ---------------------------------------------------------------------------
# State bucket
# ---------------------------------------------------------------------------

resource "aws_s3_bucket" "terraform_state" {
  bucket = local.bucket_name

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Project   = "portfolio"
    ManagedBy = "terraform"
    Purpose   = "terraform-state"
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
