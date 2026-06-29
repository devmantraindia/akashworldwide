'use client'

import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation />

      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-20 h-20 text-green-400" />
          </div>

          <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your order has been confirmed. You will receive a confirmation email shortly with all the details.
          </p>

          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-semibold">ORD-2024-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-semibold">Digital Service</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-border">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold text-primary">₹99</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                  Completed
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/dashboard">
              <Button className="w-full bg-primary hover:bg-primary/90">Go to Dashboard</Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" className="w-full">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
