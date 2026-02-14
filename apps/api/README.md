# ArtSpot API

Express.js REST API for the ArtSpot premium art marketplace.

## Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Security**: Helmet, CORS
- **Logging**: Morgan

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (especially `DATABASE_URL`).

3. **Set up database** (requires PostgreSQL running):
   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   ```

4. **Run development server**:
   ```bash
   pnpm dev
   ```

5. **Test the API**:
   ```bash
   curl http://localhost:4000/health
   ```

## Project Structure

```
apps/api/
├── src/
│   ├── config/          # Configuration files
│   │   └── environment.ts
│   ├── routes/          # API routes
│   │   └── health.ts
│   ├── controllers/     # Route controllers
│   ├── services/        # Business logic
│   ├── middleware/      # Custom middleware
│   │   └── error-handler.ts
│   ├── utils/           # Utility functions
│   └── index.ts         # Express app entry
├── prisma/
│   └── schema.prisma    # Database schema
└── package.json
```

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm type-check` - Run TypeScript compiler check
- `pnpm lint` - Run ESLint
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio (database GUI)

## API Endpoints

### Health Check
- `GET /health` - Basic health check
- `GET /health/db` - Database connection check

### Future Endpoints (Phase 1)
- `/api/artworks` - Artwork management
- `/api/artists` - Artist profiles
- `/api/collections` - Curated collections
- `/api/auth` - Authentication
- `/api/inquiries` - Purchase inquiries

## Environment Variables

See `.env.example` for all available configuration options.

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 4000)
- `ALLOWED_ORIGINS` - CORS allowed origins

## Database Schema

Current schema includes:
- **User** - User accounts with roles (COLLECTOR, GALLERY_STAFF, ADMIN)

Future models (Sprint 3+):
- Artist
- Artwork
- Collection
- Inquiry
- Favorite/Wishlist

## Security Features

- **Helmet**: Security headers
- **CORS**: Configurable cross-origin requests
- **Input Validation**: Zod schemas (to be implemented)
- **Error Handling**: Centralized error handler

## Development

### Adding a New Route

1. Create route file in `src/routes/`
2. Create controller in `src/controllers/`
3. Add business logic in `src/services/`
4. Import and use in `src/index.ts`

### Database Migrations

```bash
# Create migration
pnpm prisma:migrate

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## Testing

API testing will be implemented in Sprint 10 with Jest/Supertest.

## Next Steps

- Add authentication endpoints (Sprint 6)
- Implement artwork CRUD operations (Sprint 3)
- Add artist endpoints (Sprint 4)
- Set up email service integration (Sprint 8)
