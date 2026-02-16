import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const TextareaInternal = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[120px] w-full rounded-lg border-2 bg-white px-4 py-3 text-body font-sans text-neutral-900 transition-colors placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-error-500 focus-visible:ring-error-500'
            : 'border-neutral-300 hover:border-neutral-400',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
TextareaInternal.displayName = 'Textarea';

export const Textarea = TextareaInternal as React.FC<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
