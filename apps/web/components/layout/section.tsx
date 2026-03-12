import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'white' | 'neutral' | 'dark' | 'transparent';
  as?: 'section' | 'div' | 'article';
}

const spacingClasses = {
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-24 md:py-32',
};

const backgroundClasses = {
  white: 'bg-white',
  neutral: 'bg-neutral-50',
  dark: 'bg-neutral-900 text-white',
  transparent: '',
};

export function Section({
  children,
  className,
  spacing = 'lg',
  background = 'transparent',
  as: Tag = 'section',
}: SectionProps) {
  return (
    <Tag className={cn(spacingClasses[spacing], backgroundClasses[background], className)}>
      {children}
    </Tag>
  );
}
