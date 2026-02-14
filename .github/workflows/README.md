# GitHub Actions CI/CD Pipeline

This directory contains the CI/CD workflows for the ArtSpot platform deployed on AWS.

## Workflows

### 1. PR Checks (`pr-checks.yml`)
**Trigger:** Pull requests and pushes to `main` or `develop`

**Jobs:**
- **Lint & Type Check:** Runs ESLint and TypeScript type checking on all packages
- **Build:** Builds all packages to ensure no build errors
- **Security Scan:** Runs `pnpm audit` to check for security vulnerabilities
- **Prisma Generate:** Generates Prisma Client for type-checking

**Purpose:** Ensures code quality and prevents broken code from being merged.

---

### 2. Deploy to Staging (`deploy-staging.yml`)
**Trigger:** Push to `develop` branch

**Jobs:**
- **Deploy Web to AWS Amplify:** Deploys Next.js frontend to Amplify staging
- **Deploy API to AWS App Runner:** Deploys Express.js API to App Runner staging
- **Deploy CMS to AWS App Runner:** Deploys Strapi CMS to App Runner staging
- **Notify Deployment:** Checks all deployments succeeded

**Purpose:** Automatically deploys to AWS staging environment for testing.

---

### 3. Deploy to Production (`deploy-production.yml`)
**Trigger:** Push to `main` branch

**Jobs:**
- **Deploy Web to AWS Amplify:** Deploys Next.js frontend to Amplify production
- **Deploy API to AWS App Runner:** Deploys Express.js API to App Runner production
- **Deploy CMS to AWS App Runner:** Deploys Strapi CMS to App Runner production
- **Run Migrations:** Runs Prisma database migrations
- **Notify Deployment:** Checks all deployments succeeded

**Purpose:** Automatically deploys to AWS production after merge to main.

---

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`).

### AWS Credentials
- `AWS_ACCESS_KEY_ID` - AWS IAM user access key ID
- `AWS_SECRET_ACCESS_KEY` - AWS IAM user secret access key
- `AWS_REGION` - AWS region (e.g., `us-east-1`)

### AWS Amplify (Web Frontend)
- `AWS_AMPLIFY_APP_ID` - Amplify application ID

### AWS App Runner (API & CMS Backend)

**Staging:**
- `AWS_APPRUNNER_API_STAGING_ARN` - App Runner service ARN for staging API
- `AWS_APPRUNNER_CMS_STAGING_ARN` - App Runner service ARN for staging CMS

**Production:**
- `AWS_APPRUNNER_API_PRODUCTION_ARN` - App Runner service ARN for production API
- `AWS_APPRUNNER_CMS_PRODUCTION_ARN` - App Runner service ARN for production CMS

### Environment URLs

**Staging:**
- `STAGING_API_URL` - Staging API URL (e.g., `https://xxxxx.us-east-1.awsapprunner.com`)
- `STAGING_CMS_URL` - Staging CMS URL (e.g., `https://yyyyy.us-east-1.awsapprunner.com`)
- `STAGING_NEXTAUTH_URL` - Staging frontend URL (e.g., `https://develop.xxxxx.amplifyapp.com`)

**Production:**
- `PRODUCTION_API_URL` - Production API URL (e.g., `https://xxxxx.us-east-1.awsapprunner.com`)
- `PRODUCTION_CMS_URL` - Production CMS URL (e.g., `https://yyyyy.us-east-1.awsapprunner.com`)
- `PRODUCTION_NEXTAUTH_URL` - Production frontend URL (e.g., `https://main.xxxxx.amplifyapp.com` or custom domain)

### Database
- `PRODUCTION_DATABASE_URL` - PostgreSQL connection string for production (AWS RDS)

### Application Secrets
- `NEXTAUTH_SECRET` - NextAuth.js secret key (generate with `openssl rand -base64 32`)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name

---

## How to Set Up

### 1. Set Up AWS Services

**See the comprehensive [AWS Deployment Guide](../../docs/aws-deployment.md) for detailed instructions.**

Quick summary:
1. Create AWS account and IAM user with appropriate permissions
2. Set up AWS Amplify for frontend hosting
3. Create App Runner services for API and CMS
4. Configure ElastiCache Redis
5. Set up S3 + CloudFront for image storage
6. Configure secrets in AWS Secrets Manager

### 2. Get AWS Resource ARNs and URLs

```bash
# Get Amplify App ID
aws amplify list-apps --query 'apps[?name==`artspot-web`].appId' --output text

# Get App Runner Service ARNs
aws apprunner list-services --query 'ServiceSummaryList[?ServiceName==`artspot-api-production`].ServiceArn' --output text
aws apprunner list-services --query 'ServiceSummaryList[?ServiceName==`artspot-cms-production`].ServiceArn' --output text

# Get App Runner Service URLs
aws apprunner describe-service --service-arn <SERVICE_ARN> --query 'Service.ServiceUrl' --output text
```

### 3. Configure GitHub Secrets
1. Go to your GitHub repository
2. Navigate to **Settings > Secrets and variables > Actions**
3. Click **New repository secret**
4. Add all the secrets listed above

### 4. Create Environments (Optional but Recommended)
1. Go to **Settings > Environments**
2. Create environments: `staging-web`, `staging-api`, `staging-cms`, `production-web`, `production-api`, `production-cms`
3. For production environments, enable **Required reviewers** for manual approval before deployment

### 5. Test the Workflows
1. Create a feature branch: `git checkout -b feature/test-ci`
2. Make a small change and push
3. Create a pull request to `develop`
4. The PR checks workflow should run automatically
5. Merge the PR to `develop` to trigger staging deployment
6. Merge `develop` to `main` to trigger production deployment

---

## Workflow Status Badges

Add these to your main README.md:

```markdown
![PR Checks](https://github.com/rodrigocotal/artspot-platform/actions/workflows/pr-checks.yml/badge.svg)
![Deploy Staging](https://github.com/rodrigocotal/artspot-platform/actions/workflows/deploy-staging.yml/badge.svg)
![Deploy Production](https://github.com/rodrigocotal/artspot-platform/actions/workflows/deploy-production.yml/badge.svg)
```

---

## Troubleshooting

### PR Checks Failing
- Check the GitHub Actions logs for specific errors
- Ensure all packages have `lint`, `type-check`, and `build` scripts in package.json
- Verify that environment variables are properly configured

### Deployment Failing
- Verify all secrets are correctly set in GitHub
- Check Render/Vercel logs for deployment errors
- Ensure deploy hooks are correct and services are properly configured
- Test health check endpoints manually

### Migration Failures
- Ensure `DATABASE_URL` secret is correct
- Check that migrations are generated before deployment
- Verify database connectivity from production environment

---

## Security Notes

- Never commit secrets to the repository
- Use GitHub environments for sensitive deployments
- Enable branch protection rules on `main` and `develop`
- Require pull request reviews before merging
- Keep dependencies up to date with `pnpm update`
- Regularly rotate API tokens and secrets
