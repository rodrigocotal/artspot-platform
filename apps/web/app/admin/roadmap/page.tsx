'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Milestone,
  CalendarDays,
  Target,
  ArrowLeft,
  Layers,
  Rocket,
  ShoppingCart,
} from 'lucide-react';

type SprintStatus = 'completed' | 'current' | 'upcoming';

interface Sprint {
  id: number;
  name: string;
  weeks: string;
  status: SprintStatus;
  deliverables: string[];
  issues?: string;
}

interface Phase {
  id: number;
  name: string;
  subtitle: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'planned';
  icon: React.ReactNode;
  sprints: Sprint[];
}

const PHASES: Phase[] = [
  {
    id: 1,
    name: 'Phase 1',
    subtitle: 'Browse & Inquiry System (MVP)',
    duration: '15 Weeks (3.5 months)',
    status: 'completed',
    icon: <Rocket className="w-5 h-5" />,
    sprints: [
      {
        id: 1,
        name: 'Project Setup & Infrastructure',
        weeks: 'Weeks 1-2',
        status: 'completed',
        issues: '#1-8',
        deliverables: [
          'Monorepo with Turborepo + pnpm workspaces',
          'Next.js 15 frontend application',
          'Express.js API with TypeScript',
          'PostgreSQL database with Prisma ORM',
          'Strapi CMS setup',
          'Cloudinary image integration',
          'GitHub Actions CI/CD pipeline',
          'AWS staging deployment',
        ],
      },
      {
        id: 2,
        name: 'Design System & Core UI',
        weeks: 'Weeks 3-4',
        status: 'completed',
        issues: '#9-14',
        deliverables: [
          'Luxury design tokens (gold #b08d5c palette)',
          'Cormorant Garamond + Inter typography',
          'shadcn/ui component customization',
          'Responsive layout components',
          'Header & footer navigation',
          'Framer Motion animations',
        ],
      },
      {
        id: 3,
        name: 'Artwork Browsing',
        weeks: 'Weeks 5-6',
        status: 'completed',
        issues: '#15-21',
        deliverables: [
          'Browse artworks by category (painting, sculpture, photography)',
          'Advanced filtering (medium, style, price, size)',
          'High-resolution image viewing with 3.0x zoom',
          'Artwork detail pages with certificate of authenticity',
          'Grid and list view layouts',
        ],
      },
      {
        id: 4,
        name: 'Artist Profiles',
        weeks: 'Week 7',
        status: 'completed',
        issues: '#22-26',
        deliverables: [
          'Artist profile pages with biography and statement',
          'Artist works gallery',
          'Featured artists section',
          'Artist listing with search',
        ],
      },
      {
        id: 5,
        name: 'Collections & Curation',
        weeks: 'Week 8',
        status: 'completed',
        issues: '#27-31',
        deliverables: [
          'Curated collection pages',
          'New Arrivals (auto-updating)',
          'Museum-Quality Works collection',
          'Collection browsing and navigation',
        ],
      },
      {
        id: 6,
        name: 'User Authentication',
        weeks: 'Week 9',
        status: 'completed',
        issues: '#32',
        deliverables: [
          'NextAuth.js v5 integration',
          'JWT-based authentication',
          'User registration and login',
          'Role-based access (Collector, Gallery Staff, Admin)',
          'Profile management',
        ],
      },
      {
        id: 7,
        name: 'Wishlist & Favorites',
        weeks: 'Week 10',
        status: 'completed',
        deliverables: [
          'Add/remove artworks from wishlist',
          'Favorites page with saved artworks',
          'Persistent favorites across sessions',
        ],
      },
      {
        id: 8,
        name: 'Inquiry System',
        weeks: 'Week 11',
        status: 'completed',
        deliverables: [
          'Submit inquiries for artwork purchases',
          'Gallery staff inquiry dashboard',
          'Inquiry management and responses',
          'Email notifications via SendGrid',
        ],
      },
      {
        id: 9,
        name: 'CMS Integration',
        weeks: 'Week 12',
        status: 'completed',
        deliverables: [
          'Strapi v5 headless CMS',
          'Content management for gallery staff',
          'Artwork, artist, and collection management',
          'Cloudinary image upload workflow',
        ],
      },
      {
        id: 10,
        name: 'Polish & Testing',
        weeks: 'Weeks 13-14',
        status: 'completed',
        deliverables: [
          'Playwright E2E testing',
          'Performance optimization',
          'Accessibility improvements',
          'Responsive design refinements',
          'Bug fixes and edge cases',
        ],
      },
      {
        id: 11,
        name: 'Launch Preparation',
        weeks: 'Week 15',
        status: 'completed',
        deliverables: [
          'OpenAPI specification and Swagger UI',
          'Security hardening (rate limiting, CORS, headers)',
          'Structured logging',
          'CMS-driven pages and navigation',
          'Production deployment to AWS',
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Phase 2',
    subtitle: 'Full E-Commerce',
    duration: '15 Weeks (3.5 months)',
    status: 'in-progress',
    icon: <ShoppingCart className="w-5 h-5" />,
    sprints: [
      {
        id: 12,
        name: 'Shopping Cart',
        weeks: 'Weeks 16-17',
        status: 'completed',
        deliverables: [
          'Cart state management with Zustand',
          'Add/remove items from cart',
          'Cart sidebar and full page view',
          'Cart persistence across sessions',
        ],
      },
      {
        id: 13,
        name: 'Stripe Payment Integration',
        weeks: 'Weeks 18-19',
        status: 'completed',
        deliverables: [
          'Stripe checkout integration',
          'Credit card payments',
          'ACH bank transfer for high-value purchases',
          'PCI compliance via Stripe',
          'Automatic sales tax calculation (Stripe Tax)',
        ],
      },
      {
        id: 14,
        name: 'Order Management',
        weeks: 'Weeks 20-21',
        status: 'completed',
        deliverables: [
          'Order creation and tracking',
          'Order history page for collectors',
          'Stripe checkout session creation',
          'Staff payment link generation',
          'Checkout success and cancellation pages',
        ],
      },
      {
        id: 15,
        name: 'Shipping Integration',
        weeks: 'Weeks 22-23',
        status: 'current',
        deliverables: [
          'ShipStation API integration',
          'Shipping rate calculation',
          'White-glove shipping for high-value art',
          'Branded tracking pages',
          'Insurance options',
        ],
      },
      {
        id: 16,
        name: 'Email Notifications',
        weeks: 'Week 24',
        status: 'upcoming',
        deliverables: [
          'SendGrid transactional emails',
          'Order confirmation emails',
          'Shipping update notifications',
          'Account activity alerts',
        ],
      },
      {
        id: 17,
        name: 'Advanced Search',
        weeks: 'Weeks 25-26',
        status: 'upcoming',
        deliverables: [
          'Algolia search integration',
          'Full-text search across artworks, artists, collections',
          'Faceted filtering',
          'Search suggestions and autocomplete',
        ],
      },
      {
        id: 18,
        name: 'Admin Analytics Dashboard',
        weeks: 'Weeks 27-28',
        status: 'upcoming',
        deliverables: [
          'Sales analytics and revenue tracking',
          'Artwork performance metrics',
          'Customer insights',
          'Inventory management overview',
        ],
      },
      {
        id: 19,
        name: 'E-Commerce Polish & Testing',
        weeks: 'Weeks 29-30',
        status: 'upcoming',
        deliverables: [
          'End-to-end purchase flow testing',
          'Payment edge cases and error handling',
          'Performance and load testing',
          'Security audit for payment flows',
        ],
      },
    ],
  },
];

const STATUS_CONFIG = {
  completed: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    label: 'Completed',
    dotColor: 'bg-success-500',
    badgeStyle: 'bg-success-100 text-success-800 border-success-300',
    lineColor: 'bg-success-400',
  },
  current: {
    icon: <Clock className="w-5 h-5" />,
    label: 'In Progress',
    dotColor: 'bg-primary-500',
    badgeStyle: 'bg-primary-100 text-primary-800 border-primary-300',
    lineColor: 'bg-primary-400',
  },
  upcoming: {
    icon: <Circle className="w-5 h-5" />,
    label: 'Upcoming',
    dotColor: 'bg-neutral-300',
    badgeStyle: 'bg-neutral-100 text-neutral-600 border-neutral-300',
    lineColor: 'bg-neutral-200',
  },
};

function SprintCard({ sprint, isLast }: { sprint: Sprint; isLast: boolean }) {
  const [expanded, setExpanded] = useState(sprint.status === 'current');
  const config = STATUS_CONFIG[sprint.status];

  return (
    <div className="relative flex gap-4">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-3 h-3 rounded-full ring-4 ring-white z-10 shrink-0 mt-1.5',
            config.dotColor
          )}
        />
        {!isLast && (
          <div className={cn('w-0.5 flex-1 mt-1', config.lineColor)} />
        )}
      </div>

      {/* Card */}
      <div className="pb-6 flex-1 min-w-0">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left bg-white rounded-lg border border-neutral-200 p-4 hover:border-neutral-300 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Sprint {sprint.id}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                    config.badgeStyle
                  )}
                >
                  {config.label}
                </span>
                {sprint.issues && (
                  <span className="text-xs text-neutral-400">
                    Issues {sprint.issues}
                  </span>
                )}
              </div>
              <h3 className="text-body font-medium text-neutral-900">
                {sprint.name}
              </h3>
              <p className="text-sm text-neutral-500 mt-0.5">
                <CalendarDays className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
                {sprint.weeks}
              </p>
            </div>
            <div className="shrink-0 text-neutral-400">
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>

          {expanded && (
            <ul className="mt-3 pt-3 border-t border-neutral-100 space-y-1.5">
              {sprint.deliverables.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                  {sprint.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />
                  )}
                  {item}
                </li>
              ))}
            </ul>
          )}
        </button>
      </div>
    </div>
  );
}

