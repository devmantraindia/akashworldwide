/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    dynamicIO: true,
  },
  onDemandEntries: {
    maxInactiveAge: 15000,
    pagesBufferLength: 2,
  },
  staticExportDynamicRoutes: false,
  // Skip static generation for admin and payment routes
  excludeDefaultMomentLocales: true,
}

export default nextConfig
