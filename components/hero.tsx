'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { useState } from 'react'

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')

  const popularSearches = ['PAN Card', 'Aadhaar', 'Insurance', 'GST', 'Ration Card', 'Passport']

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-secondary/5 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Your Trusted
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Digital Service Partner
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              100+ Digital Services • Secure • Fast • Reliable
            </p>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Search for any service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-card border-border text-foreground placeholder-muted-foreground"
                  />
                  <Button
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Popular Searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    className="px-4 py-2 rounded-full border border-border bg-secondary/50 hover:bg-secondary text-sm text-foreground transition"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
              <Link href="#services">
                <Button size="lg" variant="outline">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative hidden md:flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full"></div>
            <div className="relative w-80 h-80 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl border border-border flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary/20 rounded-2xl mx-auto flex items-center justify-center">
                  <div className="text-3xl">🔒</div>
                </div>
                <p className="text-foreground font-semibold">Secure & Fast</p>
                <p className="text-sm text-muted-foreground">Bank-grade security</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
