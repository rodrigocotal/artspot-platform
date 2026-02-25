'use client';

import { ChangeEvent } from 'react';
import { cn } from '@/lib/utils';

export interface FilterCheckboxProps {
  id: string;
  label: string;
  count?: number;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

/**
 * Checkbox for multi-select filters
 * Shows option label and optional result count
 */
export function FilterCheckbox({
  id,
  label,
  count,
  checked = false,
  onChange,
  className,
}: FilterCheckboxProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-center gap-2 py-1.5 cursor-pointer group',
        className
      )}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        className={cn(
          'w-4 h-4 rounded border-2 border-neutral-300',
          'text-primary-600 focus:ring-2 focus:ring-primary-100 focus:ring-offset-0',
          'transition-colors cursor-pointer'
        )}
      />
      <span className="flex-1 text-sm text-neutral-700 group-hover:text-neutral-900 transition-colors">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-neutral-400 tabular-nums">({count})</span>
      )}
    </label>
  );
}
