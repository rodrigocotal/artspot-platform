#!/bin/bash

# Sprint 1: Project Setup & Infrastructure (Week 1-2)
gh issue create --title "#1: Initialize GitHub repository and monorepo structure" --body "Set up the initial monorepo structure with pnpm workspaces and Turborepo.

**Tasks:**
- [x] Create GitHub repository
- [x] Initialize git repository
- [x] Create monorepo directory structure
- [x] Configure pnpm workspaces
- [x] Set up Turborepo configuration

**Status:** Completed" --label "type: infrastructure,P1 - High,sprint-1"

gh issue create --title "#2: Set up Next.js application with App Router" --body "Initialize the Next.js 15 application with App Router in apps/web/.

**Tasks:**
- [ ] Create Next.js app with create-next-app
- [ ] Configure TypeScript
- [ ] Set up Tailwind CSS
- [ ] Configure next.config.js
- [ ] Create basic app structure
- [ ] Test local development server

**Acceptance Criteria:**
- Next.js app runs on localhost:3000
- TypeScript compilation works
- Tailwind CSS is configured" --label "type: infrastructure,area: frontend,P1 - High,sprint-1"

gh issue create --title "#3: Set up Express.js API with Prisma ORM" --body "Initialize the Node.js/Express backend with Prisma in apps/api/.

**Tasks:**
- [ ] Create Express.js app structure
- [ ] Configure TypeScript
- [ ] Install and configure Prisma
- [ ] Set up environment variables
- [ ] Create basic server with health check endpoint
- [ ] Configure CORS
- [ ] Test local API server

**Acceptance Criteria:**
- API runs on localhost:4000
- Health check endpoint responds
- TypeScript compilation works" --label "type: infrastructure,area: backend,P1 - High,sprint-1"

gh issue create --title "#4: Configure PostgreSQL database (local + Render)" --body "Set up PostgreSQL database locally and on Render for staging.

**Tasks:**
- [ ] Install PostgreSQL locally or use Docker
- [ ] Create database schema file
- [ ] Configure Prisma to connect to local database
- [ ] Set up Render PostgreSQL instance
- [ ] Configure staging environment variables
- [ ] Test database connections

**Acceptance Criteria:**
- Local database is running
- Prisma can connect to both local and staging databases
- Basic health check can query database" --label "type: infrastructure,area: backend,P1 - High,sprint-1"

gh issue create --title "#5: Set up Strapi CMS" --body "Initialize Strapi CMS for content management in apps/cms/.

**Tasks:**
- [ ] Create Strapi project
- [ ] Configure PostgreSQL connection
- [ ] Set up admin user
- [ ] Configure cloud upload (Cloudinary)
- [ ] Test CMS locally
- [ ] Deploy to staging

**Acceptance Criteria:**
- Strapi admin panel accessible
- Can create/edit content types
- File upload works" --label "type: infrastructure,area: cms,P1 - High,sprint-1"

gh issue create --title "#6: Configure Cloudinary for image management" --body "Set up Cloudinary for high-resolution artwork image storage and optimization.

**Tasks:**
- [ ] Create Cloudinary account
- [ ] Configure API keys
- [ ] Set up image upload workflow
- [ ] Configure image transformations (zoom, formats)
- [ ] Set up upload presets
- [ ] Test image upload and retrieval

**Acceptance Criteria:**
- Images can be uploaded via API
- Transformations work (resize, format conversion)
- Art-specific color profiles are preserved" --label "type: infrastructure,P1 - High,sprint-1"

gh issue create --title "#7: Set up CI/CD pipeline (GitHub Actions)" --body "Create GitHub Actions workflows for automated testing and deployment.

**Tasks:**
- [ ] Create PR check workflow (lint, type-check, build)
- [ ] Create staging deployment workflow
- [ ] Create production deployment workflow
- [ ] Configure environment secrets
- [ ] Test workflows

**Acceptance Criteria:**
- PRs trigger automated checks
- Merge to develop deploys to staging
- Merge to main deploys to production" --label "type: infrastructure,P1 - High,sprint-1"

gh issue create --title "#8: Deploy to staging environments (Vercel + Render)" --body "Deploy frontend and backend to staging environments.

