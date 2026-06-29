'use client'

import { useState } from 'react'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Heart, Shield, Clock } from 'lucide-react'

export default function CheckoutPage() {
  const [selectedService, setSelectedService] = useState(null)

  const services = [
    { id: 1, name: 'PAN Card', price: 99, icon: '🎫', description: 'Apply for new PAN' },
    { id: 2, name: 'Aadhaar Update', price: 0, icon: '👤', description: 'Update Aadhaar details' },
    { id: 3, name: 'Passport', price: 2499, icon: '📘', description: 'Passport application' },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground mb-12">Complete your purchase securely</p>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-8">
              {/* Service Selection */}
              <div className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Select Service</h2>
                <div className="space-y-3">
                  {services.map(service => (
                    <label key={service.id} className="flex items-center p-4 border border-border rounded-lg hover:border-primary/50 cursor-pointer transition">
                      <input
                        type="radio"
                        name="service"
                        value={service.id}
                        onChange={() => setSelectedService(service.id)}
                        className="mr-4 w-5 h-5 accent-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{service.icon}</span>
                          <p className="font-semibold">{service.name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      <span className="text-xl font-bold text-primary">
                        {service.price === 0 ? 'Free' : `₹${service.price}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Billing Information */}
              <div className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Billing Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Full Name</label>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Phone Number</label>
                    <Input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-primary rounded-lg cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="mr-4 w-5 h-5 accent-primary" />
                    <span className="font-semibold">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center p-4 border border-border rounded-lg hover:border-primary/50 cursor-pointer transition">
                    <input type="radio" name="payment" className="mr-4 w-5 h-5 accent-primary" />
                    <span className="font-semibold">UPI</span>
                  </label>
                  <label className="flex items-center p-4 border border-border rounded-lg hover:border-primary/50 cursor-pointer transition">
                    <input type="radio" name="payment" className="mr-4 w-5 h-5 accent-primary" />
                    <span className="font-semibold">Net Banking</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:sticky lg:top-20 h-fit">
              <div className="bg-card border border-border rounded-xl p-8 space-y-6">
                <h2 className="text-2xl font-bold">Order Summary</h2>

                {selectedService ? (
                  <div className="space-y-4">
                    <div className="flex justify-between pb-4 border-b border-border">
                      <span className="text-muted-foreground">Service</span>
                      <span className="font-semibold">
                        {services.find(s => s.id === selectedService)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between pb-4 border-b border-border">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-semibold text-primary">
                        ₹{services.find(s => s.id === selectedService)?.price}
                      </span>
                    </div>
                    <div className="flex justify-between pb-4 border-b border-border">
                      <span className="text-muted-foreground">Taxes</span>
                      <span className="font-semibold">₹0</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary text-2xl">
                        ₹{services.find(s => s.id === selectedService)?.price}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">Select a service to see total</p>
                )}

                <Button className="w-full bg-primary hover:bg-primary/90 h-12 text-base" disabled={!selectedService}>
                  Proceed to Payment
                </Button>

                {/* Features */}
                <div className="space-y-3 pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-sm">100% Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-sm">Fast Processing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span className="text-sm">Trusted by 50K+ Users</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
