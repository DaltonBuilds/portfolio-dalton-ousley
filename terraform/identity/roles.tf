data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

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
      values   = ["repo:DaltonBuilds/portfolio-dalton-ousley:ref:refs/heads/main"]
    }
  }
}

data "aws_iam_policy_document" "github_actions_permissions" {
  statement {
    effect  = "Allow"
    actions = ["lambda:UpdateFunctionCode"]
    resources = [
      "arn:aws:lambda:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:function:portfolio-leads-prod-lead-processor",
      "arn:aws:lambda:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:function:portfolio-leads-prod-email-notifier",
    ]
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