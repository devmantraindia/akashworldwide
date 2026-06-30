'use client';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function PageHeader({ badge, title, highlight, subtitle, children }) {
  return (
    <section className="pt-32 pb-12 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        {badge && <Badge variant="outline" className="mb-4 border-white/10">{badge}</Badge>}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-5 text-balance">
          {title} {highlight && <span className="gradient-text">{highlight}</span>}
        </h1>
        {subtitle && <p className="text-lg text-white/70 leading-relaxed text-pretty">{subtitle}</p>}
        {children}
      </motion.div>
    </section>
  );
}
