# How to Switch from us-east-1 to us-east-2

If you want all your resources in us-east-2 to match your SSO region, follow these steps:

## Step 1: Destroy Current Infrastructure

```bash
cd terraform
terraform destroy -auto-approve
```

This will delete all resources in us-east-1 (takes ~2-3 minutes).

## Step 2: Update Region Variable

Edit `terraform/terraform.tfvars`:

```hcl
# Change this line:
aws_region = "us-east-1"

# To this:
aws_region = "us-east-2"
```

## Step 3: Redeploy to us-east-2

```bash
terraform apply -auto-approve
```

This will create all resources in us-east-2 (takes ~5-8 minutes).

## Step 4: Update Frontend URLs

The API Gateway URL will change. Update `.env.local` with the new URL from Terraform outputs.

---

**That's it!** All your resources will now be in us-east-2.

