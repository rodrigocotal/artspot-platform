# GitHub Actions CI/CD Pipeline

This directory contains the CI/CD workflows for the ArtSpot platform.

## Workflows

### 1. PR Checks (`pr-checks.yml`)
**Trigger:** Pull requests and pushes to `main` or `develop`

**Jobs:**
- **Lint & Type Check:** Runs ESLint and TypeScript type checking on all packages
- **Build:** Builds all packages to ensure no build errors
- **Security Scan:** Runs `pnpm audit` to check for security vulnerabilities

**Purpose:** Ensures code quality and prevents broken code from being merged.

---

### 2. Deploy to Staging (`deploy-staging.yml`)
**Trigger:** Push to `develop` branch

**Jobs:**
- **Deploy Web to Vercel:** Deploys Next.js frontend to Vercel staging
- **Deploy API to Render:** Deploys Express.js API to Render staging
- **Deploy CMS to Render:** Deploys Strapi CMS to Render staging
- **Notify Deployment:** Checks all deployments succeeded

**Purpose:** Automatically deploys to staging environment for testing.

---

### 3. Deploy to Production (`deploy-production.yml`)
**Trigger:** Push to `main` branch

**Jobs:**
- **Deploy Web to Vercel:** Deploys Next.js frontend to Vercel production
- **Deploy API to Render:** Deploys Express.js API to Render production
- **Deploy CMS to Render:** Deploys Strapi CMS to Render production
- **Run Migrations:** Runs Prisma database migrations
- **Notify Deployment:** Checks all deployments succeeded

**Purpose:** Automatically deploys to production after merge to main.

---

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`).

### Vercel (Web Frontend)
- `VERCEL_TOKEN` - Vercel authentication token (get from Vercel dashboard)
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID for the web app

### Render (API & CMS Backend)
- `RENDER_DEPLOY_HOOK_STAGING_API` - Render deploy hook URL for staging API
- `RENDER_DEPLOY_HOOK_STAGING_CMS` - Render deploy hook URL for staging CMS
- `RENDER_DEPLOY_HOOK_PRODUCTION_API` - Render deploy hook URL for production API
- `RENDER_DEPLOY_HOOK_PRODUCTION_CMS` - Render deploy hook URL for production CMS

### Environment URLs
**Staging:**
- `STAGING_API_URL` - Staging API URL (e.g., `https://artspot-api-staging.onrender.com`)
- `STAGING_CMS_URL` - Staging CMS URL (e.g., `https://artspot-cms-staging.onrender.com`)
- `STAGING_NEXTAUTH_URL` - Staging frontend URL (e.g., `https://artspot-staging.vercel.app`)

**Production:**
- `PRODUCTION_API_URL` - Production API URL (e.g., `https://api.artspot.com`)
- `PRODUCTION_CMS_URL` - Production CMS URL (e.g., `https://cms.artspot.com`)
- `PRODUCTION_NEXTAUTH_URL` - Production frontend URL (e.g., `https://artspot.com`)

### Database
- `PRODUCTION_DATABASE_URL` - PostgreSQL connection string for production

### Application Secrets
- `NEXTAUTH_SECRET` - NextAuth.js secret key (generate with `openssl rand -base64 32`)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name

---

## How to Set Up

### 1. Create Vercel Project
```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
cd apps/web
vercel link

# Get project details
vercel project ls
```

The output will give you your `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`.

To get your `VERCEL_TOKEN`:
1. Go to https://vercel.com/account/tokens
2. Create a new token
3. Copy and save it as a GitHub secret

### 2. Create Render Services
1. Go to https://render.com
2. Create a new **Web Service** for the API:
   - Build Command: `cd apps/api && pnpm install && pnpm build`
   - Start Command: `cd apps/api && pnpm start`
   - Environment: Node
3. Create a new **Web Service** for the CMS:
   - Build Command: `cd apps/cms && pnpm install && pnpm build`
   - Start Command: `cd apps/cms && pnpm start`
   - Environment: Node
4. For each service, go to **Settings > Deploy Hook** and create a deploy hook
5. Copy the deploy hook URLs and save them as GitHub secrets

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
