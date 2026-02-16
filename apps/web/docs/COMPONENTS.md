# ArtSpot Component Library

Reusable UI components for the ArtSpot premium art marketplace, built with React, Tailwind CSS, and class-variance-authority.

---

## Overview

This component library provides a set of accessible, luxury-themed components that follow our design tokens and maintain consistency across the platform.

**Built with:**
- React 19
- Tailwind CSS 3.4
- class-variance-authority (CVA)
- Framer Motion (for animations)

---

## Components

### Button

Versatile button component with multiple variants and sizes.

**Variants:**
- `primary` - Gold accent for main CTAs
- `secondary` - Neutral elegant style
- `outline` - Sophisticated border style
- `ghost` - Minimal, text-focused
- `link` - Underlined text style

**Sizes:**
- `sm` - Small (height: 36px)
- `md` - Medium (height: 44px) - Default
- `lg` - Large (height: 52px)
- `xl` - Extra Large (height: 56px)
- `icon` - Square icon button (40x40px)

**Props:**
- `variant` - Button style variant
- `size` - Button size
- `loading` - Show loading spinner
- `disabled` - Disable button
- All standard button HTML attributes

**Usage:**
```tsx
import { Button } from '@/components/ui';

// Primary button
<Button>Inquire About Artwork</Button>

// Secondary with size
<Button variant="secondary" size="lg">
  View Collection
</Button>

// Outline button
<Button variant="outline">Learn More</Button>

// Loading state
<Button loading>Submitting...</Button>

// Disabled
<Button disabled>Sold Out</Button>
```

**Accessibility:**
- Keyboard focusable
- Focus ring indicator
- Disabled state properly conveyed
- Loading state with spinner icon

---

### Card

Flexible container component for displaying content.

**Subcomponents:**
- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title (h3)
- `CardDescription` - Subtitle/description
- `CardContent` - Main content area
- `CardFooter` - Footer section

**Usage:**
```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';

// Basic card
<Card>
  <CardHeader>
    <CardTitle>Artwork Title</CardTitle>
    <CardDescription>Artist Name</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Artwork details go here...</p>
  </CardContent>
  <CardFooter>
    <Button>Inquire</Button>
  </CardFooter>
</Card>

// Artwork card example
<Card>
  <CardHeader>
    <CardTitle>Sunset Over Venice</CardTitle>
    <CardDescription>Maria Rodriguez</CardDescription>
  </CardHeader>
  <CardContent>
    <img src="..." alt="..." className="w-full rounded-lg" />
    <p className="mt-4 text-body-sm text-neutral-600">
      Oil on Canvas • 24" × 36"
    </p>
  </CardContent>
  <CardFooter>
    <Button className="w-full">View Details</Button>
  </CardFooter>
</Card>
```

**Styling:**
- Rounded corners (`rounded-xl`)
- Soft shadow with hover effect
- White background
- Smooth transitions

---

### Input

Text input component for forms.

**Types:**
- `text` - Standard text input
- `email` - Email input
- `password` - Password input
- `number` - Number input
- `tel` - Telephone input
- Any standard HTML input type

**Props:**
- `error` - Show error state (red border)
- All standard input HTML attributes

**Usage:**
```tsx
import { Input, Label } from '@/components/ui';

// Basic input
<Input type="text" placeholder="Enter your name" />

// With label
<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <Input
    id="email"
    type="email"
    placeholder="your@email.com"
  />
</div>

// Error state
<Input
  type="email"
  error
  placeholder="invalid@email.com"
/>
<p className="text-body-sm text-error-600">
  Please enter a valid email
</p>

// Disabled
<Input
  type="text"
  disabled
  placeholder="Disabled input"
/>
```

**Accessibility:**
- Proper focus styles
- Error states clearly indicated
- Works with labels (for/id)
- Disabled state properly conveyed

---

### Textarea

Multi-line text input for longer content.

**Props:**
- `error` - Show error state
- `rows` - Number of visible rows (default: 4)
- All standard textarea HTML attributes

**Usage:**
```tsx
import { Textarea, Label } from '@/components/ui';

// Basic textarea
<Textarea placeholder="Enter your message..." />

// With label and rows
<div className="space-y-2">
  <Label htmlFor="message">Your Message</Label>
  <Textarea
    id="message"
    rows={6}
    placeholder="Tell us about your interest..."
  />
</div>

// Error state
<Textarea
  error
  placeholder="This field is required"
/>
```

---

### Label

Accessible form label component.

