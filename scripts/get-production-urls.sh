#!/bin/bash

echo "🔍 Finding your ArtSpot production URLs..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Frontend (Amplify)
echo -e "${BLUE}🌐 Frontend (AWS Amplify):${NC}"
aws amplify list-apps --query 'apps[?name==`artspot-web` || name==`artspot-platform`].[name,defaultDomain]' --output table 2>/dev/null
echo ""

# Try multiple regions for App Runner
regions=("us-east-1" "us-west-2" "ap-southeast-2" "eu-west-1")

echo -e "${BLUE}🚀 API & CMS (AWS App Runner):${NC}"
for region in "${regions[@]}"; do
  echo -e "${YELLOW}Checking region: $region${NC}"
  services=$(aws apprunner list-services --region $region 2>/dev/null)

  if [ $? -eq 0 ] && [ ! -z "$services" ]; then
    echo "$services" | jq -r '.ServiceSummaryList[] | "  ✅ \(.ServiceName): https://\(.ServiceUrl) (\(.Status))"' 2>/dev/null
  fi
done

echo ""
echo -e "${BLUE}📊 Database (AWS RDS):${NC}"
aws rds describe-db-instances --query 'DBInstances[?contains(DBInstanceIdentifier, `artspot`)].{Name:DBInstanceIdentifier,Endpoint:Endpoint.Address,Port:Endpoint.Port,Status:DBInstanceStatus}' --output table 2>/dev/null

echo ""
echo -e "${GREEN}💡 Tip: If you see empty results, try running with --profile if you have AWS profiles configured${NC}"
echo ""
