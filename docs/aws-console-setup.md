# AWS Console Setup Guide

Complete step-by-step guide to set up ArtSpot infrastructure on AWS using the Console.

---

## Step 1: IAM User for Deployments

1. Go to **IAM Console** → **Users** → **Create user**
2. Username: `artspot-deploy`
3. Attach policies:
   - `AdministratorAccess-Amplify`
   - `AWSAppRunnerFullAccess`
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess`
   - `AmazonElastiCacheFullAccess`
   - `SecretsManagerReadWrite`
4. Create user → **Security credentials** → **Create access key**
5. Select "Application running outside AWS"
6. **Save these credentials:**
   ```
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=ap-southeast-2
   ```

---

## Step 2: AWS Secrets Manager

### Database Secret
1. **Secrets Manager** → **Store a new secret**
2. Type: **Other type of secret**
3. Key-value pairs:
   ```
   username: artspot_admin
   password: EXuABqxbXCetA0NbGurd
   host: artspot-db-dev.cpgo2ia2wuo1.ap-southeast-2.rds.amazonaws.com
   port: 5432
   database: postgres
   ```
4. Secret name: `artspot/database`

### JWT Secret
1. **Store a new secret** → **Other type of secret**
2. Key: `secret`, Value: (generate at https://generate-secret.vercel.app/32)
3. Secret name: `artspot/jwt-secret`

### NextAuth Secret
1. **Store a new secret** → **Other type of secret**
2. Key: `secret`, Value: (generate random string)
3. Secret name: `artspot/nextauth-secret`

---

## Step 3: ElastiCache Redis

### Create Subnet Group
1. **ElastiCache Console** → **Subnet groups** → **Create**
2. Name: `artspot-redis-subnet`
3. VPC: Select default VPC
4. Select all available subnets
5. Create

### Create Redis Cluster
1. **Redis clusters** → **Create**
2. Cluster mode: **Disabled**
3. Name: `artspot-redis`
4. Node type: `cache.t4g.micro`
5. Number of replicas: **0**
6. Subnet group: `artspot-redis-subnet`
7. Security groups: default
8. Disable automatic backups
9. Create

### Get Endpoint
- Wait for **Available** status
- Copy **Primary endpoint**: `artspot-redis.xxxxx.0001.use1.cache.amazonaws.com:6379`
- **Save as:** `REDIS_URL=redis://artspot-redis.xxxxx.0001.use1.cache.amazonaws.com:6379`

---

## Step 4: S3 + CloudFront

### Create S3 Bucket
1. **S3 Console** → **Create bucket**
2. Name: `artspot-images-production` (globally unique)
3. Region: `ap-southeast-2`
4. Uncheck "Block all public access"
5. Enable **Bucket Versioning**
6. Create bucket

