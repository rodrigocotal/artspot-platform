# ArtSpot Platform Architecture

## Overview

ArtSpot is a premium art marketplace built with a modern monorepo architecture using Next.js for the frontend and Node.js/Express for the backend. The platform is deployed on AWS using a serverless-first approach for optimal cost-efficiency and scalability.

## System Architecture

### High-Level Architecture

```
Users → CloudFront CDN → Next.js (Amplify) → Node.js API (App Runner) → RDS PostgreSQL
              ↓                                        ↓
           WAF + Shield                          Strapi CMS (App Runner)
                                                       ↓
                                                  ElastiCache Redis
                                                       ↓
                                                   S3 + CloudFront
                                                       ↓
                                                External Services
                                              (Stripe, ShipStation, SES)
```

### Detailed AWS Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Users (Collectors)                    │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│              CloudFront CDN + WAF + Shield               │
└───────────────────┬─────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│   Next.js App    │    │   Strapi CMS     │
│   (Frontend)     │    │   (Content Mgmt) │
│                  │    │                  │
│  - AWS Amplify   │    │  - App Runner    │
│  - Auto-scaling  │    │  - Auto-scaling  │
└────────┬─────────┘    └────────┬─────────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌─────────────────────┐
         │   Node.js API        │
         │   (Express)          │
         │                      │
         │  - AWS App Runner    │
         │  - Auto-scaling      │
         │  - Health checks     │
         └──────────┬───────────┘
                    │
        ┌───────────┼───────────┬──────────────┐
        │           │           │              │
        ▼           ▼           ▼              ▼
   ┌────────┐  ┌────────┐  ┌────────┐  ┌──────────┐
   │  RDS   │  │ElastiC-│  │   S3   │  │ External │
   │Postgres│  │ ache   │  │ Images │  │ Services │
   │   DB   │  │ Redis  │  │  Docs  │  │          │
   └────────┘  └────────┘  └────────┘  └──────────┘
       │            │           │              │
       │            │           │    ┌─────────┼─────────┐
       ▼            ▼           ▼    ▼         ▼         ▼
   Multi-AZ    Encryption   Versioning  Stripe  Ship   AWS SES
   Backups     at rest      Lifecycle          Station  Email
```

### Technology Stack

**Frontend**
- Next.js 15 (App Router) with React 19
- Tailwind CSS for styling
- shadcn/ui component library
- Framer Motion for animations
- Zustand for state management
- React Query for server state

**Backend**
- Node.js with Express.js
- PostgreSQL with Prisma ORM
- JWT authentication
- Bull + Redis for background jobs

**AWS Infrastructure**
- **Hosting**: AWS Amplify (frontend) + App Runner (backend/CMS)
- **CDN**: CloudFront with WAF and Shield
- **Database**: RDS PostgreSQL (Multi-AZ, automated backups)
- **Cache**: ElastiCache Redis (for sessions and background jobs)
- **Storage**: S3 for images and documents
- **Email**: AWS SES for transactional emails
- **Monitoring**: CloudWatch + X-Ray
- **Secrets**: AWS Secrets Manager
- **CI/CD**: GitHub Actions → AWS

### Database Schema

See [Database Schema Documentation](./database-schema.md) (to be created)

## Security

- JWT-based authentication
- Role-based access control (RBAC)
- HTTPS only
- CORS protection
- Rate limiting
- Input validation with Zod

## Performance

- Image optimization with Cloudinary
- Code splitting and lazy loading
- Edge caching with Cloudflare
- Database query optimization with indexes

## Scalability

- **Auto-scaling**: Amplify and App Runner automatically scale based on traffic
- **Database**: RDS with read replicas for scaling read operations
- **Cache Layer**: ElastiCache Redis for session management and frequent queries
- **Background Jobs**: Bull queues with Redis for async task processing
- **CDN**: CloudFront global edge locations for fast content delivery
- **Connection Pooling**: Prisma connection pooling for efficient database access

## Deployment

### CI/CD Pipeline
- **CI/CD**: GitHub Actions
- **PR Checks**: Automated linting, type-checking, and build verification
- **Staging**: Auto-deploy to staging on merge to `develop` branch
- **Production**: Auto-deploy to production on merge to `main` branch
- **Database Migrations**: Automated Prisma migrations on deployment
- **Health Checks**: Post-deployment health verification

### Environments
- **Development**: Local development with Docker Compose
- **Staging**: AWS staging environment (separate App Runner services)
- **Production**: AWS production environment (separate VPC, Multi-AZ)

## AWS Resources

### Compute
- **AWS Amplify**: Next.js frontend hosting ($15/month)
- **App Runner (API)**: Node.js/Express API ($25-50/month)
- **App Runner (CMS)**: Strapi headless CMS ($25-50/month)

### Data & Storage
- **RDS PostgreSQL**: t3.micro/small with Multi-AZ (existing)
- **ElastiCache Redis**: t4g.micro for caching ($15/month)
- **S3**: Image and document storage ($5-10/month)
- **CloudFront**: Global CDN for S3 content (included)

### Networking & Security
- **VPC**: Isolated network for backend services
- **Security Groups**: Firewall rules for service communication
- **WAF**: Web Application Firewall for DDoS protection
- **Secrets Manager**: Secure credential storage

### Monitoring & Logging
- **CloudWatch**: Logs, metrics, and alarms
- **X-Ray**: Distributed tracing for API requests
- **CloudWatch Insights**: Log analysis and querying
- **SNS**: Alerts for critical issues

### Cost Optimization
- **Auto-scaling**: Pay only for what you use
- **Reserved Instances**: 40% savings for RDS (for production)
- **S3 Lifecycle Policies**: Archive old files to Glacier
- **CloudFront**: Reduces origin requests, lowers costs

### Estimated Monthly Cost
- **Phase 1 (MVP)**: $85-120/month
- **Phase 2 (with traffic)**: $150-250/month
- **Scale (10K+ users)**: $300-500/month

## Monitoring & Observability

- **Error Tracking**: AWS X-Ray + CloudWatch Insights
- **Application Monitoring**: CloudWatch Application Insights
- **Analytics**: Google Analytics 4
- **Performance**: CloudWatch RUM (Real User Monitoring)
- **Uptime Monitoring**: Route 53 health checks
- **Alerting**: CloudWatch Alarms → SNS → Email/Slack
