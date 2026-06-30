'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-center gap-1', className)} {...props} />
  )
);
Pagination.displayName = 'Pagination';

interface PaginationItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

const PaginationItem = React.forwardRef<HTMLButtonElement, PaginationItemProps>(
  ({ className, isActive, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10 border border-input hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-primary text-primary-foreground hover:bg-primary/90',
        className
      )}
      {...props}
    />
  )
);
PaginationItem.displayName = 'PaginationItem';

export { Pagination, PaginationItem };
