# AWS Deployment Guide

This guide covers deploying ArtSpot to AWS using a serverless-first architecture with AWS Amplify and App Runner.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- GitHub account with repository access
- Domain name (optional, for custom domains)

## Architecture Overview

```
Frontend (Amplify) → API (App Runner) → Database (RDS PostgreSQL)
                   ↓                   ↓
              CMS (App Runner)    Cache (ElastiCache)
                                       ↓
                                  Storage (S3)
```

## Step 1: AWS Account Setup

### 1.1 Create IAM User for Deployment

```bash
# Create IAM user
aws iam create-user --user-name artspot-deploy

# Attach required policies
aws iam attach-user-policy --user-name artspot-deploy \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess-Amplify

aws iam attach-user-policy --user-name artspot-deploy \
  --policy-arn arn:aws:iam::aws:policy/AWSAppRunnerFullAccess

# Create access keys
aws iam create-access-key --user-name artspot-deploy
```

Save the `AccessKeyId` and `SecretAccessKey` - you'll need these for GitHub Actions.

### 1.2 Set Up AWS Secrets Manager

```bash
# Create database credentials secret
aws secretsmanager create-secret \
  --name artspot/database \
  --description "ArtSpot database credentials" \
  --secret-string '{
    "username": "artspot_admin",
    "password": "YOUR_SECURE_PASSWORD",
    "host": "artspot-db-dev.cpgo2ia2wuo1.ap-southeast-2.rds.amazonaws.com",
    "port": 5432,
    "database": "postgres"
  }'

# Create JWT secret
aws secretsmanager create-secret \
  --name artspot/jwt-secret \
  --description "JWT signing secret" \
  --secret-string "$(openssl rand -base64 32)"

# Create NextAuth secret
aws secretsmanager create-secret \
  --name artspot/nextauth-secret \
  --description "NextAuth secret" \
  --secret-string "$(openssl rand -base64 32)"
```

## Step 2: ElastiCache Redis Setup

### 2.1 Create ElastiCache Cluster

```bash
# Create subnet group
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name artspot-redis-subnet \
  --cache-subnet-group-description "ArtSpot Redis subnet group" \
  --subnet-ids subnet-xxxxx subnet-yyyyy

# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id artspot-redis \
  --cache-node-type cache.t4g.micro \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1 \
  --cache-subnet-group-name artspot-redis-subnet \
  --security-group-ids sg-xxxxx
```

### 2.2 Get Redis Endpoint

```bash
aws elasticache describe-cache-clusters \
  --cache-cluster-id artspot-redis \
  --show-cache-node-info
```

Save the `Endpoint.Address` for use in environment variables.

## Step 3: S3 Bucket Setup

### 3.1 Create S3 Bucket for Images

```bash
# Create bucket
aws s3api create-bucket \
  --bucket artspot-images-production \
  --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket artspot-images-production \
  --versioning-configuration Status=Enabled

# Set up lifecycle policy (archive to Glacier after 90 days)
aws s3api put-bucket-lifecycle-configuration \
  --bucket artspot-images-production \
  --lifecycle-configuration file://s3-lifecycle.json
```

**s3-lifecycle.json:**
```json
{
  "Rules": [
    {
      "Id": "ArchiveOldImages",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}
```

### 3.2 Create CloudFront Distribution

```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

## Step 4: AWS App Runner Setup

### 4.1 Deploy API Service

1. **Create App Runner service from GitHub**:

```bash
# Create source connection (one-time setup)
aws apprunner create-connection \
  --connection-name artspot-github \
  --provider-type GITHUB

# Create App Runner service for API
aws apprunner create-service \
  --service-name artspot-api-production \
  --source-configuration '{
    "CodeRepository": {
      "RepositoryUrl": "https://github.com/rodrigocotal/artspot-platform",
      "SourceCodeVersion": {
        "Type": "BRANCH",
        "Value": "main"
      },
      "CodeConfiguration": {
        "ConfigurationSource": "API",
        "CodeConfigurationValues": {
          "Runtime": "NODEJS_18",
          "BuildCommand": "cd apps/api && pnpm install && pnpm build",
          "StartCommand": "cd apps/api && pnpm start",
          "Port": "4000"
        }
      }
    },
    "AutoDeploymentsEnabled": true
  }' \
  --instance-configuration '{
    "Cpu": "1 vCPU",
    "Memory": "2 GB"
  }'