**Props:**
- `required` - Show asterisk for required fields
- `htmlFor` - ID of associated input
- All standard label HTML attributes

**Usage:**
```tsx
import { Label } from '@/components/ui';

// Basic label
<Label htmlFor="name">Full Name</Label>

// Required field
<Label htmlFor="email" required>
  Email Address
</Label>

// Custom styling
<Label
  htmlFor="note"
  className="text-primary-600"
>
  Special Note
</Label>
```

---

## Design Patterns

### Form Layout

Standard form layout with proper spacing:

```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="name" required>Full Name</Label>
    <Input id="name" type="text" />
  </div>

  <div className="space-y-2">
    <Label htmlFor="email" required>Email</Label>
    <Input id="email" type="email" />
  </div>

  <div className="space-y-2">
    <Label htmlFor="message">Message</Label>
    <Textarea id="message" rows={4} />
  </div>

  <div className="flex gap-4">
    <Button variant="outline" type="button">
      Cancel
    </Button>
    <Button type="submit">
      Submit
    </Button>
  </div>
</form>
```

### Artwork Card Grid

Responsive grid layout for artwork cards:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {artworks.map((artwork) => (
    <Card key={artwork.id}>
      <CardContent className="p-0">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full aspect-square object-cover rounded-t-xl"
        />
        <div className="p-6">
          <h3 className="font-serif text-heading-4">{artwork.title}</h3>
          <p className="text-body text-neutral-600">{artwork.artist}</p>
          <p className="text-body-sm text-neutral-500 mt-2">
            {artwork.medium} • {artwork.dimensions}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Inquire</Button>
      </CardFooter>
    </Card>
  ))}
</div>
```

---

## Accessibility Guidelines

### Keyboard Navigation
- All interactive components are keyboard accessible
- Focus indicators are visible and clear
- Tab order is logical and intuitive

### ARIA Labels
- Buttons have descriptive labels
- Form inputs have associated labels
- Error states are announced
- Loading states are indicated

### Color Contrast
- All text meets WCAG 2.1 AA standards
- Error states use sufficient contrast
- Focus indicators are clearly visible

### Screen Readers
- Semantic HTML elements
- Proper heading hierarchy
- Alt text for images
- Form labels properly associated

---

## Best Practices

### Do's ✅

- Use semantic variants (`primary` for main actions, `secondary` for alternatives)
- Always pair inputs with labels
- Use error states for validation feedback
- Provide loading states for async actions
- Maintain consistent spacing (use Tailwind's `space-y-*` utilities)

### Don'ts ❌

- Don't use multiple primary buttons in the same context
- Don't create inputs without labels
- Don't override component styles arbitrarily
- Don't use bright colors that clash with luxury aesthetic
- Don't forget to handle disabled and loading states

---

## Component Showcase

Visit `/components` route to see all components in action with live examples.

---

## Adding New Components

When creating new components:

1. **Follow the pattern:**
   ```tsx
   import * as React from 'react';
   import { cn } from '@/lib/utils';

   const NewComponent = React.forwardRef<
     HTMLDivElement,
     React.HTMLAttributes<HTMLDivElement>
   >(({ className, ...props }, ref) => (
     <div
       ref={ref}
       className={cn('base-styles', className)}
       {...props}
     />
   ));
   NewComponent.displayName = 'NewComponent';

   export { NewComponent };
   ```

2. **Use design tokens** from `tailwind.config.ts`
3. **Ensure accessibility** (keyboard, screen readers, ARIA)
4. **Add to index.ts** for easy imports
5. **Document usage** in this file
6. **Test thoroughly** across browsers

---

## File Structure

```
components/
└── ui/
    ├── button.tsx         # Button component
    ├── card.tsx           # Card components
    ├── input.tsx          # Input component
    ├── textarea.tsx       # Textarea component
    ├── label.tsx          # Label component
    └── index.ts           # Barrel exports

lib/
└── utils.ts              # Utility functions (cn)

docs/
├── COMPONENTS.md         # This file
└── DESIGN_TOKENS.md      # Design system tokens
```

---

## Dependencies

- `class-variance-authority` - Variant management
- `clsx` - Class name utilities
- `tailwind-merge` - Merge Tailwind classes
- `framer-motion` - Animations (future)

---

## Version History

- **v1.0** (2026-02-16) - Initial component library
  - Button (5 variants, 5 sizes)
  - Card (6 subcomponents)
  - Input (with error states)
  - Textarea
  - Label (with required indicator)

---

**Questions or suggestions?** Open an issue or contact the development team.