**Tasks:**
- [ ] Set up Vercel project for frontend
- [ ] Set up Render services for API and CMS
- [ ] Configure environment variables
- [ ] Set up custom domains (staging subdomains)
- [ ] Test staging deployment
- [ ] Verify all services communicate

**Acceptance Criteria:**
- Frontend accessible at staging URL
- API accessible and responds to health checks
- CMS accessible at staging URL" --label "type: infrastructure,P1 - High,sprint-1"

# Sprint 2: Design System & Core UI (Week 3-4)
gh issue create --title "#9: Create design tokens (colors, typography, spacing)" --body "Define design tokens for the luxury aesthetic matching the mockups.

**Design Requirements:**
- Serif typography (Garamond-style)
- Soft, muted color palette (beiges, taupes, off-whites, gold accents)
- Consistent spacing scale

**Tasks:**
- [ ] Define color palette in Tailwind config
- [ ] Configure custom fonts (serif for headings, sans for body)
- [ ] Set up spacing scale
- [ ] Define breakpoints for responsive design
- [ ] Create typography scale
- [ ] Document design tokens

**Acceptance Criteria:**
- Design tokens exported and usable in components
- Matches luxury aesthetic from mockups" --label "type: design,area: frontend,P1 - High,sprint-2"

gh issue create --title "#10: Build reusable UI component library (buttons, cards, inputs)" --body "Create base UI components using shadcn/ui, customized for luxury feel.

**Components:**
- Button (primary, secondary, outline variants)
- Card
- Input (text, email, password)
- Select
- Textarea
- Checkbox
- Radio

**Tasks:**
- [ ] Install shadcn/ui
- [ ] Customize theme to match design tokens
- [ ] Create component variants
- [ ] Add Framer Motion animations
- [ ] Document components with Storybook (optional)
- [ ] Test components

**Acceptance Criteria:**
- All components styled consistently
- Components are accessible (keyboard navigation, ARIA labels)" --label "type: design,area: frontend,P1 - High,sprint-2"

gh issue create --title "#11: Implement navigation (primary + utility)" --body "Build the main navigation structure matching the requirements.

**Primary Navigation:**
- Artworks (with dropdown: Painting, Sculpture, Photography, Works on Paper, Art Installation, Art Objects)
- Artists (Browse Artists, Featured Artists)
- Collections (Curated Selections, New Arrivals, Museum-Quality Works)
- Discover (Editorial, Inspiration, Exhibitions)
- Collector Services
- Contact

**Utility Navigation:**
- Search
- Favorites
- Cart (0)
- Account

**Tasks:**
- [ ] Create Header component
- [ ] Implement responsive navigation (mobile menu)
- [ ] Add hover states and animations
- [ ] Create dropdown menus
- [ ] Implement search toggle
- [ ] Test accessibility

**Acceptance Criteria:**
- Navigation works on all breakpoints
- Dropdowns function smoothly
- Mobile menu toggles correctly" --label "type: feature,area: frontend,P1 - High,sprint-2"

gh issue create --title "#12: Create responsive layout system" --body "Build the base layout components for consistent page structure.

**Components:**
- Layout wrapper
- Container
- Grid system
- Section components

**Tasks:**
- [ ] Create Layout component
- [ ] Implement responsive containers
- [ ] Create grid utilities
- [ ] Add Footer component
- [ ] Test on all breakpoints
- [ ] Optimize for mobile

**Acceptance Criteria:**
- Layouts work on mobile, tablet, desktop
- Matches mockup spacing and structure" --label "type: design,area: frontend,P1 - High,sprint-2"

gh issue create --title "#13: Implement image zoom component (3.0x functionality)" --body "Create high-resolution image viewer with 3.0x zoom capability as shown in mockups.

**Requirements:**
- Pinch-to-zoom on mobile
- Click/hover zoom on desktop
- Zoom indicator (3.0x badge)
- Smooth animations
- Preserve image quality

**Tasks:**
- [ ] Research zoom libraries (react-image-zoom, react-medium-image-zoom)
- [ ] Implement zoom component
- [ ] Add zoom indicator
- [ ] Integrate with Cloudinary transformations
- [ ] Test on mobile and desktop
- [ ] Optimize performance

**Acceptance Criteria:**
- Users can zoom to 3.0x on artwork images
- Image quality remains high when zoomed
- Works smoothly on all devices" --label "type: feature,area: frontend,P1 - High,sprint-2"

