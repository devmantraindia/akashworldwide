'use client'

import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const allServices = [
  { id: 1, name: 'PAN Card', icon: '🎫', category: 'Documentation', price: '₹99', description: 'Apply for a new PAN card or update existing details' },
  { id: 2, name: 'Aadhaar Services', icon: '👤', category: 'Identification', price: '₹0', description: 'Enroll, update, or download Aadhaar card' },
  { id: 3, name: 'Voter ID', icon: '🗳️', category: 'Voting', price: '₹49', description: 'Register to vote and get your voter ID' },
  { id: 4, name: 'Driving License', icon: '🚗', category: 'Transportation', price: '₹299', description: 'Apply for DL, renew, or learn driving' },
  { id: 5, name: 'Passport', icon: '📘', category: 'Travel', price: '₹2499', description: 'Apply for passport or get passport related services' },
  { id: 6, name: 'Ration Card', icon: '🃏', category: 'Benefits', price: '₹149', description: 'Apply for or renew your ration card' },
  { id: 7, name: 'GST Registration', icon: '💼', category: 'Business', price: '₹499', description: 'Register your business for GST compliance' },
  { id: 8, name: 'Income Tax', icon: '📊', category: 'Taxation', price: '₹999', description: 'File income tax returns or get tax consultation' },
  { id: 9, name: 'E-Shram Card', icon: '💳', category: 'Labor', price: '₹0', description: 'Register as an unorganized worker' },
  { id: 10, name: 'Ayushman Card', icon: '🏥', category: 'Health', price: '₹199', description: 'Register for health insurance scheme' },
  { id: 11, name: 'Bank Account', icon: '🏦', category: 'Banking', price: '₹0', description: 'Open a new bank account online' },
  { id: 12, name: 'AEPS', icon: '👆', category: 'Banking', price: '₹10', description: 'Cash withdrawal using Aadhaar' },
  { id: 13, name: 'Money Transfer', icon: '💸', category: 'Finance', price: 'Varies', description: 'Send money domestically or internationally' },
  { id: 14, name: 'Bill Payments', icon: '📱', category: 'Utilities', price: 'Varies', description: 'Pay electricity, water, gas and other bills' },
  { id: 15, name: 'Mobile Recharge', icon: '📲', category: 'Utilities', price: 'Varies', description: 'Recharge your mobile with any operator' },
  { id: 16, name: 'DTH Recharge', icon: '📺', category: 'Entertainment', price: 'Varies', description: 'Recharge your DTH service' },
  { id: 17, name: 'Insurance', icon: '🛡️', category: 'Insurance', price: 'Varies', description: 'Health, life, or vehicle insurance plans' },
  { id: 18, name: 'Mutual Fund', icon: '📈', category: 'Investment', price: 'Varies', description: 'Invest in mutual funds for wealth creation' },
  { id: 19, name: 'Loan Services', icon: '💰', category: 'Loans', price: 'Varies', description: 'Personal, business, or home loans' },
  { id: 20, name: 'Travel Booking', icon: '✈️', category: 'Travel', price: 'Varies', description: 'Book flights, hotels, and travel packages' },
]

const categories = ['All', ...Array.from(new Set(allServices.map(s => s.category)))]

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredServices = allServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">All Services</h1>
            <p className="text-lg text-muted-foreground">Explore our complete catalog of digital services</p>
          </div>

          {/* Search and Filter */}
          <div className="space-y-6 mb-12">
            {/* Search Bar */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card border-border text-foreground placeholder-muted-foreground pr-12"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 text-foreground border border-border hover:border-primary/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div>
            <p className="text-sm text-muted-foreground mb-4">{filteredServices.length} services found</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <Link key={service.id} href={`/services/${service.id}`}>
                  <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition group">
                    <div className="text-5xl mb-4">{service.icon}</div>
                    <div className="space-x-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                        {service.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">{service.price}</span>
                      <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No services found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
