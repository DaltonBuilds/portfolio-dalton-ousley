#!/bin/bash
set -euo pipefail

###############################################################################
# Setup Terraform Backend Infrastructure
#
# This script bootstraps the S3 bucket and DynamoDB table for storing
# Terraform state securely with encryption and state locking.
#
# USAGE:
#   ./scripts/setup-backend-infrastructure.sh
#
# REQUIREMENTS:
#   - AWS CLI configured with appropriate credentials
#   - Terraform installed
###############################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="us-east-1"
AWS_PROFILE="dalton-portfolio"

echo -e "${BLUE}┌────────────────────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  Terraform Backend Infrastructure Setup                    │${NC}"
echo -e "${BLUE}└────────────────────────────────────────────────────────────┘${NC}"
echo ""

# Verify AWS credentials
echo -e "${YELLOW}→ Verifying AWS credentials...${NC}"
if ! aws sts get-caller-identity --profile "$AWS_PROFILE" &>/dev/null; then
    echo -e "${RED}✗ AWS credentials not configured for profile: $AWS_PROFILE${NC}"
    exit 1
fi
echo -e "${GREEN}✓ AWS credentials verified${NC}"
echo ""

# Navigate to terraform directory
cd "$(dirname "$0")/../terraform" || exit 1

# Step 1: Create backend infrastructure
echo -e "${YELLOW}→ Creating S3 bucket and DynamoDB table...${NC}"
terraform init
terraform plan \
    -var="create_backend_infrastructure=true" \
    -out=backend-tfplan

read -p "Apply this plan? (yes/no): " confirmation
if [[ "$confirmation" != "yes" ]]; then
    echo -e "${RED}✗ Aborted by user${NC}"
    exit 1
fi

terraform apply backend-tfplan
rm backend-tfplan
echo -e "${GREEN}✓ Backend infrastructure created${NC}"
echo ""

# Step 2: Get bucket and table names
BUCKET_NAME=$(terraform output -raw backend_configuration | jq -r '.bucket')
DYNAMODB_TABLE=$(terraform output -raw backend_configuration | jq -r '.dynamodb_table')

echo -e "${GREEN}✓ Created:${NC}"
echo -e "  - S3 Bucket: ${BLUE}$BUCKET_NAME${NC}"
echo -e "  - DynamoDB Table: ${BLUE}$DYNAMODB_TABLE${NC}"
echo ""

# Step 3: Enable backend configuration
echo -e "${YELLOW}→ Next steps:${NC}"
echo ""
echo "1. Edit terraform/backend-config.tf and uncomment the backend block"
echo "2. Run: terraform init -migrate-state"
echo "3. Confirm state migration when prompted"
echo "4. Delete local state files: rm terraform.tfstate*"
echo "5. Set create_backend_infrastructure=false in your tfvars"
echo ""
echo -e "${GREEN}✓ Backend infrastructure setup complete!${NC}"

