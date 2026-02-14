# ArtSpot Database Documentation

## Database Provider

**PostgreSQL 14+** hosted on AWS RDS

## Connection Details

- **Host**: artspot-db-dev.cpgo2ia2wuo1.ap-southeast-2.rds.amazonaws.com
- **Port**: 5432
- **Database**: postgres
- **SSL Mode**: Required (AWS RDS enforces SSL)
- **Region**: ap-southeast-2 (Sydney)

## Current Schema (Phase 1 - Sprint 1)

### Users Table

Stores user accounts for collectors, gallery staff, and administrators.

```sql
CREATE TABLE "users" (
    "id" TEXT NOT NULL,                          -- CUID primary key
    "email" TEXT NOT NULL UNIQUE,                -- User email (unique)
    "name" TEXT,                                 -- User full name
    "role" "UserRole" NOT NULL DEFAULT 'COLLECTOR', -- User role
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
```

### UserRole Enum

```sql
CREATE TYPE "UserRole" AS ENUM (
    'COLLECTOR',      -- Standard user (default)
    'GALLERY_STAFF',  -- Gallery employee (manage inquiries, content)
    'ADMIN'           -- Full platform access
);
```

### Indexes

- `users_email_key` - Unique index on email field

## Prisma Client

### Setup

```bash
# Generate Prisma Client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Open Prisma Studio (database GUI)
pnpm prisma:studio
```

### Usage in Code

```typescript
import { prisma } from './config/database';

// Query users
const users = await prisma.user.findMany();

// Create user
const user = await prisma.user.create({
  data: {
    email: 'collector@example.com',
    name: 'Art Collector',
    role: 'COLLECTOR',
  },
});
```

## Future Schema Additions

### Sprint 3: Artwork Browsing
- **Artist** table
- **Artwork** table
- **ArtworkImage** table (one-to-many with Artwork)
- **Medium**, **Style**, **Period** enums or tables

### Sprint 5: Collections
- **Collection** table
- **CollectionArtwork** join table (many-to-many)

### Sprint 7: Wishlist
- **Favorite** table (user favorites/wishlist)

### Sprint 8: Inquiry System
- **Inquiry** table
- **InquiryMessage** table (conversation threading)

### Phase 2: E-Commerce
- **Order** table
- **OrderItem** table
- **Payment** table
- **ShippingAddress** table
- **Certificate** table (authenticity documents)

## Database Management

### Migrations

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (DEVELOPMENT ONLY - destroys data)
npx prisma migrate reset
```

### Backups

**AWS RDS Automated Backups:**
- Enabled by default
- Retention: 7 days (configurable)
- Point-in-time recovery available
- Manual snapshots can be created

**Manual Backup:**
```bash
pg_dump -h artspot-db-dev.cpgo2ia2wuo1.ap-southeast-2.rds.amazonaws.com \
  -U artspot_admin -d postgres > backup.sql
```

### Monitoring

**Health Check:**
```bash
curl http://localhost:4000/health/db
```

**Prisma Studio:**
```bash
pnpm prisma:studio
# Opens at http://localhost:5555
```

## Security

### AWS RDS Security
- ✅ SSL/TLS encryption enforced
- ✅ Security group configured (port 5432)
- ✅ IAM authentication available
- ✅ Automated backups enabled
- ✅ Encryption at rest (AWS managed keys)

### Application Security
- ✅ Connection pooling via Prisma
- ✅ Prepared statements (SQL injection prevention)
- ✅ Environment variables for credentials
- ✅ No credentials in source code

## Performance Optimization

### Indexes
- Primary keys on all tables (automatic)
- Unique index on `users.email`
- Future: Indexes on foreign keys, frequently queried fields

### Connection Pooling
Prisma automatically handles connection pooling:
- Default pool size: Based on available connections
- Configured in DATABASE_URL if needed

## Environment Variables

```bash
# Development (.env)
DATABASE_URL=postgresql://artspot_admin:PASSWORD@artspot-db-dev.cpgo2ia2wuo1.ap-southeast-2.rds.amazonaws.com:5432/postgres?schema=public&sslmode=require

# Production
DATABASE_URL=postgresql://username:password@production-endpoint:5432/artspot?schema=public&sslmode=require&connection_limit=10
```

## Troubleshooting

### Connection Issues

**Error: Can't reach database server**
- Check AWS RDS security group allows inbound on port 5432
- Verify RDS instance is "Available"
- Ensure "Publicly accessible" is enabled (development)
- Check your IP hasn't changed (if using IP whitelist)

**SSL/TLS Issues**
- Ensure `sslmode=require` is in connection string
- AWS RDS enforces SSL by default

### Migration Issues

**Error: Database schema is not in sync**
```bash
pnpm prisma:generate
pnpm prisma migrate deploy
```

## Monitoring & Alerts

**AWS CloudWatch Metrics:**
- CPU utilization
- Database connections
- Free storage space
- Read/Write IOPS

**Recommended Alarms:**
- CPU > 80% for 5 minutes
- Free storage < 2GB
- Connection count > 80% of max

## Cost Optimization

**Current Setup (Free Tier):**
- Instance: db.t3.micro or db.t4g.micro
- Storage: 20 GB
- Backups: 7 days
- **Cost**: $0/month (12 months free tier)

**After Free Tier:**
- Estimated: $15-30/month (db.t3.micro)
- Consider Reserved Instances for 30-75% savings

## Next Steps

1. Set up staging database (separate RDS instance)
2. Configure automated backups retention
3. Set up CloudWatch monitoring and alarms
4. Implement database seeding for development
5. Add read replicas for scaling (future)
