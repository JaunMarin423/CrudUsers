#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
STAGE="dev"
REGION="us-east-1"
PROFILE="default"
FORCE=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --stage)
      STAGE="$2"
      shift 2
      ;;
    --region)
      REGION="$2"
      shift 2
      ;;
    --profile)
      PROFILE="$2"
      shift 2
      ;;
    --force)
      FORCE="--force"
      shift
      ;;
    *)
      echo "Unknown parameter: $1"
      exit 1
      ;;
  esac
done

echo -e "${YELLOW}🚀 Starting deployment to ${STAGE} in ${REGION}...${NC}"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing dependencies...${NC}"
  npm ci
fi

# Build the application
echo -e "${YELLOW}Building the application...${NC}"
npm run build

# Deploy using serverless framework
echo -e "${YELLOW}Deploying to AWS...${NC}"
npx serverless deploy --stage ${STAGE} --region ${REGION} --aws-profile ${PROFILE} ${FORCE}

echo -e "${GREEN}✅ Deployment to ${STAGE} completed successfully!${NC}"
echo -e "${GREEN}🔗 API endpoints are now available in the output above.${NC}"
