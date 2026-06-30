import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        // Primary palette - restrained gold accent (logo mark, hero italic accent)
        primary: {
          50: '#fbf6ec',
          100: '#f5e9ce',
          200: '#ead3a0',
          300: '#ddba6e',
          400: '#cfa248',
          500: '#c2922e', // Main gold accent
          600: '#a87c25',
          700: '#87621f',
          800: '#6e5020',
          900: '#5c441f',
        },

        // Neutral palette - warm cream -> near-black ink (matches reference)
        neutral: {
          50: '#faf9f7',   // Warm cream — primary background
          100: '#f4f2ee',  // Light warm background / alt sections
          200: '#e8e4dd',  // Borders, dividers (thin warm lines)
          300: '#d8d3ca',  // Subtle borders
          400: '#aca69c',  // Disabled / faint text
          500: '#858481',  // Muted foreground (medium, dimensions, labels)
          600: '#5c5a55',  // Body text
          700: '#44423d',  // Headings
          800: '#2a2926',  // Dark headings
          900: '#1a1a1a',  // Ink — dark sections, primary buttons, headings
        },

        // Semantic colors
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'], // For headings
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'], // For body
      },
      fontSize: {
        'display-lg': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading-1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-2': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading-3': ['1.875rem', { lineHeight: '1.3' }],
        'heading-4': ['1.5rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body': ['1rem', { lineHeight: '1.75' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },

      // Container max-widths for content
      maxWidth: {
        '8xl': '88rem',   // 1408px - Wide layouts
        '9xl': '96rem',   // 1536px - Full-width
        'content': '65rem', // 1040px - Article/content width
      },

      // Responsive breakpoints (Tailwind defaults enhanced)
      screens: {
        'xs': '475px',
        // sm: 640px (default)
        // md: 768px (default)
        // lg: 1024px (default)
        // xl: 1280px (default)
        // 2xl: 1536px (default)
      },

      // Restrained radii — the reference is near-square / lightly rounded, not pill-soft
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },

      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 2px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -2px rgba(0, 0, 0, 0.05)',
      },

      // Animation and transitions
      transitionDuration: {
        '400': '400ms',
      },

      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'smooth-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },

      // Typography enhancements
      letterSpacing: {
        'tighter': '-0.02em',
        'tight': '-0.01em',
      },

      lineHeight: {
        'relaxed-more': '1.75',
      },

      // Animations
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in': 'slide-in-from-top 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
