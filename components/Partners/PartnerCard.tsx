'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';
import type { PartnerConfig } from './config';

interface PartnerCardProps {
  partner: PartnerConfig;
  index: number;
  showCategory?: boolean;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({
  partner,
  index,
  showCategory = true,
}) => {
  const [isDark, setIsDark] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Detect dark mode
    const isDarkMode =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(isDarkMode);

    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const logoSrc = isDark ? partner.logo.dark : partner.logo.light;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
        ease: 'easeOut',
      }}
      whileHover={{ scale: 1.05 }}
      className="group relative h-full"
    >
      {/* Glassmorphism Card Container */}
      <div className="relative h-full rounded-2xl overflow-hidden backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-300 p-6 flex flex-col items-center justify-center min-h-[140px]">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-fuchsia-500/20 rounded-2xl" />
        </div>

        {/* Floating animation */}
        <motion.div
          className="relative z-10 flex items-center justify-center h-full w-full"
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 3 + index * 0.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {!imageError ? (
            <div className="relative w-24 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Image
                src={logoSrc}
                alt={partner.name}
                width={96}
                height={64}
                quality={95}
                priority={index < 4}
                loading={index < 4 ? 'eager' : 'lazy'}
                className="object-contain w-full h-full filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            /* Fallback for missing logos */
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 border border-white/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white/60" />
              </div>
              <span className="text-xs font-medium text-white/70 text-center line-clamp-2">
                {partner.name}
              </span>
            </div>
          )}
        </motion.div>

        {/* Verification badge */}
        {partner.isVerified && (
          <motion.div
            className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
          >
            <Badge
              variant="outline"
              className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs"
            >
              Verified
            </Badge>
          </motion.div>
        )}

        {/* Category label */}
        {showCategory && partner.category && (
          <div className="absolute bottom-2 left-2 text-xs text-white/40 group-hover:text-white/60 transition-colors">
            {partner.category}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PartnerCard;
