# AWS Resources - ArtSpot

This file tracks all AWS resources and their configurations for the ArtSpot platform.

## Region
- **Primary Region:** ap-southeast-2 (Sydney)

---

## ✅ Step 3: ElastiCache Redis

**Status:** COMPLETED ✅

**Cluster Name:** artspot-redis
**Endpoint:** `clustercfg.artspot-redis.uiabmv.apse2.cache.amazonaws.com:6379`

**Environment Variable:**
```bash
REDIS_URL=redis://clustercfg.artspot-redis.uiabmv.apse2.cache.amazonaws.com:6379
```

**Notes:**
- Region: ap-southeast-2 (Sydney)
- Node type: cache.t4g.micro
- Used for: Session management, Bull queues, API caching

---

## ✅ Step 1: IAM User

**Status:** COMPLETED ✅

**Username:** artspot-github-actions

**Permissions attached:**
- AdministratorAccess-Amplify
- AWSAppRunnerFullAccess
- AmazonS3FullAccess

**Environment Variables:**
```bash
AWS_ACCESS_KEY_ID=<configured-in-github-secrets>
AWS_SECRET_ACCESS_KEY=<configured-in-github-secrets>
AWS_REGION=ap-southeast-2
```

**Notes:**
- Used for GitHub Actions automated deployments
- Access keys stored securely in GitHub Secrets
- Programmatic access only (no console access)

---

## ⏸️ Step 2: AWS Secrets Manager

**Status:** DEFERRED (Future Enhancement)

**Note:** Currently using environment variables for credential management, which is secure and working well. Secrets Manager implementation tracked in **Issue #34**.

**Benefits when implemented:**
- Enhanced security with KMS encryption
- Automatic secret rotation
- Centralized credential management
- Audit logging

