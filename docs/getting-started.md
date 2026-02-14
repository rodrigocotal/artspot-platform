# Getting Started with ArtSpot Platform

## Prerequisites

- Node.js 18+ and pnpm 8+
- PostgreSQL 14+
- Git

## Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/rodrigocotal/artspot-platform.git
   cd artspot-platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create `.env` files in each app directory:

   **apps/web/.env.local**
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   ```

   **apps/api/.env**
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/artspot
   JWT_SECRET=your-jwt-secret
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   SENDGRID_API_KEY=your-sendgrid-key
   ```

4. **Set up the database**
   ```bash
   cd apps/api
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start development servers**
   ```bash
   # From root directory
   pnpm dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - API: http://localhost:4000
   - CMS: http://localhost:1337 (when configured)

## Project Structure

```
artspot-platform/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # Express.js backend
│   └── cms/          # Strapi CMS
├── packages/
│   ├── ui/           # Shared UI components
│   ├── types/        # TypeScript types
│   ├── utils/        # Utilities
│   └── config/       # Configuration
├── docs/             # Documentation
└── .github/          # CI/CD workflows
```

## Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with meaningful messages
4. Push and create a pull request
5. Wait for CI checks to pass
6. Request review
7. Merge to `develop` for staging deployment
8. Merge to `main` for production deployment

## Available Scripts

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps for production
- `pnpm lint` - Lint all code
- `pnpm test` - Run all tests
- `pnpm clean` - Clean all build artifacts

## Next Steps

- See [Architecture Documentation](./architecture.md)
- Review [GitHub Issues](https://github.com/rodrigocotal/artspot-platform/issues) for current tasks
- Check [Deployment Guide](./deployment.md) (to be created) for production deployment

## Support

For questions or issues, create a GitHub issue or contact the development team.