gh issue create --title "#14: Build filter/search UI components" --body "Create filter and search UI components for artwork browsing.

**Filter Options:**
- Artist
- Medium
- Style
- Period
- Price Range
- Size
- Availability

**Tasks:**
- [ ] Create FilterBar component
- [ ] Build individual filter components (dropdowns, range sliders)
- [ ] Create SearchBar component
- [ ] Add filter chips/tags
- [ ] Implement clear filters functionality
- [ ] Style with luxury aesthetic

**Acceptance Criteria:**
- Filters are easy to use and visually appealing
- Multiple filters can be applied
- Filters can be cleared" --label "type: feature,area: frontend,P1 - High,sprint-2"

# Sprint 3: Artwork Browsing (Week 5-6)
gh issue create --title "#15: Design and implement artwork database schema" --body "Create Prisma schema for artworks and related tables.

**Tables:**
- artworks (id, title, description, medium, dimensions, year, price, availability, created_at, updated_at)
- artwork_images (id, artwork_id, url, alt_text, is_primary, order)
- media (enum: painting, sculpture, photography, works_on_paper, installation, objects)
- styles (enum or table)
- periods (enum or table)

**Tasks:**
- [ ] Define Prisma schema
- [ ] Create migration
- [ ] Run migration on local database
- [ ] Seed database with sample data
- [ ] Test queries

**Acceptance Criteria:**
- Schema supports all required artwork fields
- Relations are properly defined
- Sample data loads successfully" --label "type: infrastructure,area: backend,P1 - High,sprint-3"

gh issue create --title "#16: Create API endpoints for artwork CRUD operations" --body "Build RESTful API endpoints for artwork management.

**Endpoints:**
- GET /api/artworks (list with pagination, filters)
- GET /api/artworks/:id (single artwork)
- POST /api/artworks (create - admin only)
- PUT /api/artworks/:id (update - admin only)
- DELETE /api/artworks/:id (delete - admin only)

**Tasks:**
- [ ] Create Express routes
- [ ] Implement controllers
- [ ] Add authentication middleware
- [ ] Add validation (Zod)
- [ ] Implement pagination
- [ ] Implement filtering
- [ ] Write tests
- [ ] Document API

**Acceptance Criteria:**
- All endpoints work correctly
- Proper error handling
- Authentication enforced for admin routes" --label "type: feature,area: backend,P1 - High,sprint-3"

gh issue create --title "#17: Build artwork listing page (grid/masonry layout)" --body "Create the main artwork browsing page with grid layout.

**Requirements:**
- Responsive grid (1 col mobile, 2-3 cols tablet, 3-4 cols desktop)
- Artwork cards with image, title, artist, price
- Hover effects
- Loading states
- Empty states

**Tasks:**
- [ ] Create ArtworkCard component
- [ ] Implement grid layout
- [ ] Connect to API
- [ ] Add loading skeleton
- [ ] Add empty state
- [ ] Optimize images (lazy loading)
- [ ] Test responsiveness

**Acceptance Criteria:**
- Grid displays artworks beautifully
- Cards show correct information
- Images load efficiently" --label "type: feature,area: frontend,P1 - High,sprint-3"

gh issue create --title "#18: Implement artwork detail page with image zoom" --body "Create the artwork detail page matching the mockup.

**Features:**
- Large primary image with zoom
- Artwork information (title, artist, medium, dimensions, year, price)
- Certificate of Authenticity section
- 'Inquire to Purchase' and 'Buy Securely' buttons (Phase 2)
- Related artworks/artist works
- Image gallery

**Tasks:**
- [ ] Create ArtworkDetail page component
- [ ] Implement image gallery with zoom
- [ ] Display artwork metadata
- [ ] Add authentication info section
- [ ] Create related works carousel
- [ ] Add favorite button
- [ ] Test on all breakpoints

**Acceptance Criteria:**
- Page matches mockup design
- All artwork information displays correctly
- Image zoom works smoothly" --label "type: feature,area: frontend,P1 - High,sprint-3"

gh issue create --title "#19: Add artwork filtering (medium, style, price, size)" --body "Implement client and server-side filtering for artwork browsing.

**Filters:**
- Medium (painting, sculpture, etc.)
- Style (contemporary, abstract, etc.)
- Period (20th century, contemporary, etc.)
- Price range (slider)
- Size (dimensions)
- Availability (available, sold, on hold)

