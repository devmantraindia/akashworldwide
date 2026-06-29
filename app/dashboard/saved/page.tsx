'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SavedPage() {
  const saved = [
    { name: 'PAN Card', icon: '🎫', price: '₹99' },
    { name: 'Aadhaar Services', icon: '👤', price: '₹0' },
    { name: 'Insurance', icon: '🛡️', price: 'Varies' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Saved Services</h1>
        <p className="text-muted-foreground">Your favorite services for quick access</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {saved.map(service => (
          <div key={service.name} className="bg-card border border-border rounded-xl p-6">
            <div className="text-5xl mb-4">{service.icon}</div>
            <h3 className="font-semibold text-lg mb-4">{service.name}</h3>
            <div className="flex justify-between items-center">
              <span className="font-bold text-primary">{service.price}</span>
              <Link href="/services">
                <Button size="sm">View</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
