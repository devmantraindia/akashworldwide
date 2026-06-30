'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'info' | 'warning';
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-background text-foreground border border-border',
      destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/10',
      info: 'border-blue-500/50 text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/50',
      warning: 'border-yellow-500/50 text-yellow-700 dark:text-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/50',
    };

    return (
      <div ref={ref} className={cn('relative w-full rounded-lg border p-4', variants[variant], className)} {...props} />
    );
  }
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>
  (({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn('mb-1 font-medium leading-tight tracking-tight', className)} {...props} />
  ));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>
  (({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
  ));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
