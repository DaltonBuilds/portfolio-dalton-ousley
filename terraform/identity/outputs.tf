output "github_actions_deploy_role_arn" {
  description = "ARN of the IAM role assumed by GitHub Actions for deployments. Reference this in your workflow YAML."
  value       = aws_iam_role.github_actions_deploy.arn
}
