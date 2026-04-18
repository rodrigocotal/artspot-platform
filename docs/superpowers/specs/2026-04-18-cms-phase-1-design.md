# CMS Phase 1 — Home image + generic image field + SEO metadata

**Date:** 2026-04-18
**Tracking issue:** [#89](https://github.com/rodrigocotal/artspot-platform/issues/89)
**Follow-ups:** Phase 2 ([#90](https://github.com/rodrigocotal/artspot-platform/issues/90)), Phase 3 ([#91](https://github.com/rodrigocotal/artspot-platform/issues/91))

## Goals

1. Add a CMS-editable image to the home page using a clean "text-first, centered landscape image, CTAs last" layout.
2. Introduce a reusable **image** field type so any CMS page can include images.
3. Introduce **SEO metadata** per page (with site-wide defaults and smart fallbacks) rendered server-side.

## Non-goals

- Rich text / body fields (Phase 2, #90)
- Retrofitting thin pages with body copy (Phase 2)
- Dynamic page creation from admin UI (Phase 3, #91)
- Cloudinary orphan cleanup (tracked as future debt)

## Decisions made during brainstorming

| Decision | Choice | Why |
|---|---|---|
| Home image purpose | Flexible slot (image + caption + optional link + show/hide) | Covers featured artwork, atmospheric, and campaign use cases without multiple bespoke systems |
| Home image layout | **F** — text hero → centered landscape image → CTAs | Classic editorial rhythm; keeps headline clean; image is anchor, not backdrop |
| Image CMS fields | image, alt, caption, link, show/hide | Skip focal-point cropping until mobile actually demands it |
| SEO fallback strategy | Page override → page headline/subtitle → site defaults → hardcoded | Reuses content that already exists; admins only fill SEO fields when they want a custom value |
| Cloudinary folder | New `cms/` folder via new `POST /upload/cms` | Keeps CMS assets separate from artwork assets; small recurring benefit over zero-cost reuse |
| Storage shape | JSON-nested inside `PageContent.content` | No Prisma migration; consistent with existing CMS pattern; denormalize only when queryability becomes real |

## Architecture

### Data shape (all inside `PageContent.content` JSON)

**Generic image field** — reused wherever an image appears:
```json
{
  "url": "https://res.cloudinary.com/.../home-hero.jpg",
  "publicId": "cms/home-hero",
  "alt": "Spring Exhibition gallery view",
  "caption": "Installation view, Spring 2026",
  "linkUrl": "/collections/spring-2026",
  "visible": true
}
```
`caption`, `linkUrl` optional. `visible` defaults to `true`. `publicId` is required for new uploads but tolerated as missing at render time (so a url pasted manually still works).

**Per-page SEO** (optional, on any page):
```json
"_seo": {
  "title": "Discover Museum-Quality Art | ArtAldo",
  "description": "Elevating the experience of collecting...",
  "image": { "url": "...", "publicId": "cms/home-og", "alt": "..." }
}
```
All three optional. Missing fields fall back through the resolution chain.

**Site-wide SEO defaults** (on existing `site-settings` page):
```json
"_seo": {
  "siteName": "ArtAldo",
  "defaultTitle": "ArtAldo — Museum-Quality Art",
  "defaultDescription": "...",
  "defaultImage": { "url": "...", "publicId": "cms/site-og-default", "alt": "..." }
}
```

**Home page adds one field** — `heroImage` using the generic image shape above, consumed by layout F.

### SEO resolution chain

`resolveSeo(pageContent, siteSettings)` returns `{ title, description, image }`:

1. **Title:** `page._seo.title` → `page.heroHeadline` or `page.headline` → `siteSettings._seo.defaultTitle` → `"ArtAldo"`
2. **Description:** `page._seo.description` → `page.heroSubtitle` or `page.subtitle` → `siteSettings._seo.defaultDescription` → `""`
3. **Image:** `page._seo.image.url` → `siteSettings._seo.defaultImage.url` → `undefined`

The helper lives in both:
- `apps/api/src/lib/seo.ts` (API — used internally / by tests)
- `apps/web/lib/seo.ts` (web — used by `generateMetadata`)

They share the same logic; duplicated to avoid a cross-package import in Phase 1. Extract to a shared package if/when a third consumer appears.

## Backend

### New upload route

**File:** `apps/api/src/routes/upload.ts`
- `POST /upload/cms` — admin-only (`authenticate` + `authorize('ADMIN', 'GALLERY_STAFF')`)
- Max upload size: 10 MB (same as artwork)
- Response: `{ success: true, image: { url, publicId, width, height, format, bytes } }`

**File:** `apps/api/src/middleware/upload.ts`
- New `uploadCmsImage` multer middleware — identical pattern to `uploadArtworkImage`
- Uses `multer-storage-cloudinary` with folder: `cms/`
- Allowed types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

### PageContent controller

Unchanged. The existing `PUT /pages/:slug` accepts arbitrary JSON, so new fields (`heroImage`, `_seo`, any page's `image` field) flow through with no API change. Draft/publish semantics unchanged.

### Helper module

**File:** `apps/api/src/lib/seo.ts`
- `resolveSeo(page: PageContent, siteSettings: PageContent | null): ResolvedSeo`
- Pure function, fully unit-tested.

## CMS admin

### New field types

**File:** `apps/web/app/admin/content/[slug]/page.tsx`
- Extend `FieldType` union: `'text' | 'textarea' | 'json-array' | 'nav' | 'image' | 'seo'`
- Add render branches in the form mapping

### ImageField component

**File:** `apps/web/components/admin/image-field.tsx`
- Props: `value`, `onChange`, `label`, optional `allowLink` (default true), optional `allowCaption` (default true), optional `allowVisibility` (default true)
- Thumbnail of current `url` (or dashed placeholder)
- "Upload" → file picker → `apiClient.uploadCmsImage(file)` → updates `{ url, publicId, width, height }` in the parent
- Inline inputs: **alt** (required, visibly marked), **caption** (optional, when `allowCaption`), **link URL** (optional, when `allowLink`), **visible** checkbox (when `allowVisibility`)
- "Remove" clears to `null` (does not delete from Cloudinary — orphan is acceptable debt)
- Validation: upload failure → inline error; missing alt → warning (non-blocking on save, surfaced as a hint)

### SeoField component

**File:** `apps/web/components/admin/seo-field.tsx`
- Compound editor: SEO title (text input, helper: *"Leave blank to use page headline"*), SEO description (textarea), OG image (embeds `<ImageField allowLink={false} allowCaption={false} allowVisibility={false} />`)
- For the `site-settings` page: same UI, different labels ("Default Title", "Default Description", "Default Social Image"), and extra `siteName` text input

### FIELD_CONFIGS updates

**File:** `apps/web/app/admin/content/[slug]/page.tsx`

- **`home`** — prepend `{ key: 'heroImage', label: 'Hero Image', type: 'image' }`, append `{ key: '_seo', label: 'SEO', type: 'seo' }`
- **`site-settings`** — append `{ key: '_seo', label: 'Site-wide SEO Defaults', type: 'seo' }` (SeoField renders its site-defaults variant for this slug)
- **All 14 others** — append `{ key: '_seo', label: 'SEO', type: 'seo' }`
- **`contact`** — also add `{ key: 'contactImage', label: 'Contact Image', type: 'image' }` as a smoke-test for the generic image field on a second page
- Rendered on the public `/contact` page above or alongside the contact form (placement in build phase)

### Live preview

**File:** `apps/web/components/admin/previews/home-preview.tsx` (existing)
- Update to render layout F including the `<HeroImage>` component
- Other page previews unchanged in Phase 1

### API client

**File:** `apps/web/lib/api-client.ts`
- New method `uploadCmsImage(file: File): Promise<{ success: boolean; image: UploadedImage }>`
- Mirrors `uploadArtworkImage` — multipart form POST to `/upload/cms`

## Public site

### Home page (layout F)

Split into two files:

**`apps/web/app/page.tsx`** — server component
- `export async function generateMetadata()` — fetches page + site-settings, calls `resolveSeo`, returns Next.js `Metadata`
- Default export: server component that fetches content, renders `<HomePageClient content={...} />`

**`apps/web/app/home-client.tsx`** — client component
- Receives `content` as prop (no more `useEffect` fetch)
- Renders layout F order:
  1. Badge
  2. Headline
  3. Subtitle
  4. `<HeroImage image={content.heroImage} />`
  5. Primary + secondary CTAs
  6. Features section (unchanged)

Removes the loading flash — content is already on the server render, consistent with the non-flash approach used elsewhere in the app.

### HeroImage component

**File:** `apps/web/components/HeroImage.tsx`
- Props: `image: ImageFieldValue | null | undefined`
- Returns `null` if image is missing OR `visible === false` OR no `url`
- Renders centered `next/image` — `className="w-[78%] max-w-4xl mx-auto aspect-video object-cover"`
- Optional caption in small serif below
- If `linkUrl` present, wraps in a `Link`
- Used by both `home-client.tsx` AND `home-preview.tsx` — live preview matches public site exactly

### generateMetadata — scope clarified

**CMS slugs vs routes:** There are 16 CMS slugs today, but not all map 1:1 to Next.js page routes.

- **Layout-only slugs (no route):** `site-settings`, `footer` — these drive global layout/metadata defaults and nav. They get `_seo` admin fields (site-settings holds the site-wide defaults) but **no page refactor**.
- **Content-driven route slugs:** `home`, `contact`, `collector-services`, `discover`, `artists`, `artists-featured`, `artworks`, `collections`, `collections-new-arrivals`, `collections-museum-quality`, `editorial`, `inspiration`, `exhibitions`, `favorites`.
- **Slug-without-route discovery task:** some slugs (likely `editorial`, `inspiration`, `exhibitions`, `artists-featured`, and the two `collections-*` subsections) may not yet have corresponding `apps/web/app/<route>/page.tsx` files. The **first step of implementation** is: grep `apps/web/app/**/page.tsx` for `'use client'`, reconcile against the CMS slug list, and produce a definitive pairing. For slugs without a route, the admin still gets their `_seo` field for future use; no page refactor until the route is built (outside Phase 1).

**Refactor applied to:** every `apps/web/app/**/page.tsx` that (a) currently uses `'use client'` AND (b) corresponds to a CMS slug. Each becomes:
- `page.tsx` — server component, exports `generateMetadata`, renders client child
- `*-client.tsx` — client component with the interactive JSX

**Explicitly out of scope for the refactor:**
- `admin/**` — uses hardcoded or layout-level metadata; not CMS-driven
- Auth pages (`login`, `register`, `forgot-password`, `reset-password`) — static metadata is fine
- `cart`, `checkout`, `account` — transactional UI; `noindex` metadata is appropriate and doesn't need CMS wiring
- Dynamic `[slug]` pages (`artists/[slug]`, `artworks/[slug]`, `collections/[slug]`) — metadata driven by entity data (artist/artwork/collection records), not `PageContent`. Could be added in a later pass but is not part of Phase 1 to keep scope honest.

**Expected count:** ~10 content-driven page routes refactored. Final count produced in the implementation plan after the grep/pairing task above.

### Error handling

- **CMS unreachable during `generateMetadata`:** return hardcoded `{ title: "ArtAldo", description: "" }` — bad metadata must not 500 the page.
- **`heroImage.publicId` missing but `url` present:** render anyway (publicId optional at render time, required only for uploads).
- **Upload failure in admin:** inline error in the ImageField; form state unchanged; user can retry.
- **`linkUrl` is an external URL:** `next/link` handles it natively; no special case.

## Testing

### E2E (Playwright)

**File:** `apps/web/e2e/cms-home-image.spec.ts`
- Admin logs in, navigates to `/admin/content/home`, uploads an image, sets alt/caption/link, publishes
- Visits `/` — image renders with correct alt, caption present, clicking image navigates to link target
- Admin toggles `visible: false`, republishes — image no longer on `/`
- Admin uploads a replacement image — new image renders, old Cloudinary URL not referenced

**File:** `apps/web/e2e/cms-seo.spec.ts`
- Sets per-page SEO on `home`, publishes, asserts `<title>`, `<meta name="description">`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">` match
- Clears `_seo.title`, asserts `<title>` now derived from `heroHeadline`
- Clears page-level `_seo` entirely, asserts site-settings defaults are used
- Runs the fallback assertions on `/contact` too — confirms fallbacks work across pages

### API unit

**File:** `apps/api/tests/upload.test.ts`
- `POST /upload/cms` — happy path, response shape, Cloudinary folder = `cms/`
- Rejects unauthenticated (401)
- Rejects non-admin role (403)
- Rejects oversized (> 10 MB)
- Rejects disallowed MIME

**File:** `apps/api/tests/seo.test.ts`
- `resolveSeo` fallback chain: page override → headline/subtitle → site default → hardcoded
- Null site settings (first-run state)
- Empty strings treated as missing (fall through to next layer)
- Null `page._seo.image` falls through to site default image

### Frontend unit

- `HeroImage`: renders null for `visible=false`, null `image`, missing `url`; renders `<Link>` wrapper only when `linkUrl` set; renders caption only when set
- `resolveSeo` (web-side copy) — same cases as API

### Manual smoke

- Cloudinary dashboard: new images appear under `cms/` folder, not in `artworks/`
- Safari: admin image upload flow works (per user preference — always test auth/upload in Safari)
- Lighthouse SEO score on `/` before and after

## File inventory

### New files

- `apps/api/src/lib/seo.ts`
- `apps/web/lib/seo.ts`
- `apps/web/components/admin/image-field.tsx`
- `apps/web/components/admin/seo-field.tsx`
- `apps/web/components/HeroImage.tsx`
- `apps/web/app/home-client.tsx`
- `apps/web/app/<route>/<route>-client.tsx` — one per content-driven page that currently uses `'use client'` (final count determined by the pairing task; est. ~9 others)
- `apps/web/e2e/cms-home-image.spec.ts`
- `apps/web/e2e/cms-seo.spec.ts`
- `apps/api/tests/seo.test.ts`

### Modified files

- `apps/api/src/routes/upload.ts` — add `/upload/cms` route
- `apps/api/src/middleware/upload.ts` — add `uploadCmsImage`
- `apps/api/tests/upload.test.ts` — extend for `/upload/cms`
- `apps/web/lib/api-client.ts` — add `uploadCmsImage` method and `UploadedImage` type usage
- `apps/web/app/admin/content/[slug]/page.tsx` — new field types + FIELD_CONFIGS updates
- `apps/web/components/admin/previews/home-preview.tsx` — layout F with HeroImage
- `apps/web/app/page.tsx` — convert to server component, add `generateMetadata`
- `apps/web/app/<route>/page.tsx` — same conversion, for every content-driven route discovered in the pairing task (est. ~9 routes)
- The corresponding `*-client.tsx` file for each refactored route (see New files)

### No schema migration

`PageContent.content` is already `Json`. All new fields nest inside it.

## Risks and open questions

1. **Server-component refactor scope** — roughly 10 content-driven routes × 2 files each ≈ ~20 files touched. Mechanical but invasive. Break into small commits during implementation, one route per commit or per small batch.
2. **Draft vs published in `generateMetadata`** — metadata must read **published** content (or it'll leak drafts to crawlers). Confirm the API `GET /pages/:slug` (without `draft=true`) returns published content — this is the existing behavior, just reverified during build.
3. **Orphan images in Cloudinary** — accepted debt for Phase 1. File a tracking issue after Phase 1 ships if orphan count becomes visible.
4. **Preview accuracy** — the admin preview scales the same React component as the public site, so layout F should render identically. Visually verify during build; if the scaled preview distorts the image crop, add explicit sizing to the preview wrapper.

## Rollout plan

1. Backend upload route + middleware + tests
2. Shared `resolveSeo` helper (both API and web copies) + tests
3. Admin UI: ImageField, SeoField, FIELD_CONFIGS updates
4. Home page: layout F + `HeroImage` + server/client split + `generateMetadata`
5. Roll server/client split + `generateMetadata` to remaining content-driven pages in small batches
6. Smoke-test `contact` with its image field on the public page
7. E2E suite
8. Manual Safari + Cloudinary verification
9. Deploy to develop → production (per user preference: push to main AND develop)
