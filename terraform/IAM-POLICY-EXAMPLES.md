# IAM Policy Examples for Secure Terraform Setup

## 🔐 Overview

This document provides production-ready IAM policies for securing your Terraform infrastructure and secrets management.

---

## 1. Terraform State Bucket Access Policy

### S3 Bucket Policy

Attach to the Terraform state bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyUnencryptedObjectUploads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::dalton-portfolio-terraform-state/*",
      "Condition": {
        "StringNotEquals": {
          "s3:x-amz-server-side-encryption": "aws:kms"
        }
      }
    },
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::dalton-portfolio-terraform-state",
        "arn:aws:s3:::dalton-portfolio-terraform-state/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    },
    {
      "Sid": "AllowTerraformAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:user/dalton-portfolio"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::dalton-portfolio-terraform-state/*"
    },
    {
      "Sid": "AllowTerraformListBucket",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:user/dalton-portfolio"
      },
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::dalton-portfolio-terraform-state"
    }
  ]
}
```

---

## 2. IAM User Policy for Terraform

### Minimal Permissions for Terraform Operations

Attach to your IAM user or role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "TerraformStateAccess",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketVersioning"
      ],
      "Resource": "arn:aws:s3:::dalton-portfolio-terraform-state"
    },
    {
      "Sid": "TerraformStateObjectAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::dalton-portfolio-terraform-state/*"
    },
    {
      "Sid": "TerraformStateLocking",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:DescribeTable"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:123456789012:table/terraform-state-locks"
    },
    {
      "Sid": "KMSAccess",
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt",
        "kms:Encrypt",
        "kms:DescribeKey",
        "kms:GenerateDataKey"
      ],
      "Resource": "arn:aws:kms:us-east-1:123456789012:key/*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "s3.us-east-1.amazonaws.com"
        }
      }
    }
  ]
}
```

---

## 3. Secrets Manager Access Policy

### Read-Only Access for Terraform

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSecretsManagerReadOnly",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:DescribeSecret",
        "secretsmanager:GetSecretValue",
        "secretsmanager:ListSecrets"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:123456789012:secret:portfolio/*"
    }
  ]
}
```

### Full Access for Secret Management

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSecretsManagerFullAccess",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:CreateSecret",
        "secretsmanager:DeleteSecret",
        "secretsmanager:DescribeSecret",
        "secretsmanager:GetSecretValue",
        "secretsmanager:PutSecretValue",
        "secretsmanager:UpdateSecret",
        "secretsmanager:TagResource",
        "secretsmanager:UntagResource"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:123456789012:secret:portfolio/*"
    },
    {
      "Sid": "AllowSecretsManagerList",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:ListSecrets"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## 4. Lambda Execution Role - Secrets Access

### Policy for Lambda to Read Secrets

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSecretsRead",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:us-east-1:123456789012:secret:portfolio/hmac-server-secret-*",
        "arn:aws:secretsmanager:us-east-1:123456789012:secret:portfolio/turnstile-secret-*",
        "arn:aws:secretsmanager:us-east-1:123456789012:secret:portfolio/resend-api-key-*"
      ]
    },
    {
      "Sid": "AllowKMSDecrypt",
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt"
      ],
      "Resource": "arn:aws:kms:us-east-1:123456789012:key/*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "secretsmanager.us-east-1.amazonaws.com"
        }
      }
    }
  ]
}
```

---

## 5. KMS Key Policy

### Key Policy for Terraform State Encryption

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Enable IAM User Permissions",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:root"
      },
      "Action": "kms:*",
      "Resource": "*"
    },
    {
      "Sid": "Allow S3 to use the key",
      "Effect": "Allow",
      "Principal": {
        "Service": "s3.amazonaws.com"
      },
      "Action": [
        "kms:Decrypt",
        "kms:GenerateDataKey"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "s3.us-east-1.amazonaws.com"
        }
      }
    },
    {
      "Sid": "Allow Terraform User",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:user/dalton-portfolio"
      },
      "Action": [
        "kms:Decrypt",
        "kms:Encrypt",
        "kms:DescribeKey",
        "kms:GenerateDataKey"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## 6. CI/CD Pipeline IAM Role

### For GitHub Actions / GitLab CI

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "TerraformPlanAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::dalton-portfolio-terraform-state",
        "arn:aws:s3:::dalton-portfolio-terraform-state/*"
      ]
    },
    {
      "Sid": "TerraformApplyAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::dalton-portfolio-terraform-state/*",
      "Condition": {
        "StringEquals": {
          "aws:PrincipalTag/Environment": "prod"
        }
      }
    },
    {
      "Sid": "DynamoDBLockAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:123456789012:table/terraform-state-locks"
    }
  ]
}
```

---

## 7. Audit and Compliance Policy

### CloudTrail Data Events for State Access

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AWSCloudTrailCreateLogStream",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudtrail.amazonaws.com"
      },
      "Action": "logs:CreateLogStream",
      "Resource": "arn:aws:logs:us-east-1:123456789012:log-group:*"
    },
    {
      "Sid": "AWSCloudTrailPutLogEvents",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudtrail.amazonaws.com"
      },
      "Action": "logs:PutLogEvents",
      "Resource": "arn:aws:logs:us-east-1:123456789012:log-group:*"
    }
  ]
}
```

---

## 8. Terraform Resource - Applying These Policies

### Example: S3 Bucket Policy in Terraform

```hcl
resource "aws_s3_bucket_policy" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DenyUnencryptedObjectUploads"
        Effect = "Deny"
        Principal = "*"
        Action = "s3:PutObject"
        Resource = "${aws_s3_bucket.terraform_state.arn}/*"
        Condition = {
          StringNotEquals = {
            "s3:x-amz-server-side-encryption" = "aws:kms"
          }
        }
      },
      {
        Sid    = "DenyInsecureTransport"
        Effect = "Deny"
        Principal = "*"
        Action = "s3:*"
        Resource = [
          aws_s3_bucket.terraform_state.arn,
          "${aws_s3_bucket.terraform_state.arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      }
    ]
  })
}
```

### Example: KMS Key Policy in Terraform

```hcl
data "aws_iam_policy_document" "kms_key_policy" {
  statement {
    sid    = "Enable IAM User Permissions"
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"]
    }
    actions   = ["kms:*"]
    resources = ["*"]
  }

  statement {
    sid    = "Allow Terraform User"
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = [data.aws_caller_identity.current.arn]
    }
    actions = [
      "kms:Decrypt",
      "kms:Encrypt",
      "kms:DescribeKey",
      "kms:GenerateDataKey"
    ]
    resources = ["*"]
  }
}

resource "aws_kms_key" "terraform_state" {
  description             = "KMS key for Terraform state encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  policy                  = data.aws_iam_policy_document.kms_key_policy.json
}
```

---

## 9. Security Best Practices

### Principle of Least Privilege

1. **Grant only required permissions**
2. **Use resource-level permissions** where possible
3. **Implement condition keys** for additional constraints
4. **Regular access reviews** (quarterly)
5. **Enable MFA** for sensitive operations

### Policy Validation

```bash
# Validate IAM policy syntax
aws iam validate-policy \
  --policy-document file://policy.json \
  --policy-type IDENTITY

# Simulate policy
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::123456789012:user/dalton-portfolio \
  --action-names s3:GetObject \
  --resource-arns arn:aws:s3:::dalton-portfolio-terraform-state/*
```

---

## 10. Monitoring and Alerts

### CloudWatch Alarms for Unauthorized Access

```hcl
resource "aws_cloudwatch_metric_alarm" "unauthorized_secret_access" {
  alarm_name          = "UnauthorizedSecretAccess"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "UnauthorizedAPICallsCount"
  namespace           = "AWS/SecretsManager"
  period              = 300
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "Alert on unauthorized Secrets Manager access attempts"
  alarm_actions       = [aws_sns_topic.security_alerts.arn]
}
```

---

## 🔗 References

- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [S3 Bucket Policies](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-policies.html)
- [KMS Key Policies](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html)
- [Secrets Manager IAM Policies](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access.html)

---

**Note:** Replace account ID `123456789012` and user ARNs with your actual values before applying these policies.

