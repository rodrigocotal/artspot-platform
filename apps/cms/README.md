# ArtSpot CMS

Content Management System powered by Strapi for managing artworks, artists, and collections.

## Tech Stack

- **CMS**: Strapi v5
- **Database**: PostgreSQL (AWS RDS)
- **Upload Provider**: Cloudinary
- **Admin Port**: 1337

## Getting Started

1. **Install dependencies** (from root):
   ```bash
   pnpm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database and Cloudinary credentials.

3. **Run development server**:
   ```bash
   pnpm dev
   ```

4. **Access admin panel**:
   Visit [http://localhost:1337/admin](http://localhost:1337/admin)

## First Run

On first run, Strapi will:
1. Create database tables in the `strapi` schema
2. Prompt you to create an admin user
3. Open the admin panel

## Configuration

### Database
Uses the same AWS RDS PostgreSQL instance as the API:
- **Schema**: `strapi` (separate from main app schema `public`)
- **SSL**: Enabled and required

### File Uploads
- **Local**: Uploads to `public/uploads/` (development)
- **Cloudinary**: Configure credentials in `.env` for production

## Content Types (Future Sprints)

### Sprint 3: Artwork Management
- Artwork
- Artwork Image (media)

### Sprint 4: Artist Management
- Artist
- Artist Bio

### Sprint 5: Collections
- Collection
- Collection Items

### Sprint 9: Editorial
- Article
- Inspiration Post

## API Access

Strapi provides a REST and GraphQL API:
- **REST**: `http://localhost:1337/api`
- **GraphQL**: `http://localhost:1337/graphql` (if enabled)

## Admin Panel Features

- Content Type Builder
- Media Library
- User Management
- Roles & Permissions
- API Tokens
- Webhooks

## Syncing with Main App

Content created in Strapi can be:
1. Accessed via Strapi API
2. Synced to main PostgreSQL database via webhooks
3. Imported manually via scripts

## Scripts

- `pnpm dev` - Start development server
- `pnpm start` - Start production server
- `pnpm build` - Build for production
- `pnpm strapi` - Strapi CLI commands

## Deployment

### Staging/Production
1. Set production environment variables
2. Build the admin panel: `pnpm build`
3. Start server: `pnpm start`
4. Access on port 1337

## Security

- **Admin JWT**: Secure admin authentication
- **API Tokens**: For programmatic access
- **Roles & Permissions**: Fine-grained access control
- **HTTPS**: Use reverse proxy (nginx, Cloudflare)

## Cloudinary Setup

1. Create account at [Cloudinary](https://cloudinary.com)
2. Get credentials from dashboard
3. Add to `.env`:
   ```
   CLOUDINARY_NAME=your-cloud-name
   CLOUDINARY_KEY=your-api-key
   CLOUDINARY_SECRET=your-api-secret
   ```

## Troubleshooting

### Can't connect to database
- Check AWS RDS security group allows port 5432
- Verify DATABASE_* credentials in `.env`
- Ensure SSL is enabled

### Admin panel not loading
- Clear browser cache
- Rebuild admin: `pnpm build`
- Check console for errors

### File upload errors
- Check `public/uploads/` permissions
- Verify Cloudinary credentials
- Check file size limits in config

## Next Steps

1. Create admin user on first run
2. Build content types (Sprint 3+)
3. Configure upload provider (Cloudinary)
4. Set up webhooks to sync with main app
5. Configure API permissions