**See:** [Issue #34 - Implement AWS Secrets Manager](https://github.com/rodrigocotal/artspot-platform/issues/34)

---

## ✅ Step 4: S3 + CloudFront

**Status:** COMPLETED ✅

**S3 Bucket:**
- Name: `artspot-images-production`
- Region: ap-southeast-2

**CloudFront Distribution:**
- Domain: `d1wl8z2nagsf9o.cloudfront.net`

**Environment Variable:**
```bash
CLOUDFRONT_URL=https://d1wl8z2nagsf9o.cloudfront.net
S3_BUCKET=artspot-images-production
```

**Notes:**
- CloudFront edge locations globally distributed
- SSL/TLS enabled by default
- Used for: Image and document delivery

---

## ✅ Step 5: App Runner - API (Production)

**Status:** COMPLETED ✅

**Service Name:** artspot-api-production
**Branch:** main
**Region:** ap-southeast-2

**Service URL:** https://sprbj7w893.ap-southeast-2.awsapprunner.com

**Environment Variables:**
```bash
PRODUCTION_API_URL=https://sprbj7w893.ap-southeast-2.awsapprunner.com
AWS_APPRUNNER_API_PRODUCTION_ARN=arn:aws:apprunner:ap-southeast-2:357559222118:service/artspot-api-production/f76b49f1090f4921beebe0064c5c5130
```

**Build Configuration:**
- Build: `cd apps/api && npx pnpm@8.15.0 install --frozen-lockfile && npx pnpm@8.15.0 prisma:generate && npx pnpm@8.15.0 build`
- Start: `node apps/api/dist/index.js`
- Port: 4000

**Notes:**
- Auto-deploy enabled from main branch
- Connected to RDS PostgreSQL and ElastiCache Redis
- Health endpoint: /health

---

## ✅ Step 6: App Runner - API (Staging)

**Status:** COMPLETED ✅

**Service Name:** artspot-api-development
**Branch:** develop
**Region:** ap-southeast-2

**Service URL:** https://vzpregb2dy.ap-southeast-2.awsapprunner.com

**Environment Variables:**
```bash
STAGING_API_URL=https://vzpregb2dy.ap-southeast-2.awsapprunner.com
AWS_APPRUNNER_API_STAGING_ARN=arn:aws:apprunner:ap-southeast-2:357559222118:service/artspot-api-development/1d861a278cea4e3baf1e6857fe1ea77e
```

**Build Configuration:**
- Build: `cd apps/api && npx pnpm@8.15.0 install --frozen-lockfile && npx pnpm@8.15.0 prisma:generate && npx pnpm@8.15.0 build`
- Start: `node apps/api/dist/index.js`
- Port: 4000

**Notes:**
- Auto-deploy enabled from develop branch
- Connected to RDS PostgreSQL and ElastiCache Redis
- Health endpoint: /health

---

## ✅ Step 7: App Runner - CMS (Production)

**Status:** COMPLETED ✅

**Service Name:** artspot-cms-production
**Branch:** main
**Region:** ap-southeast-2

**Service URL:** https://rwaxtjdazy.ap-southeast-2.awsapprunner.com

**Environment Variables:**
```bash
PRODUCTION_CMS_URL=https://rwaxtjdazy.ap-southeast-2.awsapprunner.com
AWS_APPRUNNER_CMS_PRODUCTION_ARN=arn:aws:apprunner:ap-southeast-2:357559222118:service/artspot-cms-production/17d247ef33dd43f9bb25a1af86cbc826
```

**Build Configuration:**
- Build: `cd apps/cms && npx pnpm@8.15.0 install --frozen-lockfile && npx pnpm@8.15.0 build`
- Start: `cd apps/cms && npx pnpm@8.15.0 start`
- Port: 1337

**Notes:**
- Auto-deploy enabled from main branch
- Connected to RDS PostgreSQL (schema: strapi)
- Strapi Admin: /admin
- Health endpoint: /_health
- Uses production-grade security keys

---

## ✅ Step 8: App Runner - CMS (Staging)

**Status:** COMPLETED ✅

**Service Name:** artspot-cms-staging
**Branch:** develop
**Region:** ap-southeast-2

**Service URL:** https://p6ynpume2f.ap-southeast-2.awsapprunner.com

**Environment Variables:**
```bash
STAGING_CMS_URL=https://p6ynpume2f.ap-southeast-2.awsapprunner.com
AWS_APPRUNNER_CMS_STAGING_ARN=arn:aws:apprunner:ap-southeast-2:357559222118:service/artspot-cms-staging/ee7244783ceb41fc8bedd8a46ceac8af
```

**Build Configuration:**
- Build: `cd apps/cms && npx pnpm@8.15.0 install --frozen-lockfile && npx pnpm@8.15.0 build`
- Start: `cd apps/cms && npx pnpm@8.15.0 start`
- Port: 1337

**Notes:**
- Auto-deploy enabled from develop branch
- Connected to RDS PostgreSQL (schema: strapi)
- Same configuration as production, different branch

---

## ✅ Step 9: AWS Amplify

**Status:** COMPLETED ✅

**App Name:** artspot-web
**App ID:** d33bfmlx9m4rwh
**Repository:** rodrigocotal/artspot-platform
**Region:** ap-southeast-2

**Production URL:** https://main.d33bfmlx9m4rwh.amplifyapp.com
**Staging URL:** https://develop.d33bfmlx9m4rwh.amplifyapp.com

**Environment Variables:**
```bash
AWS_AMPLIFY_APP_ID=d33bfmlx9m4rwh
PRODUCTION_NEXTAUTH_URL=https://main.d33bfmlx9m4rwh.amplifyapp.com
STAGING_NEXTAUTH_URL=https://develop.d33bfmlx9m4rwh.amplifyapp.com
NEXTAUTH_SECRET=xh5rGDWQ6dfb/yjRCnSDyu/cmUEEX96s0YeYQXAEYgw=
```

**Configuration:**
- **All branches:**
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=doqecw19f`
  - `NEXTAUTH_SECRET=xh5rGDWQ6dfb/yjRCnSDyu/cmUEEX96s0YeYQXAEYgw=`

- **main branch:**
  - `NEXT_PUBLIC_API_URL=https://sprbj7w893.ap-southeast-2.awsapprunner.com`
  - `NEXTAUTH_URL=https://main.d33bfmlx9m4rwh.amplifyapp.com`

- **develop branch:**
  - `NEXT_PUBLIC_API_URL=https://vzpregb2dy.ap-southeast-2.awsapprunner.com`
  - `NEXTAUTH_URL=https://develop.d33bfmlx9m4rwh.amplifyapp.com`

**Notes:**
- Auto-deploy enabled from both main and develop branches
- Build configuration from `amplify.yml` in repository
- CloudFront CDN automatically configured
- SSL/TLS certificates automatically provisioned

---

## ✅ Step 10: GitHub Secrets

**Status:** COMPLETED ✅

**Repository:** rodrigocotal/artspot-platform

**Configured Secrets (18 total):**

### AWS Credentials
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (ap-southeast-2)

### AWS Services
- `AWS_AMPLIFY_APP_ID`
- `AWS_APPRUNNER_API_PRODUCTION_ARN`
- `AWS_APPRUNNER_API_STAGING_ARN`
- `AWS_APPRUNNER_CMS_PRODUCTION_ARN`
- `AWS_APPRUNNER_CMS_STAGING_ARN`

### Service URLs
- `PRODUCTION_API_URL`
- `PRODUCTION_CMS_URL`
- `STAGING_API_URL`
- `STAGING_CMS_URL`

### Database & Application
- `PRODUCTION_DATABASE_URL`
- `NEXTAUTH_SECRET`
- `CLOUDINARY_CLOUD_NAME`

**GitHub Actions Workflows:**
- ✅ `pr-checks.yml` - Runs on pull requests
- ✅ `deploy-staging.yml` - Deploys to staging on push to `develop`
- ✅ `deploy-production.yml` - Deploys to production on push to `main`

**Notes:**
- All secrets configured in GitHub repository settings
- Workflows use IAM user credentials for AWS authentication
- Automated deployments enabled for both staging and production

---

## Progress Tracker

- [x] ElastiCache Redis
- [x] IAM User
- [ ] Secrets Manager (Optional)
- [x] S3 + CloudFront
- [x] App Runner (API - Production)
- [x] App Runner (API - Staging)
- [x] App Runner (CMS - Production)
- [x] App Runner (CMS - Staging)
- [x] AWS Amplify
- [x] GitHub Secrets

**Completion:** 9/10 steps 🎉 (Secrets Manager is optional)

---

## Notes

- Using ap-southeast-2 (Sydney) region to be close to existing RDS database
- Redis cluster is in the same region as RDS for low latency
- All App Runner services should be deployed to ap-southeast-2

---

## 🎉 Infrastructure Complete!

**Date Completed:** February 15, 2026
**Issue:** [#8 - Deploy to AWS](https://github.com/rodrigocotal/artspot-platform/issues/8) ✅ CLOSED

**Future Enhancements:**
- [#33 - Security: Restrict RDS access using App Runner VPC Connector](https://github.com/rodrigocotal/artspot-platform/issues/33)
- [#34 - Enhancement: Implement AWS Secrets Manager](https://github.com/rodrigocotal/artspot-platform/issues/34)

**Platform Status:** Production-ready and fully operational! 🚀
