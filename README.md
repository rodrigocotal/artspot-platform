# ArtSpot Platform

Premium art marketplace for collectors and galleries.

## Vision

ArtSpot believes collecting art goes beyond ownership or decoration—it is valued as a personal, intellectual, and emotional asset. Our platform prioritizes curation and expertise guided by institutional standards and values based on honesty and trust.

**Atelier ArtSpot**: A space for art of vision, talent, and lasting meaning.

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router) with React 19
- **Styling**: Tailwind CSS + custom design system
- **UI Components**: shadcn/ui + Framer Motion
- **State Management**: Zustand + React Query
- **Authentication**: NextAuth.js v5

### Backend
- **Framework**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Cloudinary
- **Email**: SendGrid
- **Background Jobs**: Bull + Redis

### CMS
- **Platform**: Strapi (headless CMS)

## Project Structure

This is a monorepo managed with pnpm workspaces and Turborepo:

```
artspot-platform/
├── apps/
│   ├── web/                 # Next.js frontend
│   ├── api/                 # Node.js/Express backend
│   └── cms/                 # Strapi CMS
├── packages/
│   ├── ui/                  # Shared React components
│   ├── types/               # Shared TypeScript types
│   ├── utils/               # Shared utilities
│   └── config/              # Shared configuration
└── docs/                    # Documentation
```

## Getting Started

Documentation coming soon.

## Development Phases

### Phase 1: Browse & Inquiry System (MVP)
- Artwork browsing and filtering
- Artist profiles
- Curated collections
- User authentication
- Wishlist functionality
- Inquiry system

### Phase 2: Full E-Commerce
- Shopping cart
- Stripe payment integration
- Order management
- ShipStation shipping integration
- Email notifications
- Admin dashboard

### Phase 3: Mobile App
- React Native or Flutter mobile application

## Contributing

This is a private project. For questions, contact the development team.

## License

MIT
