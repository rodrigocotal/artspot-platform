'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterTagProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

/**
 * Removable filter pill/tag
 * Shows active filters with remove button
 */
export function FilterTag({ label, onRemove, className }: FilterTagProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
        'bg-primary-50 border border-primary-200',
        'text-sm text-primary-700',
        className
      )}
    >
      <span className="font-medium">{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:bg-primary-100 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${label} filter`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
