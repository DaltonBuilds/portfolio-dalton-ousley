# ECR for Lead Processor Lambda
resource "aws_ecr_repository" "lead_processor" {
    name = "${local.name_prefix}-lead-processor"
    image_tag_mutability = "IMMUTABLE"

    image_scanning_configuration {
        scan_on_push = true
    }

    tags = merge(local.common_tags, { Name = "${local.name_prefix}-lead-processor" })
}


resource "aws_ecr_lifecycle_policy" "lead_processor" {
  repository = aws_ecr_repository.lead_processor.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 10 images"
      
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 10
      }

      action = { 
        type = "expire" 
        }

    }]
  })
}

# ECR for Email Notifier Lambda
resource "aws_ecr_repository" "email_notifier" {
    name = "${local.name_prefix}-email-notifier"
    image_tag_mutability = "IMMUTABLE"

    image_scanning_configuration {
        scan_on_push = true
    }

    tags = merge(local.common_tags, { Name = "${local.name_prefix}-email-notifier" })
}


resource "aws_ecr_lifecycle_policy" "email_notifier" {
  repository = aws_ecr_repository.email_notifier.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 10 images"
      
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 10
      }

      action = { 
        type = "expire" 
        }

    }]
  })
}