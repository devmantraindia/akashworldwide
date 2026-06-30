/**
 * Partner Configuration Database Schema
 * Can be replaced with CMS/database queries
 */

export interface PartnerConfig {
  id: string;
  name: string;
  slug: string;
  logo: {
    light: string;
    dark: string;
  };
  category: string;
  isVerified: boolean;
  description?: string;
  website?: string;
  metadata?: Record<string, any>;
}

/**
 * All partners with categorization
 * This can be moved to your database/CMS
 */
export const PARTNERS_CONFIG: PartnerConfig[] = [
  // Government
  {
    id: 'csc',
    name: 'CSC',
    slug: 'csc',
    category: 'Government',
    isVerified: true,
    logo: {
      light: '/partners/csc-light.svg',
      dark: '/partners/csc-dark.svg',
    },
    description: 'Common Service Centers - Digital India Initiative',
  },
  {
    id: 'uidai',
    name: 'UIDAI',
    slug: 'uidai',
    category: 'Government',
    isVerified: true,
    logo: {
      light: '/partners/uidai-light.svg',
      dark: '/partners/uidai-dark.svg',
    },
    description: 'Unique Identification Authority of India - Aadhaar',
  },
  {
    id: 'digilocker',
    name: 'DigiLocker',
    slug: 'digilocker',
    category: 'Government',
    isVerified: true,
    logo: {
      light: '/partners/digilocker-light.svg',
      dark: '/partners/digilocker-dark.svg',
    },
    description: 'Digital Repository of Official Documents',
  },
  {
    id: 'passport-seva',
    name: 'Passport Seva',
    slug: 'passport-seva',
    category: 'Government',
    isVerified: true,
    logo: {
      light: '/partners/passport-seva-light.svg',
      dark: '/partners/passport-seva-dark.svg',
    },
    description: 'Ministry of External Affairs - Passport Services',
  },
  {
    id: 'gst',
    name: 'GST',
    slug: 'gst',
    category: 'Government',
    isVerified: true,
    logo: {
      light: '/partners/gst-light.svg',
      dark: '/partners/gst-dark.svg',
    },
    description: 'Goods and Services Tax Network',
  },
  {
    id: 'income-tax',
    name: 'Income Tax',
    slug: 'income-tax',
    category: 'Government',
    isVerified: true,
    logo: {
      light: '/partners/income-tax-light.svg',
      dark: '/partners/income-tax-dark.svg',
    },
    description: 'Department of Revenue - Income Tax',
  },
  {
    id: 'pm-kisan',
    name: 'PM Kisan',
    slug: 'pm-kisan',
    category: 'Government',
    isVerified: true,
    logo: {
      light: '/partners/pm-kisan-light.svg',
      dark: '/partners/pm-kisan-dark.svg',
    },
    description: 'Pradhan Mantri Kisan Samman Nidhi Scheme',
  },

  // Financial & Banking
  {
    id: 'npci',
    name: 'NPCI',
    slug: 'npci',
    category: 'Financial',
    isVerified: true,
    logo: {
      light: '/partners/npci-light.svg',
      dark: '/partners/npci-dark.svg',
    },
    description: 'National Payments Corporation of India',
  },
  {
    id: 'bbps',
    name: 'BBPS',
    slug: 'bbps',
    category: 'Financial',
    isVerified: true,
    logo: {
      light: '/partners/bbps-light.svg',
      dark: '/partners/bbps-dark.svg',
    },
    description: 'Bharat Bill Payment System',
  },
  {
    id: 'sbi',
    name: 'SBI',
    slug: 'sbi',
    category: 'Financial',
    isVerified: true,
    logo: {
      light: '/partners/sbi-light.svg',
      dark: '/partners/sbi-dark.svg',
    },
    description: 'State Bank of India',
  },
  {
    id: 'lic',
    name: 'LIC',
    slug: 'lic',
    category: 'Financial',
    isVerified: true,
    logo: {
      light: '/partners/lic-light.svg',
      dark: '/partners/lic-dark.svg',
    },
    description: 'Life Insurance Corporation of India',
  },
  {
    id: 'ippb',
    name: 'IPPB',
    slug: 'ippb',
    category: 'Financial',
    isVerified: true,
    logo: {
      light: '/partners/ippb-light.svg',
      dark: '/partners/ippb-dark.svg',
    },
    description: 'India Post Payments Bank',
  },
  {
    id: 'national-insurance',
    name: 'National Insurance',
    slug: 'national-insurance',
    category: 'Financial',
    isVerified: true,
    logo: {
      light: '/partners/national-insurance-light.svg',
      dark: '/partners/national-insurance-dark.svg',
    },
    description: 'National Insurance Company Limited',
  },
  {
    id: 'new-india-assurance',
    name: 'New India Assurance',
    slug: 'new-india-assurance',
    category: 'Financial',
    isVerified: true,
    logo: {
      light: '/partners/new-india-assurance-light.svg',
      dark: '/partners/new-india-assurance-dark.svg',
    },
    description: 'New India Assurance Company',
  },
  {
    id: 'united-india-insurance',
    name: 'United India Insurance',
    slug: 'united-india-insurance',
    category: 'Financial',
    isVerified: true,
    logo: {
      light: '/partners/united-india-insurance-light.svg',
      dark: '/partners/united-india-insurance-dark.svg',
    },
    description: 'United India Insurance Company',
  },
  {
    id: 'oriental-insurance',
    name: 'Oriental Insurance',
    slug: 'oriental-insurance',
    category: 'Financial',
    isVerified: true,
    logo: {
      light: '/partners/oriental-insurance-light.svg',
      dark: '/partners/oriental-insurance-dark.svg',
    },
    description: 'Oriental Insurance Company',
  },

  // Infrastructure & Transport
  {
    id: 'utiitsl',
    name: 'UTIITSL',
    slug: 'utiitsl',
    category: 'Infrastructure',
    isVerified: true,
    logo: {
      light: '/partners/utiitsl-light.svg',
      dark: '/partners/utiitsl-dark.svg',
    },
    description: 'UTIITSL - Information Technology Services',
  },
  {
    id: 'irctc',
    name: 'IRCTC',
    slug: 'irctc',
    category: 'Transportation',
    isVerified: true,
    logo: {
      light: '/partners/irctc-light.svg',
      dark: '/partners/irctc-dark.svg',
    },
    description: 'Indian Railway Catering and Tourism Corporation',
  },

  // Technology
  {
    id: 'protean',
    name: 'Protean',
    slug: 'protean',
    category: 'Technology',
    isVerified: true,
    logo: {
      light: '/partners/protean-light.svg',
      dark: '/partners/protean-dark.svg',
    },
    description: 'Leading Digital Payment Solutions Provider',
  },

  // Health
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat',
    slug: 'ayushman-bharat',
    category: 'Health',
    isVerified: true,
    logo: {
      light: '/partners/ayushman-bharat-light.svg',
      dark: '/partners/ayushman-bharat-dark.svg',
    },
    description: 'National Health Protection Scheme',
  },
];

/**
 * Get partners by category
 */
export function getPartnersByCategory(category: string): PartnerConfig[] {
  return PARTNERS_CONFIG.filter((p) => p.category === category);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(PARTNERS_CONFIG.map((p) => p.category)));
}

/**
 * Get partner by slug
 */
export function getPartnerBySlug(slug: string): PartnerConfig | undefined {
  return PARTNERS_CONFIG.find((p) => p.slug === slug);
}
