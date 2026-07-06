import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Container, Section } from '@/components/layout';
import { ARTALDO_HOME_DEFAULTS, ARTALDO_HOME_IMAGES } from '@/lib/artaldo-reference';

export const metadata: Metadata = {
  title: 'About Aldo Castillo | ArtAldo',
  description:
    'Learn about Aldo Castillo, art dealer and curatorial director behind ArtAldo.',
};

export default function AboutPage() {
  return (
    <>
      <Section background="white" className="border-b border-neutral-100">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
                About
              </p>
              <h1 className="mt-3 font-serif text-5xl font-medium leading-tight text-neutral-950 sm:text-6xl">
                Aldo Castillo
              </h1>
              <div className="mt-6 space-y-5 leading-relaxed text-neutral-600">
                {ARTALDO_HOME_DEFAULTS.aboutBody.split('\n\n').map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <Link href="/contact" className="mt-8 inline-block">
                <Button size="lg" variant="primary" className="rounded-none px-9">
                  Schedule a Private Art Consultation
                </Button>
              </Link>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
              <Image
                src={ARTALDO_HOME_IMAGES.about}
                alt="Aldo Castillo at gallery opening"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
