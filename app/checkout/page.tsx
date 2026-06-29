'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Shield, Clock, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/payment-utils'

export default function CheckoutPage() {
  const supabase = createClient()
  const router = useRouter()
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [services, setServices] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/auth/login')
        return
      }
      setUser(authUser)

      const { data, error: err } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .limit(10)

      if (err) throw err
      setServices(data || [])
    } catch (err) {
      console.error('[v0] Error loading checkout data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handlePlaceOrder() {
    if (!selectedService || !user) {
      setError('Please select a service')
      return
    }

    try {
      setCreating(true)
      setError(null)

      const service = services.find(s => s.id === selectedService)
      if (!service) throw new Error('Service not found')

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          service_id: service.id,
          quantity: 1,
          total_amount: service.price,
          status: 'pending',
        })
        .select()
        .single()

      if (orderError) throw orderError

      router.push(`/payment/${order.id}`)
    } catch (err: any) {
      console.error('[v0] Error creating order:', err)
      setError(err.message || 'Failed to create order')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navigation />
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground">Loading checkout...</p>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const selectedServiceData = services.find(s => s.id === selectedService)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground mb-12">Select a service and proceed to payment</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500">{error}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Service Selection */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card/40 border-card/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Select Service</CardTitle>
                  <CardDescription>Choose a service to proceed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {services.length === 0 ? (
                    <p className="text-muted-foreground">No services available</p>
                  ) : (
                    services.map(service => (
                      <label key={service.id} className="flex items-center p-4 border border-border rounded-lg hover:border-primary/50 cursor-pointer transition">
                        <input
                          type="radio"
                          name="service"
                          value={service.id}
                          checked={selectedService === service.id}
                          onChange={() => setSelectedService(service.id)}
                          className="mr-4 w-5 h-5 accent-primary"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{service.name}</p>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                        <span className="text-xl font-bold text-primary">
                          {formatCurrency(service.price)}
                        </span>
                      </label>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:sticky lg:top-20 h-fit">
              <Card className="bg-card/40 border-card/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedServiceData ? (
                    <div className="space-y-4">
                      <div className="flex justify-between pb-4 border-b border-border">
                        <span className="text-muted-foreground">Service</span>
                        <span className="font-semibold">{selectedServiceData.name}</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-primary text-2xl">
                          {formatCurrency(selectedServiceData.price)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">Select a service to see total</p>
                  )}

                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={!selectedService || creating}
                    className="w-full h-12 text-base"
                  >
                    {creating ? 'Creating Order...' : 'Proceed to Payment'}
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
