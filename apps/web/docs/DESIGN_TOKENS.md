# ArtSpot Design Tokens

Design tokens for the ArtSpot premium art marketplace. These tokens establish a luxury aesthetic that reflects the high-end gallery experience.

---

## Design Philosophy

**Luxury. Sophistication. Focus on Art.**

The design system emphasizes:
- **Minimal distraction** - Let the artwork shine
- **Premium feel** - Elegant typography and refined colors
- **Gallery aesthetic** - Spacious, clean, professional
- **Accessibility** - WCAG 2.1 AA compliant

---

## Color Palette

### Primary - Gold Accents

Warm gold tones for calls-to-action, highlights, and luxury accents.

```tsx
// Tailwind classes
bg-primary-500    // Main gold accent
text-primary-600  // Darker gold for text
border-primary-200 // Light gold borders

// Usage
<button className="bg-primary-500 hover:bg-primary-600">
  Inquire
</button>
```

**Color Scale:**
- `primary-50` to `primary-100` - Very light backgrounds
- `primary-200` to `primary-300` - Subtle accents
- `primary-500` - **Main accent color** (Gold: #b08d5c)
- `primary-600` to `primary-900` - Darker variants for text/hover

---

### Neutral - Warm Grays & Beiges

Warm neutral tones that create an inviting, gallery-like atmosphere.

```tsx
// Tailwind classes
bg-neutral-50     // Page backgrounds (off-white)
bg-neutral-100    // Card backgrounds
text-neutral-900  // Primary text (near-black)
text-neutral-600  // Secondary text
border-neutral-200 // Borders and dividers

// Usage
<div className="bg-neutral-50 text-neutral-900">
  <p className="text-neutral-600">Secondary information</p>
</div>
```

**Usage Guidelines:**
- `neutral-50` - Primary background color
- `neutral-100` - Card and component backgrounds
- `neutral-200-300` - Borders, dividers
- `neutral-600` - Body text
- `neutral-800-900` - Headings, emphasis

---

### Semantic Colors

For system feedback and status indicators.

```tsx
// Success (green)
text-success-600  // Success messages

// Warning (amber)
text-warning-600  // Warnings

// Error (red)
text-error-600    // Error messages
```

---

## Typography

### Font Families

**Serif (Cormorant Garamond)** - For headings and elegant text
```tsx
className="font-serif"
// All h1-h6 tags automatically use serif
```

**Sans-serif (Inter)** - For body text and UI
```tsx
className="font-sans"
// Default for body text
```

---

### Type Scale

#### Display Sizes
For hero sections and large headings.

```tsx
// Display Large - 72px
<h1 className="text-display-lg font-serif">
  Museum-Quality Art
</h1>

// Display - 56px
<h1 className="text-display font-serif">
  Featured Artists
</h1>
```

#### Headings
For section titles and hierarchy.

```tsx
// Heading 1 - 48px
<h1 className="text-heading-1">Paintings</h1>

// Heading 2 - 36px
<h2 className="text-heading-2">New Arrivals</h2>

// Heading 3 - 30px
<h3 className="text-heading-3">About the Artist</h3>

// Heading 4 - 24px
<h4 className="text-heading-4">Details</h4>
```

#### Body Text
For paragraphs and content.

```tsx
// Body Large - 18px
<p className="text-body-lg">
  Introducing our curated collection...
</p>

// Body - 16px (default)
<p className="text-body">
  Standard paragraph text.
</p>

// Body Small - 14px
<p className="text-body-sm text-neutral-600">
  Additional information
</p>
```

---

### Typography Guidelines

**Line Height:**
- Headings: Tight (1.1-1.4) for elegance
- Body: Relaxed (1.75) for readability

**Letter Spacing:**
- Display/Large headings: Tighter (-0.02em)
- Regular headings: Slightly tight (-0.01em)
- Body text: Normal

**Font Weights (Cormorant Garamond):**
- Light (300) - Elegant, secondary headings
- Regular (400) - Standard headings
- Medium (500) - Emphasis
- SemiBold (600) - Primary CTAs
- Bold (700) - Strong emphasis

```tsx
<h1 className="font-serif font-light">Light Heading</h1>
<h2 className="font-serif font-semibold">Bold Heading</h2>
```

---

## Spacing

### Spacing Scale

Based on 4px baseline grid (Tailwind's default rem-based system).

```tsx
// Common spacing
p-4    // 16px - Default padding
p-6    // 24px - Card padding
p-8    // 32px - Section padding
p-12   // 48px - Large section padding

// Custom spacing
p-18   // 72px (4.5rem)
p-22   // 88px (5.5rem)
p-26   // 104px (6.5rem)
p-30   // 120px (7.5rem)

// Gap between elements
space-y-4  // 16px vertical spacing
space-y-8  // 32px vertical spacing
```

**Guidelines:**
- Use multiples of 4px for consistency
- Generous spacing for luxury feel
- Card padding: `p-6` or `p-8`
- Section spacing: `py-12` to `py-24`
- Container max-width: `max-w-7xl` (1280px)

---

## Layout Containers

### Content Widths

```tsx
// Standard content container
<div className="max-w-7xl mx-auto px-4">
  {/* 1280px max width */}
</div>

// Wide layout
<div className="max-w-8xl mx-auto px-4">
  {/* 1408px max width */}
</div>

// Article/content width
<div className="max-w-content mx-auto">
  {/* 1040px - ideal for reading */}
</div>
```

---

## Breakpoints

### Responsive Design Points

```tsx
// Extra small devices (phones landscape)
xs: 475px

// Small devices (tablets portrait)
sm: 640px

// Medium devices (tablets landscape)
md: 768px

// Large devices (laptops)
lg: 1024px

// Extra large devices (desktops)
xl: 1280px

// 2X Extra large (large desktops)
2xl: 1536px
```

**Usage:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>

<h1 className="text-heading-3 md:text-heading-2 lg:text-heading-1">
  {/* Responsive typography */}
</h1>
```

---

## Border Radius

For rounded corners on components.

```tsx
rounded-md   // 0.375rem (6px) - Small elements
rounded-lg   // 1rem (16px) - Cards, inputs
rounded-xl   // 1.5rem (24px) - Large cards
rounded-2xl  // 2rem (32px) - Hero sections
```

**Guidelines:**
- Buttons: `rounded-md` or `rounded-lg`
- Cards: `rounded-lg` or `rounded-xl`
- Images: `rounded-lg` for artwork thumbnails

---

## Shadows

Soft, subtle shadows that don't overpower the content.

```tsx
// Card shadow (subtle)
shadow-card

// Card hover state
shadow-card-hover

// Soft elevation
shadow-soft

// Large soft elevation
shadow-soft-lg
```

**Usage:**
```tsx
<div className="bg-white rounded-xl shadow-card hover:shadow-card-hover">
  {/* Artwork card */}
</div>
```

---

## Transitions & Animations

### Duration

```tsx
duration-200  // Fast transitions (200ms)
duration-300  // Default transitions (300ms)
duration-400  // Slower transitions (400ms)
```

### Timing Functions

```tsx
ease-smooth      // cubic-bezier(0.4, 0, 0.2, 1)
ease-smooth-in   // cubic-bezier(0.4, 0, 1, 1)
ease-smooth-out  // cubic-bezier(0, 0, 0.2, 1)
```

**Usage:**
```tsx
<button className="transition-all duration-300 ease-smooth hover:scale-105">
  Inquire
</button>

<div className="transition-opacity duration-400 ease-smooth">
  {/* Fade transitions */}
</div>
```

---

## Component Examples

### Button (Primary)

```tsx
<button className="
  bg-primary-500
  hover:bg-primary-600
  text-white
  px-6 py-3
  rounded-lg
  font-sans font-medium
  transition-colors duration-200
  shadow-soft hover:shadow-soft-lg
">
  Inquire About Artwork
</button>
```

### Card (Artwork)

```tsx
<div className="
  bg-white
  rounded-xl
  shadow-card
  hover:shadow-card-hover
  transition-shadow duration-300
  overflow-hidden
">
  <img src="..." alt="..." className="w-full aspect-square object-cover" />
  <div className="p-6">
    <h3 className="text-heading-4 font-serif mb-2">Artwork Title</h3>
    <p className="text-body text-neutral-600">Artist Name</p>
  </div>
</div>
```

### Section Header

```tsx
<div className="py-12 border-b border-neutral-200">
  <div className="max-w-7xl mx-auto px-4">
    <h1 className="text-display font-serif text-neutral-900 mb-4">
      New Arrivals
    </h1>
    <p className="text-body-lg text-neutral-600 max-w-2xl">
      Discover our latest curated selection of museum-quality artworks
    </p>
  </div>
</div>
```

---

## Best Practices

### Do's ✅

- Use semantic color names (`primary`, `neutral`, `success`)
- Maintain consistent spacing with the 4px grid
- Use serif fonts for headings to reinforce luxury
- Apply generous white space for premium feel
- Use soft shadows for depth without distraction

### Don'ts ❌

- Don't use arbitrary color values (`text-[#123456]`)
- Don't use random spacing values
- Don't mix font families inconsistently
- Don't over-use shadows or animations
- Don't use bright, saturated colors (keep it muted)

---

## Accessibility

### Color Contrast

All color combinations meet WCAG 2.1 AA standards:

- **Primary text (`neutral-900`) on light backgrounds**: ✅ AAA
- **Secondary text (`neutral-600`) on light backgrounds**: ✅ AA
- **Primary button (`primary-500`) with white text**: ✅ AA

### Focus States

Always include visible focus indicators:

```tsx
<button className="
  focus:outline-none
  focus:ring-2
  focus:ring-primary-500
  focus:ring-offset-2
">
  Button
</button>
```

### Typography

- Minimum body text size: 16px (1rem)
- Line height for readability: 1.75
- Sufficient color contrast ratios

---

## File References

- **Tailwind Config**: `tailwind.config.ts`
- **Global Styles**: `app/globals.css`
- **Layout (Fonts)**: `app/layout.tsx`

---

## Version History

- **v1.0** (2026-02-16) - Initial design token system
  - Color palette established
  - Typography scale defined
  - Spacing and layout tokens
  - Component examples

---

**Questions or suggestions?** Open an issue or contact the design team.
