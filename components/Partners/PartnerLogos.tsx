/**
 * Premium Partners Logo Section
 * Displays partner logos with glassmorphism, animations, and responsive design
 * Inspired by Apple, Stripe, Linear, Vercel enterprise UI patterns
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  slug: string;
  logo: {
    light: string;
    dark: string;
  };
  category?: string;
  isVerified?: boolean;
}

interface PartnerLogosProps {
  partners?: Partner[];
  autoplay?: boolean;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
}

// Default partner configuration
const DEFAULT_PARTNERS: Partner[] = [
  {
    id: 'csc',
    name: 'CSC',
    slug: 'csc',
    logo: {
      light: '/partners/csc-light.svg',
      dark: '/partners/csc-dark.svg',
    },
    category: 'Government',
    isVerified: true,
  },
  {
    id: 'uidai',
    name: 'UIDAI',
    slug: 'uidai',
    logo: {
      light: '/partners/uidai-light.svg',
      dark: '/partners/uidai-dark.svg',
    },
    category: 'Government',
    isVerified: true,
  },
  {
    id: 'digilocker',
    name: 'DigiLocker',
    slug: 'digilocker',
    logo: {
      light: '/partners/digilocker-light.svg',
      dark: '/partners/digilocker-dark.svg',
    },
    category: 'Government',
    isVerified: true,
  },
  {
    id: 'protean',
    name: 'Protean',
    slug: 'protean',
    logo: {
      light: '/partners/protean-light.svg',
      dark: '/partners/protean-dark.svg',
    },
    category: 'Technology',
    isVerified: true,
  },
  {
    id: 'utiitsl',
    name: 'UTIITSL',
    slug: 'utiitsl',
    logo: {
      light: '/partners/utiitsl-light.svg',
      dark: '/partners/utiitsl-dark.svg',
    },
    category: 'Infrastructure',
    isVerified: true,
  },
  {
    id: 'passport-seva',
    name: 'Passport Seva',
    slug: 'passport-seva',
    logo: {
      light: '/partners/passport-seva-light.svg',
      dark: '/partners/passport-seva-dark.svg',
    },
    category: 'Government',
    isVerified: true,
  },
  {
    id: 'npci',
    name: 'NPCI',
    slug: 'npci',
    logo: {
      light: '/partners/npci-light.svg',
      dark: '/partners/npci-dark.svg',
    },
    category: 'Financial',
    isVerified: true,
  },
  {
    id: 'bbps',
    name: 'BBPS',
    slug: 'bbps',
    logo: {
      light: '/partners/bbps-light.svg',
      dark: '/partners/bbps-dark.svg',
    },
    category: 'Financial',
    isVerified: true,
  },
  {
    id: 'irctc',
    name: 'IRCTC',
    slug: 'irctc',
    logo: {
      light: '/partners/irctc-light.svg',
      dark: '/partners/irctc-dark.svg',
    },
    category: 'Transportation',
    isVerified: true,
  },
  {
    id: 'lic',
    name: 'LIC',
    slug: 'lic',
    logo: {
      light: '/partners/lic-light.svg',
      dark: '/partners/lic-dark.svg',
    },
    category: 'Financial',
    isVerified: true,
  },
  {
    id: 'sbi',
    name: 'SBI',
    slug: 'sbi',
    logo: {
      light: '/partners/sbi-light.svg',
      dark: '/partners/sbi-dark.svg',
    },
    category: 'Financial',
    isVerified: true,
  },
  {
    id: 'ippb',
    name: 'IPPB',
    slug: 'ippb',
    logo: {
      light: '/partners/ippb-light.svg',
      dark: '/partners/ippb-dark.svg',
    },
    category: 'Financial',
    isVerified: true,
  },
  {
    id: 'gst',
    name: 'GST',
    slug: 'gst',
    logo: {
      light: '/partners/gst-light.svg',
      dark: '/partners/gst-dark.svg',
    },
    category: 'Government',
    isVerified: true,
  },
  {
    id: 'income-tax',
    name: 'Income Tax',
    slug: 'income-tax',
    logo: {
      light: '/partners/income-tax-light.svg',
      dark: '/partners/income-tax-dark.svg',
    },
    category: 'Government',
    isVerified: true,
  },
  {
    id: 'pm-kisan',
    name: 'PM Kisan',
    slug: 'pm-kisan',
    logo: {
      light: '/partners/pm-kisan-light.svg',
      dark: '/partners/pm-kisan-dark.svg',
    },
    category: 'Government',
    isVerified: true,
  },
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat',
    slug: 'ayushman-bharat',
    logo: {
      light: '/partners/ayushman-bharat-light.svg',
      dark: '/partners/ayushman-bharat-dark.svg',
    },
    category: 'Health',
    isVerified: true,
  },
  {
    id: 'national-insurance',
    name: 'National Insurance',
    slug: 'national-insurance',
    logo: {
      light: '/partners/national-insurance-light.svg',
      dark: '/partners/national-insurance-dark.svg',
    },
    category: 'Financial',
    isVerified: true,
  },
  {
    id: 'new-india-assurance',
    name: 'New India Assurance',
    slug: 'new-india-assurance',
    logo: {
      light: '/partners/new-india-assurance-light.svg',
      dark: '/partners/new-india-assurance-dark.svg',
    },
    category: 'Financial',
    isVerified: true,
  },
  {
    id: 'united-india-insurance',
    name: 'United India Insurance',
    slug: 'united-india-insurance',
    logo: {
      light: '/partners/united-india-insurance-light.svg',
      dark: '/partners/united-india-insurance-dark.svg',
    },
    category: 'Financial',
    isVerified: true,
  },
  {
    id: 'oriental-insurance',
    name: 'Oriental Insurance',
    slug: 'oriental-insurance',
    logo: {
      light: '/partners/oriental-insurance-light.svg',
      dark: '/partners/oriental-insurance-dark.svg',
    },
    category: 'Financial',
    isVerified: true,
  },
];

/**
 * Individual Partner Logo Card with hover animations
 */