```

2. **Configure environment variables**:

```bash
aws apprunner update-service \
  --service-arn "arn:aws:apprunner:..." \
  --source-configuration '{
    "CodeRepository": {
      "CodeConfiguration": {
        "CodeConfigurationValues": {
          "RuntimeEnvironmentVariables": {
            "NODE_ENV": "production",
            "PORT": "4000",
            "DATABASE_URL": "postgresql://...",
            "REDIS_URL": "redis://...",
            "JWT_SECRET": "...",
            "CLOUDINARY_CLOUD_NAME": "doqecw19f",
            "CLOUDINARY_API_KEY": "288382122493568",
            "CLOUDINARY_API_SECRET": "..."
          }
        }
      }
    }
  }'
```

### 4.2 Deploy CMS Service

```bash
# Create App Runner service for CMS
aws apprunner create-service \
  --service-name artspot-cms-production \
  --source-configuration '{
    "CodeRepository": {
      "RepositoryUrl": "https://github.com/rodrigocotal/artspot-platform",
      "SourceCodeVersion": {
        "Type": "BRANCH",
        "Value": "main"
      },
      "CodeConfiguration": {
        "ConfigurationSource": "API",
        "CodeConfigurationValues": {
          "Runtime": "NODEJS_18",
          "BuildCommand": "cd apps/cms && pnpm install && pnpm build",
          "StartCommand": "cd apps/cms && pnpm start",
          "Port": "1337"
        }
      }
    },
    "AutoDeploymentsEnabled": true
  }' \
  --instance-configuration '{
    "Cpu": "1 vCPU",
    "Memory": "2 GB"
  }'
```

### 4.3 Get Service URLs

```bash
# Get API URL
aws apprunner describe-service \
  --service-arn "arn:aws:apprunner:us-east-1:ACCOUNT:service/artspot-api-production" \
  --query 'Service.ServiceUrl'

# Get CMS URL
aws apprunner describe-service \
  --service-arn "arn:aws:apprunner:us-east-1:ACCOUNT:service/artspot-cms-production" \
  --query 'Service.ServiceUrl'
```

## Step 5: AWS Amplify Setup

### 5.1 Create Amplify App

1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Select GitHub as the repository source
4. Choose `rodrigocotal/artspot-platform`
5. Select the `main` branch
6. Configure build settings:

**amplify.yml** (already in repo):
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd apps/web
        - npm install -g pnpm@8.15.0
        - pnpm install --frozen-lockfile
    build:
      commands:
        - pnpm build
  artifacts:
    baseDirectory: apps/web/.next
    files:
      - '**/*'
  cache:
    paths:
      - apps/web/node_modules/**/*
      - node_modules/**/*
```

### 5.2 Configure Environment Variables

In Amplify Console → Environment variables:

```
NEXT_PUBLIC_API_URL=https://xxxxx.us-east-1.awsapprunner.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=doqecw19f
NEXTAUTH_URL=https://main.xxxxx.amplifyapp.com
NEXTAUTH_SECRET=<from-secrets-manager>
```

### 5.3 Set Up Custom Domain (Optional)

1. In Amplify Console → Domain management
2. Add domain (e.g., artspot.com)
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

## Step 6: Configure GitHub Actions

### 6.1 Add GitHub Secrets

Go to GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

```
AWS_ACCESS_KEY_ID=<from-step-1.1>
AWS_SECRET_ACCESS_KEY=<from-step-1.1>
AWS_REGION=us-east-1

# API Service
AWS_APPRUNNER_API_SERVICE_ARN=arn:aws:apprunner:...
PRODUCTION_API_URL=https://xxxxx.us-east-1.awsapprunner.com

# CMS Service
AWS_APPRUNNER_CMS_SERVICE_ARN=arn:aws:apprunner:...
PRODUCTION_CMS_URL=https://xxxxx.us-east-1.awsapprunner.com

# Amplify
AWS_AMPLIFY_APP_ID=xxxxx
PRODUCTION_NEXTAUTH_URL=https://main.xxxxx.amplifyapp.com

# Database
PRODUCTION_DATABASE_URL=postgresql://artspot_admin:...

# Application
NEXTAUTH_SECRET=<from-secrets-manager>
CLOUDINARY_CLOUD_NAME=doqecw19f
```

