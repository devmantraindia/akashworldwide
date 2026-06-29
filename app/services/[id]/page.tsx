'use client'

import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Check, Clock, Shield, Users } from 'lucide-react'
import Link from 'next/link'

const serviceDetails = {
  1: {
    name: 'PAN Card',
    icon: '🎫',
    category: 'Documentation',
    price: '₹99',
    rating: 4.8,
    reviews: 1250,
    description: 'Apply for a new PAN card or update existing details with our fast and secure process',
    longDescription: 'Get your Permanent Account Number (PAN) card quickly and securely. Our service helps you apply for a new PAN card, update your details, or resolve any PAN-related issues.',
    features: [
      'Quick processing within 24-48 hours',
      'Government-approved service',
      'Digital document submission',
      'Video verification available',
      'Lifetime validity',
      'Tax filing eligibility'
    ],
    requirements: [
      'Valid identification proof (Aadhaar/Voter ID/License)',
      'Address proof (Passport/Utility Bill)',
      'Recent passport size photograph',
      'Email address and phone number',
      'PAN application form (ITR-1)'
    ],
    processingTime: '24-48 hours',
    validity: 'Lifetime',
    steps: [
      { number: 1, title: 'Upload Documents', description: 'Submit your identity and address proof' },
      { number: 2, title: 'Verification', description: 'Our team verifies your documents' },
      { number: 3, title: 'Payment', description: 'Complete the payment process' },
      { number: 4, title: 'Delivery', description: 'Receive your PAN card at your doorstep' }
    ]
  },
  2: {
    name: 'Aadhaar Services',
    icon: '👤',
    category: 'Identification',
    price: '₹0',
    rating: 4.9,
    reviews: 3450,
    description: 'Enroll, update, or download your Aadhaar card easily',
    longDescription: 'Complete Aadhaar services including new enrollment, update of address/name, mobile number linking, and Aadhaar download.',
    features: [
      'Free Aadhaar enrollment',
      'Update demographic details',
      'Link mobile number',
      'Download e-Aadhaar',
      'Address change facility',
      'Biometric updates'
    ],
    requirements: [
      'Proof of identity',
      'Proof of address',
      'Date of birth document',
      'Passport size photographs'
    ],
    processingTime: '30 days',
    validity: 'Lifetime',
    steps: [
      { number: 1, title: 'Enrollment', description: 'Register at nearest enrollment center' },
      { number: 2, title: 'Biometric Capture', description: 'Fingerprint and iris scanning' },
      { number: 3, title: 'Verification', description: 'Details verification process' },
      { number: 4, title: 'Card Delivery', description: 'Receive Aadhaar card by mail' }
    ]
  }
}

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const service = (serviceDetails as any)[params.id] || serviceDetails[1 as keyof typeof serviceDetails]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/services" className="text-primary hover:text-accent text-sm mb-8 inline-flex items-center gap-1">
            ← Back to Services
          </Link>

          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-6xl">{service.icon}</div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{service.name}</h1>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-primary font-semibold">{service.rating} ⭐ ({service.reviews} reviews)</span>
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full">{service.category}</span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-muted-foreground mb-8">{service.longDescription}</p>

              {/* Key Features */}
              <div className="bg-secondary/50 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {service.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-8">How It Works</h2>
                <div className="grid md:grid-cols-4 gap-4">
                  {service.steps.map((step: any, i: number) => (
                    <div key={i} className="relative">
                      <div className="bg-card border-2 border-primary rounded-xl p-6 text-center">
                        <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                          {step.number}
                        </div>
                        <h3 className="font-semibold mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      {i < service.steps.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-full text-2xl text-primary">→</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Requirements</h2>
                <ul className="space-y-3">
                  {service.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span className="text-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-card border border-border rounded-xl p-8 sticky top-32 space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Price</p>
                  <h3 className="text-4xl font-bold text-primary">{service.price}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Processing Time</p>
                      <p className="font-semibold">{service.processingTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Validity</p>
                      <p className="font-semibold">{service.validity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Users</p>
                      <p className="font-semibold">{(service.reviews / 100).toFixed(0)}K+</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6 space-y-3">
                  <Link href="/auth/signup">
                    <Button className="w-full bg-primary hover:bg-primary/90">Get Started Now</Button>
                  </Link>
                  <Button variant="outline" className="w-full">Contact Support</Button>
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
