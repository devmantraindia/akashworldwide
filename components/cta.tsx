'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-2xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 blur-3xl"></div>
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of users who trust us for their digital services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Create Account Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="#services">
                <Button size="lg" variant="outline">
                  Explore Services
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • Instant verification • 24/7 Support
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
