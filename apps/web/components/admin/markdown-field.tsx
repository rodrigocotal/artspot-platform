'use client';

import { useRef, useState } from 'react';
import { MarkdownContent } from '@/components/markdown-content';
import { cn } from '@/lib/utils';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link2, Quote } from 'lucide-react';

interface MarkdownFieldProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export function MarkdownField({ value, onChange, rows = 14 }: MarkdownFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  // Wrap the current selection (or a placeholder) with markdown markers.
  const surround = (before: string, after: string, placeholder: string) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start + before.length;
      el.selectionEnd = start + before.length + selected.length;
    });
  };

  // Prefix each line in the selection (or the current line) with a marker.
  const prefixLines = (prefix: string, placeholder: string) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const block = value.slice(lineStart, end) || placeholder;
    const prefixed = block
      .split('\n')
      .map((line) => prefix + line)
      .join('\n');
    const next = value.slice(0, lineStart) + prefixed + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = lineStart;
      el.selectionEnd = lineStart + prefixed.length;
    });
  };

  const ToolBtn = ({
    onClick,
    title,
    children,
  }: {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="p-1.5 rounded hover:bg-neutral-200 text-neutral-600"
    >
      {children}
    </button>
  );

  const Divider = () => <span className="w-px h-5 bg-neutral-300 mx-1" aria-hidden="true" />;

  return (
    <div className="border border-neutral-300 rounded-lg overflow-hidden">
      {/* Toolbar + tabs */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-2">
        <div className="flex items-center gap-0.5 py-1">
          {tab === 'write' && (
            <>
              <ToolBtn onClick={() => surround('**', '**', 'bold text')} title="Bold"><Bold className="w-4 h-4" /></ToolBtn>
              <ToolBtn onClick={() => surround('*', '*', 'italic text')} title="Italic"><Italic className="w-4 h-4" /></ToolBtn>
              <Divider />
              <ToolBtn onClick={() => prefixLines('## ', 'Heading')} title="Heading 2"><Heading2 className="w-4 h-4" /></ToolBtn>
              <ToolBtn onClick={() => prefixLines('### ', 'Subheading')} title="Heading 3"><Heading3 className="w-4 h-4" /></ToolBtn>
              <Divider />
              <ToolBtn onClick={() => prefixLines('- ', 'List item')} title="Bulleted list"><List className="w-4 h-4" /></ToolBtn>
              <ToolBtn onClick={() => prefixLines('1. ', 'List item')} title="Numbered list"><ListOrdered className="w-4 h-4" /></ToolBtn>
              <ToolBtn onClick={() => prefixLines('> ', 'Quote')} title="Quote"><Quote className="w-4 h-4" /></ToolBtn>
              <ToolBtn onClick={() => surround('[', '](https://)', 'link text')} title="Link"><Link2 className="w-4 h-4" /></ToolBtn>
            </>
          )}
        </div>
        <div className="flex text-xs shrink-0">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={cn('px-3 py-1.5', tab === 'write' ? 'font-medium text-neutral-900' : 'text-neutral-500 hover:text-neutral-700')}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={cn('px-3 py-1.5', tab === 'preview' ? 'font-medium text-neutral-900' : 'text-neutral-500 hover:text-neutral-700')}
          >
            Preview
          </button>
        </div>
      </div>

      {tab === 'write' ? (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder="Write your article using markdown… **bold**, ## headings, - lists, [links](url)"
          className="w-full px-3 py-2 text-sm focus:outline-none resize-y font-mono"
        />
      ) : (
        <div className="px-4 py-3 min-h-[220px] prose prose-sm prose-neutral max-w-none">
          {value.trim() ? <MarkdownContent content={value} /> : <p className="text-neutral-400">Nothing to preview yet.</p>}
        </div>
      )}

      <div className="border-t border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[11px] text-neutral-500">
        Markdown supported: <code>**bold**</code>, <code>*italic*</code>, <code>## heading</code>, <code>- list</code>, <code>&gt; quote</code>, <code>[link](url)</code>
      </div>
    </div>
  );
}
