# ArtSpot Platform — Development Roadmap

**Prepared:** March 2026
**Total Timeline:** ~30 weeks (7 months) across 2 phases
**Platform:** Premium online art marketplace for browsing, collecting, and purchasing fine art

---

## Executive Summary

ArtSpot is a luxury art marketplace built with a modern technology stack (Next.js 15, Express.js, PostgreSQL, Stripe). Development is organized into two phases: **Phase 1** delivers a fully functional browse-and-inquiry experience, and **Phase 2** adds complete e-commerce capabilities including payments, shipping, and analytics.

**Current Status:** Phase 1 is complete. Phase 2 is in progress — shopping cart, Stripe payments, and order management are live. Shipping, search, and analytics are next.

---

## Phase 1 — Browse & Inquiry System (MVP)

**Duration:** 15 weeks · **Status:** Complete

Phase 1 establishes the core platform — a polished, gallery-quality browsing experience where collectors can discover artworks, explore artist profiles, save favorites, and submit purchase inquiries.

| Sprint | Focus | Duration | Status |
|--------|-------|----------|--------|
| 1 | Project Setup & Infrastructure | Weeks 1–2 | Done |
| 2 | Design System & Core UI | Weeks 3–4 | Done |
| 3 | Artwork Browsing | Weeks 5–6 | Done |
| 4 | Artist Profiles | Week 7 | Done |
| 5 | Collections & Curation | Week 8 | Done |
| 6 | User Authentication | Week 9 | Done |
| 7 | Wishlist & Favorites | Week 10 | Done |
| 8 | Inquiry System | Week 11 | Done |
| 9 | CMS Integration | Week 12 | Done |
| 10 | Polish & Testing | Weeks 13–14 | Done |
| 11 | Launch Preparation | Week 15 | Done |

### Key Deliverables

- **Artwork Browsing** — Browse by category (painting, sculpture, photography) with advanced filtering by medium, style, price, and size. High-resolution image viewing with 3x zoom.
- **Artist Profiles** — Full artist pages with biography, artist statement, and works gallery. Featured artists section and searchable artist directory.
- **Curated Collections** — Staff-curated collection pages including auto-updating "New Arrivals" and themed collections like "Museum-Quality Works."
- **User Accounts** — Secure registration and login with role-based access for Collectors, Gallery Staff, and Admins.
- **Wishlist & Favorites** — Collectors can save artworks to a personal wishlist that persists across sessions.
- **Inquiry System** — Collectors submit purchase inquiries directly from artwork pages. Gallery staff manage and respond to inquiries via an admin dashboard with email notifications.
- **Content Management** — Strapi v5 headless CMS for gallery staff to manage artworks, artists, collections, and page content without developer involvement.
- **Production Infrastructure** — Deployed to AWS with CI/CD pipeline, rate limiting, security hardening, structured logging, and API documentation.

### Phase 1 Milestone: MVP Launch ✓

> Collectors can browse the full catalog, explore artists, save favorites, and submit purchase inquiries. Gallery staff can manage content and respond to inquiries.

---

## Phase 2 — Full E-Commerce

**Duration:** 15 weeks · **Status:** In Progress (3 of 8 sprints complete)

Phase 2 transforms ArtSpot from an inquiry-based gallery into a complete e-commerce platform with direct purchasing, secure payments, and integrated shipping.

| Sprint | Focus | Duration | Status |
|--------|-------|----------|--------|
| 12 | Shopping Cart | Weeks 16–17 | **Done** |
| 13 | Stripe Payment Integration | Weeks 18–19 | **Done** |
| 14 | Order Management | Weeks 20–21 | **Done** |
| 15 | Shipping Integration | Weeks 22–23 | Up Next |
| 16 | Email Notifications | Week 24 | Planned |
| 17 | Advanced Search | Weeks 25–26 | Planned |
| 18 | Admin Analytics Dashboard | Weeks 27–28 | Planned |
| 19 | E-Commerce Polish & Testing | Weeks 29–30 | Planned |

### Completed Deliverables

- **Shopping Cart** — Full cart experience with add/remove items, sidebar and full-page views, and session persistence. Built with Zustand for fast, reliable state management.
- **Stripe Payments** — Secure checkout via Stripe with credit card and ACH bank transfer support for high-value purchases. Automatic sales tax calculation via Stripe Tax. Full PCI compliance.
- **Order Management** — Complete order lifecycle with Stripe checkout sessions, staff payment link generation, order history for collectors, and checkout success/cancellation flows.

### Remaining Deliverables

- **Shipping (ShipStation)** — Integrated shipping rate calculation, white-glove shipping options for high-value art, branded tracking pages, and insurance options.
- **Email Notifications** — Transactional emails via SendGrid for order confirmations, shipping updates, and account activity alerts.
- **Advanced Search (Algolia)** — Full-text search across artworks, artists, and collections with faceted filtering, suggestions, and autocomplete.
- **Analytics Dashboard** — Sales analytics, revenue tracking, artwork performance metrics, customer insights, and inventory management overview for gallery administrators.

### Phase 2 Milestone: Full Platform Launch

> Collectors can browse, purchase, and track orders end-to-end. Gallery staff have full visibility into sales, shipping, and customer analytics.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| Backend | Express.js, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| CMS | Strapi v5 |
| Payments | Stripe (Checkout, Tax) |
| Shipping | ShipStation API |
| Search | Algolia |
| Email | SendGrid |
| Images | Cloudinary |
| Hosting | AWS |
| CI/CD | GitHub Actions |

---

## Progress Overview

```
Phase 1  ████████████████████  100%  (11/11 sprints)
Phase 2  ████████░░░░░░░░░░░░   38%  ( 3/8  sprints)
Overall  ██████████████░░░░░░   74%  (14/19 sprints)
```

---

*For questions about this roadmap, please contact the ArtSpot development team.*
