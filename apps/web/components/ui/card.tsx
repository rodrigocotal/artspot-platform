import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardInternal = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover',
        className
      )}
      {...props}
    />
  )
);
CardInternal.displayName = 'Card';

export const Card = CardInternal as React.FC<CardProps & React.RefAttributes<HTMLDivElement>>;

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeaderInternal = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);
CardHeaderInternal.displayName = 'CardHeader';

export const CardHeader = CardHeaderInternal as React.FC<CardHeaderProps & React.RefAttributes<HTMLDivElement>>;

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitleInternal = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-serif text-heading-4 text-neutral-900', className)}
      {...props}
    />
  )
);
CardTitleInternal.displayName = 'CardTitle';

export const CardTitle = CardTitleInternal as React.FC<CardTitleProps & React.RefAttributes<HTMLHeadingElement>>;

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescriptionInternal = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-body text-neutral-600', className)}
    {...props}
  />
));
CardDescriptionInternal.displayName = 'CardDescription';

export const CardDescription = CardDescriptionInternal as React.FC<CardDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContentInternal = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContentInternal.displayName = 'CardContent';

export const CardContent = CardContentInternal as React.FC<CardContentProps & React.RefAttributes<HTMLDivElement>>;

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooterInternal = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);
CardFooterInternal.displayName = 'CardFooter';

export const CardFooter = CardFooterInternal as React.FC<CardFooterProps & React.RefAttributes<HTMLDivElement>>;
