'use client';

import { useState, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';

export interface PriceRangeFilterProps {
  min?: number;
  max?: number;
  onMinChange?: (value: number | undefined) => void;
  onMaxChange?: (value: number | undefined) => void;
  currency?: string;
  className?: string;
}

/**
 * Price range filter with min/max inputs
 * Formats values as currency
 */
export function PriceRangeFilter({
  min,
  max,
  onMinChange,
  onMaxChange,
  currency = 'USD',
  className,
}: PriceRangeFilterProps) {
  const [minInput, setMinInput] = useState(min?.toString() ?? '');
  const [maxInput, setMaxInput] = useState(max?.toString() ?? '');

  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinInput(value);
    const numValue = value === '' ? undefined : parseFloat(value);
    if (numValue === undefined || !isNaN(numValue)) {
      onMinChange?.(numValue);
    }
  };

  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxInput(value);
    const numValue = value === '' ? undefined : parseFloat(value);
    if (numValue === undefined || !isNaN(numValue)) {
      onMaxChange?.(numValue);
    }
  };

  const formatCurrency = (value: string) => {
    if (!value || value === '') return '';
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1">
        <input
          type="number"
          placeholder="Min"
          value={minInput}
          onChange={handleMinChange}
          className={cn(
            'w-full px-3 py-2 text-sm',
            'bg-white border-2 border-neutral-200 rounded',
            'text-neutral-900 placeholder:text-neutral-400',
            'focus:outline-none focus:border-primary-500',
            'transition-colors'
          )}
        />
        {minInput && (
          <div className="mt-1 text-xs text-neutral-500 tabular-nums">
            {formatCurrency(minInput)}
          </div>
        )}
      </div>
      <span className="text-sm text-neutral-400">—</span>
      <div className="flex-1">
        <input
          type="number"
          placeholder="Max"
          value={maxInput}
          onChange={handleMaxChange}
          className={cn(
            'w-full px-3 py-2 text-sm',
            'bg-white border-2 border-neutral-200 rounded',
            'text-neutral-900 placeholder:text-neutral-400',
            'focus:outline-none focus:border-primary-500',
            'transition-colors'
          )}
        />
        {maxInput && (
          <div className="mt-1 text-xs text-neutral-500 tabular-nums">
            {formatCurrency(maxInput)}
          </div>
        )}
      </div>
    </div>
  );
}
