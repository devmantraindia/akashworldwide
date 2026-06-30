'use client';
import { Badge } from '@/components/ui/badge';

export const STATUS_COLORS = {
  PENDING: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  VERIFICATION: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  PROCESSING: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  APPROVED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  COMPLETED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  REJECTED: 'bg-red-500/15 text-red-300 border-red-500/30',
};

export function StatusBadge({ status }) {
  return <Badge variant="outline" className={STATUS_COLORS[status] || 'border-white/10'}>{status}</Badge>;
}

export function PageHeader({ title, highlight, subtitle, children }) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-pretty">{title} <span className="gradient-text">{highlight}</span></h1>
        {subtitle && <p className="text-white/60 mt-1 text-sm">{subtitle}</p>}
      </div>
      {children && <div className="flex gap-2 flex-wrap items-center">{children}</div>}
    </div>
  );
}
