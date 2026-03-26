locals {
  account_id = data.aws_caller_identity.current.account_id
  region     = data.aws_region.current.name
  repo       = "repo:DaltonBuilds/portfolio-dalton-ousley"

  lambda_arns = [
    "arn:aws:lambda:${local.region}:${local.account_id}:function:portfolio-leads-prod-lead-processor",
    "arn:aws:lambda:${local.region}:${local.account_id}:function:portfolio-leads-prod-email-notifier",
  ]

  ecr_repo_arns = [
    "arn:aws:ecr:${local.region}:${local.account_id}:repository/portfolio-leads-prod-lead-processor",
    "arn:aws:ecr:${local.region}:${local.account_id}:repository/portfolio-leads-prod-email-notifier",
  ]
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# ===========================================================================
# Trust policy — allow OIDC from main branch pushes AND pull requests
# ===========================================================================

data "aws_iam_policy_document" "github_actions_trust" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values = [
        "${local.repo}:ref:refs/heads/main",
        "${local.repo}:pull_request",
      ]
    }
  }
}

# ===========================================================================
# Permissions — Terraform state backend (S3)
# ===========================================================================

data "aws_iam_policy_document" "github_actions_permissions" {
  statement {
    sid    = "TerraformStateList"
    effect = "Allow"
    actions = [
      "s3:ListBucket",
    ]
    resources = ["arn:aws:s3:::dalton-portfolio-prod-terraform-state"]
  }

  statement {
    sid    = "TerraformStateReadWrite"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]
    resources = ["arn:aws:s3:::dalton-portfolio-prod-terraform-state/portfolio-leads/*"]
  }

  # ===========================================================================
  # ECR — push images (deploy job) + Terraform manages repos & lifecycle policies
  # ===========================================================================

  statement {
    sid       = "EcrAuth"
    effect    = "Allow"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }

  statement {
    sid    = "EcrPush"
    effect = "Allow"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
      "ecr:PutImage",
    ]
    resources = local.ecr_repo_arns
  }

  statement {
    sid    = "EcrManage"
    effect = "Allow"
    actions = [
      "ecr:CreateRepository",
      "ecr:DeleteRepository",
      "ecr:DescribeRepositories",
      "ecr:ListTagsForResource",
      "ecr:TagResource",
      "ecr:UntagResource",
      "ecr:GetRepositoryPolicy",
      "ecr:SetRepositoryPolicy",
      "ecr:DeleteRepositoryPolicy",
      "ecr:PutImageScanningConfiguration",
      "ecr:PutImageTagMutability",
      "ecr:GetLifecyclePolicy",
      "ecr:PutLifecyclePolicy",
      "ecr:DeleteLifecyclePolicy",
      "ecr:BatchGetImage",
      "ecr:DescribeImages",
    ]
    resources = local.ecr_repo_arns
  }

  # ===========================================================================
  # Lambda — Terraform manages functions, permissions, event source mappings
  # ===========================================================================

  statement {
    sid    = "LambdaManage"
    effect = "Allow"
    actions = [
      "lambda:GetFunction",
      "lambda:GetFunctionConfiguration",
      "lambda:GetFunctionCodeSigningConfig",
      "lambda:CreateFunction",
      "lambda:UpdateFunctionCode",
      "lambda:UpdateFunctionConfiguration",
      "lambda:DeleteFunction",
      "lambda:ListVersionsByFunction",
      "lambda:GetPolicy",
      "lambda:AddPermission",
      "lambda:RemovePermission",
      "lambda:ListTags",
      "lambda:TagResource",
      "lambda:UntagResource",
    ]
    resources = local.lambda_arns
  }

  # ===========================================================================
  # IAM — Terraform manages Lambda execution roles & inline policies
  # ===========================================================================

  statement {
    sid    = "IamRoles"
    effect = "Allow"
    actions = [
      "iam:GetRole",
      "iam:CreateRole",
      "iam:DeleteRole",
      "iam:UpdateRole",
      "iam:UpdateAssumeRolePolicy",
      "iam:PassRole",
      "iam:ListRolePolicies",
      "iam:ListAttachedRolePolicies",
      "iam:ListInstanceProfilesForRole",
      "iam:TagRole",
      "iam:UntagRole",
      "iam:GetRolePolicy",
      "iam:PutRolePolicy",
      "iam:DeleteRolePolicy",
      "iam:AttachRolePolicy",
      "iam:DetachRolePolicy",
    ]
    resources = [
      "arn:aws:iam::${local.account_id}:role/portfolio-leads-prod-*",
    ]
  }

  # ===========================================================================
  # API Gateway v2 — Terraform manages HTTP API, stages, routes, integrations
  # ===========================================================================

  statement {
    sid    = "ApiGatewayManage"
    effect = "Allow"
    actions = [
      "apigateway:GET",
      "apigateway:POST",
      "apigateway:PUT",
      "apigateway:PATCH",
      "apigateway:DELETE",
      "apigateway:TagResource",
      "apigateway:UntagResource",
    ]
    resources = [
      "arn:aws:apigateway:${local.region}::/apis",
      "arn:aws:apigateway:${local.region}::/apis/*",
    ]
  }

  # ===========================================================================
  # DynamoDB — Terraform manages the leads table
  # ===========================================================================

  statement {
    sid    = "DynamoDbManage"
    effect = "Allow"
    actions = [
      "dynamodb:CreateTable",
      "dynamodb:DeleteTable",
      "dynamodb:DescribeTable",
      "dynamodb:DescribeContinuousBackups",
      "dynamodb:DescribeTimeToLive",
      "dynamodb:UpdateTable",
      "dynamodb:UpdateContinuousBackups",
      "dynamodb:UpdateTimeToLive",
      "dynamodb:ListTagsOfResource",
      "dynamodb:TagResource",
      "dynamodb:UntagResource",
    ]
    resources = [
      "arn:aws:dynamodb:${local.region}:${local.account_id}:table/portfolio-leads-prod-*",
    ]
  }

  # ===========================================================================
  # EventBridge — custom bus, rules, targets
  # ===========================================================================

  statement {
    sid    = "EventBridgeManage"
    effect = "Allow"
    actions = [
      "events:CreateEventBus",
      "events:DeleteEventBus",
      "events:DescribeEventBus",
      "events:PutRule",
      "events:DeleteRule",
      "events:DescribeRule",
      "events:PutTargets",
      "events:RemoveTargets",
      "events:ListTargetsByRule",
      "events:ListTagsForResource",
      "events:TagResource",
      "events:UntagResource",
    ]
    resources = [
      "arn:aws:events:${local.region}:${local.account_id}:event-bus/portfolio-leads-prod-*",
      "arn:aws:events:${local.region}:${local.account_id}:rule/portfolio-leads-prod-*/*",
    ]
  }

  # ===========================================================================
  # SQS — DLQ for EventBridge target
  # ===========================================================================

  statement {
    sid    = "SqsManage"
    effect = "Allow"
    actions = [
      "sqs:CreateQueue",
      "sqs:DeleteQueue",
      "sqs:GetQueueAttributes",
      "sqs:GetQueueUrl",
      "sqs:SetQueueAttributes",
      "sqs:ListQueueTags",
      "sqs:TagQueue",
      "sqs:UntagQueue",
    ]
    resources = [
      "arn:aws:sqs:${local.region}:${local.account_id}:portfolio-leads-prod-*",
    ]
  }

  # ===========================================================================
  # CloudWatch Logs — log groups for Lambda & API Gateway
  # ===========================================================================

  statement {
    sid       = "CloudWatchLogsDescribe"
    effect    = "Allow"
    actions   = ["logs:DescribeLogGroups"]
    resources = ["arn:aws:logs:${local.region}:${local.account_id}:log-group:*"]
  }

  statement {
    sid    = "CloudWatchLogsManage"
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:DeleteLogGroup",
      "logs:ListTagsForResource",
      "logs:TagResource",
      "logs:UntagResource",
      "logs:PutRetentionPolicy",
      "logs:DeleteRetentionPolicy",
    ]
    resources = [
      "arn:aws:logs:${local.region}:${local.account_id}:log-group:/aws/lambda/portfolio-leads-prod-*",
      "arn:aws:logs:${local.region}:${local.account_id}:log-group:/aws/apigateway/portfolio-leads-prod*",
    ]
  }

  # ===========================================================================
  # CloudWatch Alarms — metric alarms for Lambda, API GW, DynamoDB, SQS
  # ===========================================================================

  statement {
    sid    = "CloudWatchAlarmsManage"
    effect = "Allow"
    actions = [
      "cloudwatch:PutMetricAlarm",
      "cloudwatch:DeleteAlarms",
      "cloudwatch:DescribeAlarms",
      "cloudwatch:ListTagsForResource",
      "cloudwatch:TagResource",
      "cloudwatch:UntagResource",
    ]
    resources = [
      "arn:aws:cloudwatch:${local.region}:${local.account_id}:alarm:portfolio-leads-prod-*",
    ]
  }

  # ===========================================================================
  # Secrets Manager — Terraform manages secret metadata (not values)
  # ===========================================================================

  statement {
    sid    = "SecretsManagerManage"
    effect = "Allow"
    actions = [
      "secretsmanager:CreateSecret",
      "secretsmanager:DeleteSecret",
      "secretsmanager:DescribeSecret",
      "secretsmanager:GetResourcePolicy",
      "secretsmanager:PutResourcePolicy",
      "secretsmanager:DeleteResourcePolicy",
      "secretsmanager:TagResource",
      "secretsmanager:UntagResource",
    ]
    resources = [
      "arn:aws:secretsmanager:${local.region}:${local.account_id}:secret:portfolio/*",
    ]
  }

  # ===========================================================================
  # STS — Terraform data sources (aws_caller_identity)
  # ===========================================================================

  statement {
    sid       = "StsGetCaller"
    effect    = "Allow"
    actions   = ["sts:GetCallerIdentity"]
    resources = ["*"]
  }
}

resource "aws_iam_role" "github_actions_deploy" {
  name               = "github-actions-portfolio-deploy"
  assume_role_policy = data.aws_iam_policy_document.github_actions_trust.json

  tags = {
    Project   = "portfolio"
    ManagedBy = "terraform"
  }
}

resource "aws_iam_role_policy" "github_actions" {
  name   = "github-actions-portfolio-permissions"
  role   = aws_iam_role.github_actions_deploy.id
  policy = data.aws_iam_policy_document.github_actions_permissions.json
}