# ArtSpot Platform Architecture

## Overview

ArtSpot is a premium art marketplace built with a modern monorepo architecture using Next.js for the frontend and Node.js/Express for the backend.

## System Architecture

### High-Level Architecture

```
Users → Cloudflare CDN → Next.js (Vercel) → Node.js API (Railway) → PostgreSQL
                                ↓                      ↓
                           Strapi CMS              Redis Queue
                                ↓                      ↓
                           Cloudinary          External Services
                                              (Stripe, ShipStation)
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

**Infrastructure**
- Hosting: Vercel (frontend) + Railway (backend)
- CDN: Cloudflare
- Image Storage: Cloudinary
- Email: SendGrid
- Monitoring: Sentry

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

- Horizontal scaling via serverless (Vercel)
- Database connection pooling
- Background job processing with Bull
- CDN for static assets

## Deployment

- CI/CD via GitHub Actions
- Automated testing on PRs
- Staging environment for testing
- Production deployment on merge to main

## Monitoring & Observability

- Error tracking: Sentry
- Analytics: Google Analytics 4
- Performance monitoring: Vercel Analytics
- Uptime monitoring: TBD
