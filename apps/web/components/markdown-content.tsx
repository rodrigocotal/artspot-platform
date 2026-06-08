'use client';

import Markdown from 'react-markdown';

/**
 * Renders markdown as React elements (no raw HTML — react-markdown escapes it
 * and sanitizes link URLs by default, so this is XSS-safe). Wrap in a `prose`
 * container at the call site for typography.
 */
export function MarkdownContent({ content }: { content: string }) {
  return <Markdown>{content || ''}</Markdown>;
}