function PhaseHeader({ phase }: { phase: Phase }) {
  const completedSprints = phase.sprints.filter((s) => s.status === 'completed').length;
  const totalSprints = phase.sprints.length;
  const progressPercent = Math.round((completedSprints / totalSprints) * 100);

  const statusStyles = {
    completed: 'bg-success-100 text-success-800 border-success-300',
    'in-progress': 'bg-primary-100 text-primary-800 border-primary-300',
    planned: 'bg-neutral-100 text-neutral-600 border-neutral-300',
  };

  const statusLabels = {
    completed: 'Completed',
    'in-progress': 'In Progress',
    planned: 'Planned',
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-primary-50 rounded-lg text-primary-700 shrink-0">
          {phase.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h2 className="text-heading-3 font-serif text-neutral-900">
              {phase.name}: {phase.subtitle}
            </h2>
            <span
              className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                statusStyles[phase.status]
              )}
            >
              {statusLabels[phase.status]}
            </span>
          </div>
          <p className="text-sm text-neutral-500 mb-3">
            <Clock className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
            {phase.duration}
          </p>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-success-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-medium text-neutral-600 shrink-0">
              {completedSprints}/{totalSprints} sprints ({progressPercent}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MilestoneSummary() {
  const totalSprints = PHASES.reduce((sum, p) => sum + p.sprints.length, 0);
  const completedSprints = PHASES.reduce(
    (sum, p) => sum + p.sprints.filter((s) => s.status === 'completed').length,
    0
  );
  const overallProgress = Math.round((completedSprints / totalSprints) * 100);

  const milestones = [
    {
      label: 'Phase 1 MVP Launch',
      status: 'completed' as const,
      detail: 'Browse & Inquiry System',
    },
    {
      label: 'Cart & Payments Live',
      status: 'completed' as const,
      detail: 'Stripe checkout & order management',
    },
    {
      label: 'Phase 2 E-Commerce',
      status: 'in-progress' as const,
      detail: 'Shipping, search & analytics',
    },
    {
      label: 'Full Platform Launch',
      status: 'planned' as const,
      detail: 'Complete marketplace (~7 months)',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-xl border border-neutral-200 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Layers className="w-5 h-5 text-primary-700" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              Overall Progress
            </p>
            <p className="text-heading-3 font-serif text-neutral-900">
              {overallProgress}%
            </p>
          </div>
        </div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="text-xs text-neutral-500 mt-2">
          {completedSprints} of {totalSprints} sprints completed
        </p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Target className="w-5 h-5 text-primary-700" />
          </div>
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Key Milestones
          </p>
        </div>
        <ul className="space-y-2">
          {milestones.map((m, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              {m.status === 'completed' ? (
                <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" />
              ) : m.status === 'in-progress' ? (
                <Clock className="w-4 h-4 text-primary-500 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-neutral-300 shrink-0" />
              )}
              <span className={cn(
                m.status === 'completed' ? 'text-neutral-500 line-through' : m.status === 'in-progress' ? 'text-primary-700 font-medium' : 'text-neutral-700'
              )}>
                {m.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <CalendarDays className="w-5 h-5 text-primary-700" />
          </div>
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Timeline
          </p>
        </div>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-500">Phase 1</dt>
            <dd className="font-medium text-success-700">15 weeks (done)</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Phase 2</dt>
            <dd className="font-medium text-primary-700">15 weeks (in progress)</dd>
          </div>
          <div className="flex justify-between pt-2 border-t border-neutral-100">
            <dt className="text-neutral-500">Full Launch</dt>
            <dd className="font-medium text-neutral-900">~7 months total</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const [activePhase, setActivePhase] = useState<number | null>(null);

  const visiblePhases =
    activePhase !== null
      ? PHASES.filter((p) => p.id === activePhase)
      : PHASES;

  return (
    <Section spacing="lg" background="neutral">
      <Container size="xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Admin
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Milestone className="w-7 h-7 text-primary-600" />
            <h1 className="text-display font-serif text-neutral-900">
              Sprints &amp; Milestones
            </h1>
          </div>
          <p className="text-body-lg text-neutral-600">
            Development roadmap for the ArtSpot platform
          </p>
        </div>

        {/* Summary Cards */}
        <MilestoneSummary />

        {/* Phase Filter */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activePhase === null ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActivePhase(null)}
          >
            All Phases
          </Button>
          {PHASES.map((phase) => (
            <Button
              key={phase.id}
              variant={activePhase === phase.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActivePhase(phase.id)}
            >
              {phase.name}
            </Button>
          ))}
        </div>

        {/* Phase Sections */}
        {visiblePhases.map((phase) => (
          <div key={phase.id} className="mb-10">
            <PhaseHeader phase={phase} />

            <div className="ml-1">
              {phase.sprints.map((sprint, i) => (
                <SprintCard
                  key={sprint.id}
                  sprint={sprint}
                  isLast={i === phase.sprints.length - 1}
                />
              ))}
            </div>
          </div>
        ))}
      </Container>
    </Section>
  );
}
