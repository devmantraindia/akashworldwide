'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, Shield, Zap, Users, TrendingUp, MessageCircle } from 'lucide-react'
import Navigation from '@/components/navigation'
import Hero from '@/components/hero'
import ServicesGrid from '@/components/services-grid'
import Statistics from '@/components/statistics'
import Partners from '@/components/partners'
import Testimonials from '@/components/testimonials'
import BlogSection from '@/components/blog-section'
import CTA from '@/components/cta'
import Footer from '@/components/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <Statistics />
      <ServicesGrid />
      <Testimonials />
      <Partners />
      <BlogSection />
      <CTA />
      <Footer />
    </main>
  )
}
