'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const partners = [
  { name: 'CSC', logo: 'CSC' },
  { name: 'Digital Seva', logo: 'DS' },
  { name: 'UTITSl', logo: 'UTITSL' },
  { name: 'Protean', logo: '🔒' },
  { name: 'NSDL', logo: 'NSDL' },
  { name: 'IRCIC', logo: 'IRCIC' },
  { name: 'LIC', logo: 'LIC' },
  { name: 'SBI', logo: 'SBI' },
]

export default function Partners() {
  return (
    <section id="partners" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">Our Trusted Partners</h2>
            <p className="text-muted-foreground">Partnering with India&apos;s leading organizations</p>
          </div>
          <Link href="#" className="text-primary hover:text-accent flex items-center gap-2 text-sm hidden md:flex">
            View All Partners <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="bg-card border border-border rounded-lg p-8 flex items-center justify-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition">{partner.logo}</div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition">
                  {partner.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
