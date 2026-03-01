'use client';

import { useEffect, useState } from 'react';

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

export function LiveRegion({ message, politeness = 'polite' }: LiveRegionProps) {
  const [announced, setAnnounced] = useState('');

  useEffect(() => {
    // Clear then set to force re-announcement
    setAnnounced('');
    const timer = setTimeout(() => setAnnounced(message), 100);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {announced}
    </div>
  );
}

export type { LiveRegionProps };