## Step 7: Database Migrations

### 7.1 Run Initial Migration

```bash
# Connect to your database
export DATABASE_URL="postgresql://artspot_admin:PASSWORD@artspot-db-dev.cpgo2ia2wuo1.ap-southeast-2.rds.amazonaws.com:5432/postgres?schema=public&sslmode=require"

# Run migrations
cd apps/api
pnpm prisma migrate deploy
```

## Step 8: Monitoring & Alerts

### 8.1 Set Up CloudWatch Alarms

```bash
# API health check alarm
aws cloudwatch put-metric-alarm \
  --alarm-name artspot-api-health \
  --alarm-description "Alert when API is unhealthy" \
  --metric-name HealthCheckStatus \
  --namespace AWS/AppRunner \
  --statistic Average \
  --period 300 \
  --threshold 1 \
  --comparison-operator LessThanThreshold \
  --evaluation-periods 2

# RDS CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name artspot-db-cpu-high \
  --alarm-description "Alert when RDS CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

### 8.2 Enable X-Ray Tracing

```bash
# Enable X-Ray for App Runner
aws apprunner update-service \
  --service-arn "arn:aws:apprunner:..." \
  --observability-configuration '{
    "Enabled": true
  }'
```

## Step 9: Security Hardening

### 9.1 Configure WAF

```bash
# Create WAF web ACL
aws wafv2 create-web-acl \
  --name artspot-waf \
  --scope CLOUDFRONT \
  --default-action Allow={} \
  --rules file://waf-rules.json
```

### 9.2 Enable Shield Standard (Free)

Shield Standard is automatically enabled for CloudFront distributions.

### 9.3 Configure Security Groups

```bash
# Allow App Runner to access RDS
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 5432 \
  --source-group sg-apprunner

# Allow App Runner to access ElastiCache
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 6379 \
  --source-group sg-apprunner
```

## Step 10: Testing

### 10.1 Test API

```bash
curl https://xxxxx.us-east-1.awsapprunner.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "ArtSpot API is running",
  "timestamp": "2026-02-14T...",
  "environment": "production"
}
```

### 10.2 Test Frontend

Visit: `https://main.xxxxx.amplifyapp.com`

### 10.3 Test CMS

Visit: `https://xxxxx.us-east-1.awsapprunner.com/admin`

## Staging Environment

Repeat steps 4-6 with:
- Different App Runner services (`artspot-api-staging`, `artspot-cms-staging`)
- Different Amplify branch (`develop`)
- Different environment variables
- Same RDS database (different schema or database)

## Rollback Procedure

### App Runner
```bash
# List deployments
aws apprunner list-operations --service-arn "arn:aws:apprunner:..."

# Rollback to previous deployment
aws apprunner start-deployment \
  --service-arn "arn:aws:apprunner:..." \
  --source-version "PREVIOUS_COMMIT_SHA"
```

### Amplify
1. Go to Amplify Console
2. Click on the failed build
3. Click "Redeploy this version" on a previous successful build

## Cost Optimization Tips

1. **Use Reserved Instances** for RDS (40% savings)
2. **Enable S3 Intelligent Tiering** for automatic cost optimization
3. **Set up CloudWatch cost alerts** to monitor spending
4. **Use Auto Scaling** to scale down during low traffic
5. **Archive old logs** to S3 after 30 days

## Troubleshooting

### App Runner not starting
- Check CloudWatch logs: `/aws/apprunner/artspot-api-production/application`
- Verify environment variables are set correctly
- Check database connectivity from App Runner VPC

### Amplify build failing
- Check build logs in Amplify Console
- Verify Node.js version matches local (20.x)
- Check environment variables are set

### Database connection issues
- Verify security group allows App Runner
- Check DATABASE_URL format
- Ensure RDS is in the same region as App Runner

## Support

For AWS support issues:
- AWS Support Console: https://console.aws.amazon.com/support
- AWS Documentation: https://docs.aws.amazon.com/
- Community: https://repost.aws/

---

**Next Steps:**
1. Update GitHub Actions workflows (see `.github/workflows/`)
2. Test staging deployment
3. Test production deployment
4. Set up monitoring and alerts
5. Configure custom domain
