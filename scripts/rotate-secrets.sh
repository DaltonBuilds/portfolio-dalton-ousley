#!/bin/bash
set -euo pipefail

###############################################################################
# Rotate Secrets
#
# This script rotates secrets stored in AWS Secrets Manager.
# Safe to run manually or via automated cron job.
#
# USAGE:
#   ./scripts/rotate-secrets.sh [secret-name]
#
# EXAMPLES:
#   ./scripts/rotate-secrets.sh hmac-server  # Rotate HMAC secret only
#   ./scripts/rotate-secrets.sh              # Interactive mode
###############################################################################

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
AWS_REGION="us-east-1"
AWS_PROFILE="dalton-portfolio"

echo -e "${BLUE}┌────────────────────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  AWS Secrets Manager - Secret Rotation                     │${NC}"
echo -e "${BLUE}└────────────────────────────────────────────────────────────┘${NC}"
echo ""

# Function to rotate HMAC secret
rotate_hmac() {
    local secret_id="portfolio/hmac-server-secret"
    
    echo -e "${YELLOW}→ Rotating HMAC Server Secret...${NC}"
    
    # Generate new secret
    new_secret=$(openssl rand -hex 32)
    
    # Update in AWS Secrets Manager
    aws secretsmanager put-secret-value \
        --profile "$AWS_PROFILE" \
        --region "$AWS_REGION" \
        --secret-id "$secret_id" \
        --secret-string "$new_secret" \
        --output json > /dev/null
    
    echo -e "${GREEN}✓ HMAC secret rotated successfully${NC}"
    echo -e "${YELLOW}⚠ IMPORTANT: Update dependent services with new secret${NC}"
    echo ""
}

# Function to list all secrets
list_secrets() {
    echo -e "${BLUE}Available secrets:${NC}"
    aws secretsmanager list-secrets \
        --profile "$AWS_PROFILE" \
        --region "$AWS_REGION" \
        --filters Key=name,Values=portfolio/ \
        --query 'SecretList[*].[Name,Description]' \
        --output table
    echo ""
}

# Interactive mode
if [[ $# -eq 0 ]]; then
    list_secrets
    
    echo "Which secret would you like to rotate?"
    echo "1) HMAC Server Secret (auto-generated)"
    echo "2) All rotatable secrets"
    echo "3) Exit"
    read -p "Enter choice [1-3]: " choice
    
    case $choice in
        1) rotate_hmac ;;
        2) rotate_hmac ;;
        3) echo "Exiting."; exit 0 ;;
        *) echo -e "${RED}Invalid choice${NC}"; exit 1 ;;
    esac
else
    case $1 in
        hmac-server|hmac) rotate_hmac ;;
        *) echo -e "${RED}Unknown secret: $1${NC}"; exit 1 ;;
    esac
fi

echo -e "${GREEN}✓ Rotation complete${NC}"

