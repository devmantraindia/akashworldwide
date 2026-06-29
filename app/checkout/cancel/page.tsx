'use client'

import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation />

      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="w-20 h-20 text-yellow-400" />
          </div>

          <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your payment was cancelled. Don&apos;t worry, your order was not charged. You can try again whenever you&apos;re ready.
          </p>

          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <p className="text-muted-foreground">
              If you need any help or have questions, feel free to contact our support team.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/checkout">
              <Button className="w-full bg-primary hover:bg-primary/90">Try Again</Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" className="w-full">Browse Services</Button>
            </Link>
            <Link href="/dashboard/support">
              <Button variant="outline" className="w-full">Contact Support</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
