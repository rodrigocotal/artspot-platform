'use client';

import { useEffect } from 'react';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <Section spacing="lg">
      <Container>
        <div className="text-center py-20">
          <h2 className="text-heading-2 font-serif text-neutral-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-body text-neutral-600 mb-8">
            An unexpected error occurred. Please try again.
          </p>
          <Button onClick={reset}>Try again</Button>
        </div>
      </Container>
    </Section>
  );
}
