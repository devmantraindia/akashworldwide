'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const services = [
  { id: 1, name: 'PAN Card', icon: '🎫', color: '#A855F7' },
  { id: 2, name: 'Aadhaar Services', icon: '👤', color: '#06D6A0' },
  { id: 3, name: 'Voter ID', icon: '🗳️', color: '#118AB2' },
  { id: 4, name: 'Driving License', icon: '🚗', color: '#A855F7' },
  { id: 5, name: 'Passport', icon: '📘', color: '#06D6A0' },
  { id: 6, name: 'Ration Card', icon: '🃏', color: '#118AB2' },
  { id: 7, name: 'GST Registration', icon: '💼', color: '#A855F7' },
  { id: 8, name: 'Income Tax', icon: '📊', color: '#06D6A0' },
  { id: 9, name: 'E-Shram Card', icon: '💳', color: '#118AB2' },
  { id: 10, name: 'Ayushman Card', icon: '🏥', color: '#A855F7' },
  { id: 11, name: 'Bank Account', icon: '🏦', color: '#06D6A0' },
  { id: 12, name: 'AEPS', icon: '👆', color: '#118AB2' },
  { id: 13, name: 'Money Transfer', icon: '💸', color: '#A855F7' },
  { id: 14, name: 'Bill Payments', icon: '📱', color: '#06D6A0' },
  { id: 15, name: 'Mobile Recharge', icon: '📲', color: '#118AB2' },
  { id: 16, name: 'DTH Recharge', icon: '📺', color: '#A855F7' },
  { id: 17, name: 'Insurance', icon: '🛡️', color: '#06D6A0' },
  { id: 18, name: 'Mutual Fund', icon: '📈', color: '#118AB2' },
  { id: 19, name: 'Loan Services', icon: '💰', color: '#A855F7' },
  { id: 20, name: 'More Services', icon: '➕', color: '#06D6A0' },
]

export default function ServicesGrid() {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">Our Digital Services</h2>
            <p className="text-muted-foreground">100+ Services Available</p>
          </div>
          <Link href="#services">
            <Button variant="outline" className="hidden sm:flex">
              View All Services <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {services.map((service) => (
            <Link key={service.id} href={`/services/${service.id}`}>
              <div className="group relative bg-card hover:bg-secondary border border-border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
                <div className="relative">
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition">
                    {service.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">Click to learn more</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