**Tasks:**
- [ ] Update API to accept filter parameters
- [ ] Implement filter logic in backend
- [ ] Connect filters to frontend UI
- [ ] Add URL state management (query params)
- [ ] Test filter combinations
- [ ] Optimize queries

**Acceptance Criteria:**
- Filters work individually and in combination
- Results update immediately
- URL reflects active filters (shareable)" --label "type: feature,area: backend,area: frontend,P1 - High,sprint-3"

gh issue create --title "#20: Implement search functionality (basic)" --body "Add basic text search for artworks and artists.

**Search Scope:**
- Artwork titles
- Artist names
- Artwork descriptions
- Medium/style

**Tasks:**
- [ ] Add search endpoint to API
- [ ] Implement PostgreSQL full-text search
- [ ] Create SearchBar component
- [ ] Add search results page
- [ ] Implement debouncing
- [ ] Add search history (optional)
- [ ] Test search accuracy

**Acceptance Criteria:**
- Search returns relevant results
- Search is fast (<500ms)
- Works with partial matches" --label "type: feature,area: backend,area: frontend,P1 - High,sprint-3"

gh issue create --title "#21: Add pagination/infinite scroll" --body "Implement pagination or infinite scroll for artwork listings.

**Options:**
- Infinite scroll (recommended for luxury feel)
- Traditional pagination
- Hybrid approach

**Tasks:**
- [ ] Implement cursor-based pagination in API
- [ ] Add pagination to GET /api/artworks endpoint
- [ ] Implement infinite scroll in frontend
- [ ] Add loading states
- [ ] Test performance with large datasets
- [ ] Optimize scroll performance

**Acceptance Criteria:**
- Smooth scrolling experience
- No duplicate items
- Works on all devices" --label "type: feature,area: backend,area: frontend,P1 - High,sprint-3"

# Sprint 4: Artist Profiles (Week 7)
gh issue create --title "#22: Design artist database schema" --body "Create Prisma schema for artist profiles.

**Schema:**
- artists (id, name, slug, bio, statement, location, featured, image_url, created_at, updated_at)
- artist_artworks (relationship)

**Tasks:**
- [ ] Define Prisma schema
- [ ] Create migration
- [ ] Seed sample artist data
- [ ] Test queries

**Acceptance Criteria:**
- Schema supports artist profiles
- Relations to artworks work correctly" --label "type: infrastructure,area: backend,P1 - High,sprint-4"

gh issue create --title "#23: Create API endpoints for artist data" --body "Build API endpoints for artist profiles.

**Endpoints:**
- GET /api/artists (list)
- GET /api/artists/:slug (single artist)
- POST /api/artists (create - admin)
- PUT /api/artists/:slug (update - admin)
- DELETE /api/artists/:id (delete - admin)

**Tasks:**
- [ ] Create routes and controllers
- [ ] Add validation
- [ ] Implement filtering (featured, location)
- [ ] Write tests
- [ ] Document API

**Acceptance Criteria:**
- All endpoints functional
- Proper authentication and authorization" --label "type: feature,area: backend,P1 - High,sprint-4"

gh issue create --title "#24: Build artist listing page" --body "Create the artist browsing page.

**Features:**
- Grid of artist cards
- Artist photo, name, style/location
- Filter by featured
- Search artists

**Tasks:**
- [ ] Create ArtistCard component
- [ ] Build artist listing page
- [ ] Connect to API
- [ ] Add filtering
- [ ] Test responsiveness

**Acceptance Criteria:**
- Artists display in attractive grid
- Filtering works" --label "type: feature,area: frontend,P1 - High,sprint-4"

gh issue create --title "#25: Create artist detail page (bio, statement, works)" --body "Build the artist profile page matching mockups.

**Features:**
- Hero image with artist photo
- Biography
- Artist statement
- 'Read More' expandable text
- Selected works grid
- Link to all works by artist

**Tasks:**
- [ ] Create ArtistDetail page
- [ ] Display artist information
- [ ] Create works grid
- [ ] Add 'Read More' functionality
- [ ] Test on all breakpoints

**Acceptance Criteria:**
- Page matches mockup
- Biography is readable and well-formatted
- Works display correctly" --label "type: feature,area: frontend,P1 - High,sprint-4"

