import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const LabelInternal = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-body-sm font-sans font-medium text-neutral-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-error-500">*</span>}
    </label>
  )
);
LabelInternal.displayName = 'Label';

export const Label = LabelInternal as React.FC<LabelProps & React.RefAttributes<HTMLLabelElement>>;
