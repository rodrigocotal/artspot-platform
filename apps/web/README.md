# ArtSpot Web Application

Next.js 15 frontend for the ArtSpot premium art marketplace.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **React**: 19
- **TypeScript**: 5.7
- **Styling**: Tailwind CSS 3.4
- **Fonts**: Cormorant Garamond (serif) + Inter (sans-serif)

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

3. **Run development server**:
   ```bash
   pnpm dev
   ```

4. **Open browser**:
   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
apps/web/
├── app/              # App Router pages
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles
├── components/       # React components
├── lib/              # Utilities and helpers
├── public/           # Static assets
└── package.json
```

## Design System

### Colors
- **Primary**: Gold accent (#b08d5c) for luxury feel
- **Neutral**: Soft beiges and taupes
- **Background**: Off-white (#fafaf9)

### Typography
- **Headings**: Cormorant Garamond (serif) - elegant, classic
- **Body**: Inter (sans-serif) - clean, readable

### Spacing
Following an 8px grid system with custom spacing scale.

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript compiler check

## Next Steps

- Implement navigation components
- Create artwork card components
- Set up API client for backend communication
- Add authentication with NextAuth.js