gh issue create --title "#26: Link artworks to artists" --body "Ensure artworks properly link to their artist profiles.

**Tasks:**
- [ ] Add artist_id to artwork schema (if not done)
- [ ] Update API to include artist data
- [ ] Add artist link on artwork cards
- [ ] Add artist link on artwork detail page
- [ ] Test navigation

**Acceptance Criteria:**
- Clicking artist name navigates to artist page
- Artist data loads correctly" --label "type: feature,area: backend,area: frontend,P1 - High,sprint-4"

# Sprint 5: Collections & Curation (Week 8)
gh issue create --title "#27: Design collections schema (many-to-many with artworks)" --body "Create database schema for curated collections.

**Schema:**
- collections (id, name, slug, description, image_url, featured, created_at)
- collection_artworks (collection_id, artwork_id, order)

**Tasks:**
- [ ] Define Prisma schema
- [ ] Create migration
- [ ] Seed sample collections
- [ ] Test many-to-many relationship

**Acceptance Criteria:**
- Collections can contain multiple artworks
- Artworks can be in multiple collections" --label "type: infrastructure,area: backend,P1 - High,sprint-5"

gh issue create --title "#28: Create API endpoints for collections" --body "Build API endpoints for collections.

**Endpoints:**
- GET /api/collections (list)
- GET /api/collections/:slug (single with artworks)
- POST /api/collections (create - admin)
- PUT /api/collections/:slug (update - admin)
- DELETE /api/collections/:id (delete - admin)

**Tasks:**
- [ ] Create routes and controllers
- [ ] Implement including artworks in response
- [ ] Add validation
- [ ] Write tests

**Acceptance Criteria:**
- Endpoints return collections with artworks
- Proper auth enforced" --label "type: feature,area: backend,P1 - High,sprint-5"

gh issue create --title "#29: Build collections listing page" --body "Create the collections browsing page.

**Features:**
- Collection cards with preview image
- Collection name and artwork count
- Featured collections highlighted

**Tasks:**
- [ ] Create CollectionCard component
- [ ] Build collections listing page
- [ ] Connect to API
- [ ] Add hover effects
- [ ] Test responsiveness

**Acceptance Criteria:**
- Collections display beautifully
- Cards link to collection detail pages" --label "type: feature,area: frontend,P1 - High,sprint-5"

gh issue create --title "#30: Create collection detail page" --body "Build the collection detail page.

**Features:**
- Collection hero image
- Collection description
- Grid of artworks in collection
- Filter/sort within collection

**Tasks:**
- [ ] Create CollectionDetail page
- [ ] Display collection metadata
- [ ] Show artworks grid
- [ ] Add filtering within collection
- [ ] Test on all breakpoints

**Acceptance Criteria:**
- Page displays collection info and artworks
- Users can browse collection easily" --label "type: feature,area: frontend,P1 - High,sprint-5"

gh issue create --title "#31: Implement 'New Arrivals' and 'Museum-Quality' collections" --body "Create special curated collections.

**Collections:**
- New Arrivals (automated based on created_at)
- Museum-Quality Works (manually curated)

**Tasks:**
- [ ] Create logic for New Arrivals (auto-populate)
- [ ] Create Museum-Quality collection
- [ ] Add these to navigation
- [ ] Test auto-updating for New Arrivals

**Acceptance Criteria:**
- New Arrivals updates automatically
- Museum-Quality can be manually curated" --label "type: feature,area: backend,P1 - High,sprint-5"

# Sprint 6: User Authentication (Week 9)
gh issue create --title "#32: Set up NextAuth.js with JWT strategy" --body "Configure NextAuth.js v5 for authentication.

**Features:**
- Email/password authentication
- JWT tokens
- Refresh token rotation
- Session management

**Tasks:**
- [ ] Install NextAuth.js
- [ ] Configure auth providers
- [ ] Set up JWT strategy
- [ ] Create auth API routes
- [ ] Configure session handling
- [ ] Test authentication flow

**Acceptance Criteria:**
- Users can authenticate
- Sessions persist correctly
- Tokens refresh automatically" --label "type: feature,area: frontend,area: backend,P1 - High,sprint-6"

echo "All Phase 1 Sprint 1-6 issues created successfully!""
