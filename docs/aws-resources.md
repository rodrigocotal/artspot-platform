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

## ⏳ Step 1: IAM User

**Status:** PENDING

**Username:** artspot-deploy

**Permissions needed:**
- AdministratorAccess-Amplify
- AWSAppRunnerFullAccess
- AmazonS3FullAccess
- CloudFrontFullAccess
- AmazonElastiCacheFullAccess
- SecretsManagerReadWrite

**Save when complete:**
```bash
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-southeast-2
```

---

## ⏳ Step 2: AWS Secrets Manager

**Status:** PENDING

**Secrets to create:**

### artspot/database
```json
{
  "username": "artspot_admin",
  "password": "EXuABqxbXCetA0NbGurd",
  "host": "artspot-db-dev.cpgo2ia2wuo1.ap-southeast-2.rds.amazonaws.com",
  "port": 5432,
  "database": "postgres"
}
```

### artspot/jwt-secret
```json
{
  "secret": "<generate-random>"
}
```

### artspot/nextauth-secret
```json
{
  "secret": "<generate-random>"
}
```

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

## ⏳ Step 6: App Runner - API (Staging)

**Status:** PENDING

**Service Name:** artspot-api-staging
**Branch:** develop

**Save when complete:**
```bash
STAGING_API_URL=
AWS_APPRUNNER_API_STAGING_ARN=
```

---

## ⏳ Step 7: App Runner - CMS (Production)

**Status:** PENDING

**Service Name:** artspot-cms-production
**Branch:** main

**Environment Variables:**
```bash
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
APP_KEYS=artspot-dev-key-1,artspot-dev-key-2
API_TOKEN_SALT=artspot-api-token-salt
ADMIN_JWT_SECRET=artspot-admin-jwt-secret
TRANSFER_TOKEN_SALT=artspot-transfer-token-salt
JWT_SECRET=artspot-jwt-secret
DATABASE_CLIENT=postgres
DATABASE_HOST=artspot-db-dev.cpgo2ia2wuo1.ap-southeast-2.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=artspot_admin
DATABASE_PASSWORD=EXuABqxbXCetA0NbGurd
DATABASE_SSL=true
DATABASE_SCHEMA=strapi
CLOUDINARY_NAME=doqecw19f
CLOUDINARY_KEY=288382122493568
CLOUDINARY_SECRET=yWa5TGiauYx4HeBxTYbHGuN84CQ
```

**Save when complete:**
```bash
PRODUCTION_CMS_URL=
AWS_APPRUNNER_CMS_PRODUCTION_ARN=
```

---

## ⏳ Step 8: App Runner - CMS (Staging)

**Status:** PENDING

**Service Name:** artspot-cms-staging
**Branch:** develop

**Save when complete:**
```bash
STAGING_CMS_URL=
AWS_APPRUNNER_CMS_STAGING_ARN=
```

---

## ⏳ Step 9: AWS Amplify

**Status:** PENDING

**App Name:** artspot-web
**Repository:** rodrigocotal/artspot-platform

**Branches:**
- main (production)
- develop (staging)

**Production Environment Variables:**
```bash
NEXT_PUBLIC_API_URL=<from-app-runner-api-production>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=doqecw19f
NEXTAUTH_URL=<will-be-amplify-url>
NEXTAUTH_SECRET=<from-secrets-manager>
```

**Save when complete:**
```bash
AWS_AMPLIFY_APP_ID=
PRODUCTION_NEXTAUTH_URL=
STAGING_NEXTAUTH_URL=
```

---

## Progress Tracker

- [x] ElastiCache Redis
- [ ] IAM User
- [ ] Secrets Manager
- [x] S3 + CloudFront
- [x] App Runner (API - Production)
- [ ] App Runner (API - Staging)
- [ ] App Runner (CMS - Production)
- [ ] App Runner (CMS - Staging)
- [ ] AWS Amplify
- [ ] GitHub Secrets

**Completion:** 3/10 steps 🚀

---

## Notes

- Using ap-southeast-2 (Sydney) region to be close to existing RDS database
- Redis cluster is in the same region as RDS for low latency
- All App Runner services should be deployed to ap-southeast-2
