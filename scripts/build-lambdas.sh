#!/bin/bash

##
# Build Script for Lambda Functions
# 
# Builds both Lambda functions and creates deployment packages
##

set -e

echo "🏗️  Building Lambda Functions..."
echo

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to build a Lambda
build_lambda() {
  local lambda_name=$1
  local lambda_dir=$2
  local original_dir=$(pwd)
  
  echo -e "${BLUE}Building ${lambda_name}...${NC}"
  
  cd "$lambda_dir"
  
  # Install dependencies
  if [ ! -d "node_modules" ]; then
    echo "  📦 Installing dependencies..."
    npm install --production=false
  fi
  
  # Build with esbuild
  echo "  🔨 Compiling TypeScript..."
  npm run build
  
  # Create deployment package
  echo "  📦 Creating deployment package..."
  cd dist
  zip -q -r lambda.zip index.js index.js.map
  
  # Add node_modules for non-AWS SDK dependencies
  if [ -d "../node_modules/resend" ]; then
    echo "  📦 Adding resend module..."
    cp -r ../node_modules/resend .
    zip -q -r lambda.zip resend
    rm -rf resend
  fi
  
  if [ -d "../node_modules/zod" ]; then
    echo "  📦 Adding zod module..."
    cp -r ../node_modules/zod .
    zip -q -r lambda.zip zod
    rm -rf zod
  fi
  
  cd "$original_dir"
  
  echo -e "${GREEN}✅ ${lambda_name} built successfully${NC}"
  echo
}

# Build lead processor
build_lambda "Lead Processor" "lambda/lead-processor"

# Build email notifier
build_lambda "Email Notifier" "lambda/email-notifier"

echo -e "${GREEN}✅ All Lambda functions built successfully!${NC}"
echo
echo "📁 Deployment packages:"
echo "  - lambda/lead-processor/dist/lambda.zip"
echo "  - lambda/email-notifier/dist/lambda.zip"
echo