const PartnerCard: React.FC<{ partner: Partner; index: number }> = ({ partner, index }) => {
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
      key={partner.id}
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
        {partner.category && (
          <div className="absolute bottom-2 left-2 text-xs text-white/40 group-hover:text-white/60 transition-colors">
            {partner.category}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Main Partners Showcase Component
 */
export const PartnerLogos: React.FC<PartnerLogosProps> = ({
  partners = DEFAULT_PARTNERS,
  autoplay = true,
  pauseOnHover = true,
  direction = 'left',
}) => {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate partners for seamless loop
  const loopedPartners = useMemo(() => [...partners, ...partners], [partners]);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Section Header */}
      <div className="container mx-auto px-4 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4 border-white/10 text-white/80">
            Trusted Partners
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Powered by India's <span className="gradient-text">leading institutions</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            We partner with verified government agencies, financial institutions, and service
            providers to deliver secure and seamless experiences.
          </p>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div
        className="relative"
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        {/* Gradient masks for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

        {/* Scrolling Container */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-4 md:gap-6 pb-4"
            animate={{ x: direction === 'left' ? '-50%' : '50%' }}
            transition={{
              duration: autoplay && !isPaused ? 60 : 0,
              repeat: autoplay && !isPaused ? Infinity : 0,
              ease: 'linear',
            }}
          >
            {loopedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${Math.floor(index / partners.length)}`}
                className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
              >
                <PartnerCard partner={partner} index={index} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Grid View - Alternative Display (visible on larger screens) */}
      <div className="container mx-auto px-4 mt-16 hidden lg:block">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {partners.map((partner, index) => (
            <PartnerCard key={partner.id} partner={partner} index={index} />
          ))}
        </div>
      </div>

      {/* Autoplay controls info */}
      {autoplay && (
        <div className="container mx-auto px-4 mt-8 text-center">
          <p className="text-sm text-white/50">
            {pauseOnHover ? '⏸ Hover to pause' : 'Auto-scrolling infinite carousel'} • 20+ verified
            partners
          </p>
        </div>
      )}
    </section>
  );
};

export default PartnerLogos;