### Bucket Policy
1. Bucket → **Permissions** → **Bucket policy** → Edit
2. Paste (replace bucket name):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "PublicRead",
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::artspot-images-production/*"
     }]
   }
   ```

### Enable CORS
1. **Permissions** → **CORS** → Edit
2. Paste:
   ```json
   [{
     "AllowedHeaders": ["*"],
     "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
     "AllowedOrigins": ["*"],
     "ExposeHeaders": ["ETag"]
   }]
   ```

### Create CloudFront Distribution
1. **CloudFront Console** → **Create distribution**
2. Origin domain: Select your S3 bucket
3. Origin access: Legacy access identities → Create new OAI
4. Bucket policy: Yes, update
5. Viewer protocol: Redirect HTTP to HTTPS
6. Allowed methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
7. Cache policy: CachingOptimized
8. Create distribution
9. **Wait 10-15 minutes** for deployment
10. **Save:** `CLOUDFRONT_URL=https://d111111abcdef8.cloudfront.net`

---

## Step 5: App Runner - API (Production)

### Create GitHub Connection (First Time Only)
1. **App Runner Console** → **Create service**
2. Source: **Source code repository**
3. Click **Add new** connection
4. Name: `artspot-github`
5. Provider: **GitHub**
6. Authorize AWS → Select `artspot-platform` repo
7. Install

### Configure API Service
1. Repository: `rodrigocotal/artspot-platform`
2. Branch: `main`
3. Next

**Build configuration:**
- Runtime: `Node.js 18`
- Build command:
  ```bash
  cd apps/api && npx pnpm@8.15.0 install --frozen-lockfile && npx pnpm@8.15.0 prisma:generate && npx pnpm@8.15.0 build
  ```
- Start command:
  ```bash
  node apps/api/dist/index.js
  ```
- Port: `4000`

**Service settings:**
- Name: `artspot-api-production`
- CPU: `1 vCPU`
- Memory: `2 GB`
- Auto deployments: **Enabled**

**Environment variables:**
```
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://artspot_admin:EXuABqxbXCetA0NbGurd@artspot-db-dev.cpgo2ia2wuo1.ap-southeast-2.rds.amazonaws.com:5432/artspot-db-dev?schema=public&sslmode=require
REDIS_URL=redis://clustercfg.artspot-redis.uiabmv.apse2.cache.amazonaws.com:6379
JWT_SECRET=<from-secrets-manager>
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=doqecw19f
CLOUDINARY_API_KEY=288382122493568
CLOUDINARY_API_SECRET=yWa5TGiauYx4HeBxTYbHGuN84CQ
ALLOWED_ORIGINS=*
```

**Create & deploy** → Wait 5-10 minutes

**Save:**
- URL: `https://xxxxx.us-east-1.awsapprunner.com`
- ARN: `arn:aws:apprunner:us-east-1:ACCOUNT:service/artspot-api-production/xxxxx`

---

## Step 6: App Runner - API (Staging)

Repeat Step 5 with:
- Service name: `artspot-api-staging`
- Branch: `develop`
- Same environment variables

**Save:**
- URL: `https://yyyyy.us-east-1.awsapprunner.com`
- ARN: `arn:aws:apprunner:us-east-1:ACCOUNT:service/artspot-api-staging/yyyyy`

---

## Step 7: App Runner - CMS (Production)

1. **App Runner** → **Create service**
2. Source: **Source code repository**
3. Connection: Select `artspot-github`
4. Repository: `rodrigocotal/artspot-platform`
5. Branch: `main`

**Build configuration:**
- Runtime: `Node.js 18`
- Build command:
  ```bash
  cd apps/cms && npx pnpm@8.15.0 install --frozen-lockfile && npx pnpm@8.15.0 build
  ```
- Start command:
  ```bash
  npx pnpm@8.15.0 --filter @artspot/cms start
  ```
- Port: `1337`
- Source Directory: `/` (root)

**Service settings:**
- Name: `artspot-cms-production`
- CPU: `1 vCPU`
- Memory: `2 GB`

**Environment variables:**
```
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
APP_KEYS=Q9XuuPVMOV22zm893hy6v+VxgTqV/IOCc/V1xmRuBbk=,sb7zLBqC42jNzPE1UkuZ35Bw7dTCuixEG/tj1E8LczM=
API_TOKEN_SALT=+46uBNvimb/fPFU3QHDr45/KKRiSJqyujYPs7di384Q=
ADMIN_JWT_SECRET=LCuuVQDgVmfQI4jdTBEQBASQsLXgfiLHioYFp9RRq+g=
TRANSFER_TOKEN_SALT=i7rdLH9Ece751XXGUKskTV41mfOVCfmkMVHkQJ8myjk=
JWT_SECRET=uvPGt2kO4bWCZunmWYZTBZ/fgTaSGHW0BWW2hlY8z/E=
DATABASE_CLIENT=postgres
DATABASE_HOST=artspot-db-dev.cpgo2ia2wuo1.ap-southeast-2.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=artspot-db-dev
DATABASE_USERNAME=artspot_admin
DATABASE_PASSWORD=EXuABqxbXCetA0NbGurd
DATABASE_SSL=true
DATABASE_SCHEMA=strapi
CLOUDINARY_NAME=doqecw19f
CLOUDINARY_KEY=288382122493568
CLOUDINARY_SECRET=yWa5TGiauYx4HeBxTYbHGuN84CQ
```

**Create & deploy**

**Save:**
- URL: `https://zzzzz.us-east-1.awsapprunner.com`
- ARN: `arn:aws:apprunner:us-east-1:ACCOUNT:service/artspot-cms-production/zzzzz`

---

## Step 8: App Runner - CMS (Staging)

Repeat Step 7 with:
- Service name: `artspot-cms-staging`
- Branch: `develop`

**Save:**
- URL: `https://wwwww.us-east-1.awsapprunner.com`
- ARN: `arn:aws:apprunner:us-east-1:ACCOUNT:service/artspot-cms-staging/wwwww`

---

## Step 9: AWS Amplify

### Create Amplify App
1. **Amplify Console** → **New app** → **Host web app**
2. Provider: **GitHub**
3. Authorize AWS Amplify
4. Repository: `rodrigocotal/artspot-platform`
5. Branch: `main`
6. Next

### Configure Build
App name: `artspot-web`

The `amplify.yml` in your repo will be auto-detected.

**Environment variables:**
```
NEXT_PUBLIC_API_URL=https://xxxxx.us-east-1.awsapprunner.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=doqecw19f
NEXTAUTH_URL=https://main.xxxxx.amplifyapp.com
NEXTAUTH_SECRET=<from-secrets-manager>
```

**Save and deploy** → Wait 5-10 minutes

### Add Staging Branch
1. Click app → **Connect branch**
2. Branch: `develop`
3. Environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://yyyyy.us-east-1.awsapprunner.com
   NEXTAUTH_URL=https://develop.xxxxx.amplifyapp.com
   ```
4. Save and deploy

**Save:**
- App ID: `xxxxxxxxxxxxx`
- Production URL: `https://main.xxxxx.amplifyapp.com`
- Staging URL: `https://develop.xxxxx.amplifyapp.com`

---

## Step 10: GitHub Secrets

**GitHub repo** → **Settings** → **Secrets and variables** → **Actions**

Add each secret:

### AWS Credentials
```
AWS_ACCESS_KEY_ID=<from-step-1>
AWS_SECRET_ACCESS_KEY=<from-step-1>
AWS_REGION=ap-southeast-2
```

### Amplify
```
AWS_AMPLIFY_APP_ID=<from-step-9>
```

### Production
```
AWS_APPRUNNER_API_PRODUCTION_ARN=<from-step-5>
AWS_APPRUNNER_CMS_PRODUCTION_ARN=<from-step-7>
PRODUCTION_API_URL=<from-step-5>
PRODUCTION_CMS_URL=<from-step-7>
PRODUCTION_NEXTAUTH_URL=<from-step-9>
PRODUCTION_DATABASE_URL=postgresql://artspot_admin:EXuABqxbXCetA0NbGurd@artspot-db-dev.cpgo2ia2wuo1.ap-southeast-2.rds.amazonaws.com:5432/postgres?schema=public&sslmode=require
```

### Staging
```
AWS_APPRUNNER_API_STAGING_ARN=<from-step-6>
AWS_APPRUNNER_CMS_STAGING_ARN=<from-step-8>
STAGING_API_URL=<from-step-6>
STAGING_CMS_URL=<from-step-8>
STAGING_NEXTAUTH_URL=<from-step-9>
```

### Application
```
NEXTAUTH_SECRET=<from-step-2>
CLOUDINARY_CLOUD_NAME=doqecw19f
```

---

## Step 11: Test Everything

### Test API
```
curl https://xxxxx.us-east-1.awsapprunner.com/health
```
Should return: `{"success":true,"message":"ArtSpot API is running"}`

### Test CMS
Visit: `https://zzzzz.us-east-1.awsapprunner.com/admin`

### Test Frontend
Visit: `https://main.xxxxx.amplifyapp.com`

---

## Step 12: Trigger Deployment

1. Make a small change to any file
2. Commit and push to `main`
3. Go to **GitHub Actions** tab
4. Watch workflows run:
   - ✅ PR Checks
   - ✅ Deploy to Production (AWS)

---

## Troubleshooting

**App Runner fails:**
- Check logs in App Runner console
- Verify environment variables
- Check Node.js version is 18

**Amplify fails:**
- Check build logs
- Verify `amplify.yml` exists
- Check environment variables

**API health check fails:**
- Verify DATABASE_URL
- Check security groups
- Check RDS is accessible

---

## Cost Summary

| Service | Monthly Cost |
|---------|-------------|
| AWS Amplify | ~$15 |
| App Runner (API) | $25-50 |
| App Runner (CMS) | $25-50 |
| ElastiCache Redis | $15 |
| S3 + CloudFront | $5-10 |
| RDS PostgreSQL | Existing |
| **Total** | **$85-140** |

---

## Next Steps

1. ✅ Set up custom domain
2. ✅ Configure SSL certificates
3. ✅ Set up CloudWatch alarms
4. ✅ Enable AWS X-Ray tracing
5. ✅ Review security groups
