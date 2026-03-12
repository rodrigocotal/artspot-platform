'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SortOption {
  value: string;
  label: string;
}

export interface SortDropdownProps {
  options: SortOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Dropdown for sorting options
 * Shows checkmark for selected option
 */
export function SortDropdown({
  options,
  value,
  onChange,
  placeholder = 'Sort by',
  className,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-between gap-2 px-4 py-2',
          'bg-white border-2 border-neutral-200 rounded-lg',
          'text-sm text-neutral-900',
          'hover:border-neutral-300 focus:outline-none focus:border-primary-500',
          'transition-colors min-w-[160px]'
        )}
      >
        <span className={cn(!selectedOption && 'text-neutral-400')}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-neutral-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 mt-2 w-full min-w-[200px]',
            'bg-white border border-neutral-200 rounded-lg shadow-lg',
            'py-1 z-50'
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                'w-full flex items-center justify-between gap-2 px-4 py-2',
                'text-sm text-left',
                'hover:bg-neutral-50 transition-colors',
                option.value === value
                  ? 'text-primary-600 font-medium'
                  : 'text-neutral-700'
              )}
            >
              <span>{option.label}</span>
              {option.value === value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
