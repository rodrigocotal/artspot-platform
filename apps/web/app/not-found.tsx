import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <Section spacing="lg">
      <Container>
        <div className="text-center py-20">
          <h2 className="text-heading-2 font-serif text-neutral-900 mb-4">
            Page not found
          </h2>
          <p className="text-body text-neutral-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
