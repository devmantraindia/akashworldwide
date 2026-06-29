'use client'

import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, User, Share2, ArrowLeft } from 'lucide-react'

const blogPosts = {
  1: {
    title: 'PM Kisan Yojana 2024 - How to Apply Online & Check Status',
    category: 'Government Schemes',
    date: '2024-06-27',
    author: 'Admin',
    readTime: '5 min read',
    image: '📄',
    content: `
      The PM Kisan Yojana is one of India's most important government schemes aimed at providing financial support to farmers. 
      In this comprehensive guide, we'll walk you through the entire process of applying for the scheme and checking your application status.

      ## What is PM Kisan Yojana?

      The Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) scheme is a central government initiative that provides direct income support to farmers.
      Under this scheme, eligible farmers receive ₹6,000 per annum in three installments of ₹2,000 each.

      ## Eligibility Criteria

      - Indian citizen farmers
      - Annual household income up to ₹1.5 lakh
      - Must own cultivable land
      - Not a public servant or income tax assessee

      ## Required Documents

      - Aadhaar Card
      - Land ownership documents
      - Bank account details (with IFSC code)
      - Mobile number linked to Aadhaar

      ## Step-by-Step Application Process

      1. Visit the official PM Kisan portal
      2. Click on "Farmer Corner"
      3. Select "New Farmer Registration"
      4. Fill in your basic details
      5. Upload required documents
      6. Submit and get your reference number

      ## How to Check Application Status

      Visit pm-kisan.gov.in and enter your Aadhaar number to track your application status in real-time.

      The scheme has benefited millions of farmers across India and continues to be an important support system for the agricultural community.
    `,
  },
  2: {
    title: 'Benefits of Digital Services in Daily Life',
    category: 'Digital India',
    date: '2024-06-25',
    author: 'Admin',
    readTime: '7 min read',
    image: '💡',
    content: `
      Digital services have transformed the way we live, work, and interact. From banking to education, healthcare to governance,
      these services have made our lives easier and more efficient.

      ## Key Benefits of Digital Services

      ### Accessibility
      With digital services, anyone can access services from anywhere, anytime. No need to visit government offices or banks physically.

      ### Time Saving
      Processes that took days can now be completed in minutes. Online applications eliminate waiting times and queues.

      ### Cost Reduction
      Digital services reduce operational costs and pass on the savings to consumers through lower fees and charges.

      ### Security
      Modern digital services employ advanced security measures to protect your personal and financial information.

      ### Transparency
      Track your applications and transactions in real-time with complete transparency about the status and progress.

      ## Digital Services We Offer

      We provide over 100 different digital services including:
      - Document processing (PAN, Aadhaar, Passport)
      - Financial services (banking, loans, insurance)
      - Utility payments and recharges
      - Government scheme applications

      ## The Future of Digital Services

      As technology continues to evolve, we expect even more innovative services to emerge. The integration of AI, blockchain,
      and IoT will further enhance the quality and efficiency of digital services.

      Digital transformation is not just about technology—it's about creating a better, more accessible world for everyone.
    `,
  },
}

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const post = (blogPosts as any)[params.id] || blogPosts[1 as keyof typeof blogPosts]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link href="/blog" className="text-primary hover:text-accent inline-flex items-center gap-1 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="inline-block mb-4">
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {post.date}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                By {post.author}
              </div>
              <span className="text-sm">{post.readTime}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-12 text-center mb-12">
            <div className="text-9xl">{post.image}</div>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-12">
            <div className="text-foreground space-y-6">
              {post.content.split('\n\n').map((paragraph: string, i: number) => {
                if (paragraph.startsWith('##')) {
                  return (
                    <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-primary">
                      {paragraph.replace('##', '').trim()}
                    </h2>
                  )
                } else if (paragraph.startsWith('###')) {
                  return (
                    <h3 key={i} className="text-xl font-semibold mt-6 mb-3">
                      {paragraph.replace('###', '').trim()}
                    </h3>
                  )
                } else if (paragraph.trim().startsWith('-')) {
                  return (
                    <ul key={i} className="list-disc list-inside space-y-2">
                      {paragraph.split('\n').map((item: string, j: number) => (
                        <li key={j} className="text-muted-foreground">{item.replace('-', '').trim()}</li>
                      ))}
                    </ul>
                  )
                } else if (paragraph.match(/^\d+\./)) {
                  return (
                    <ol key={i} className="list-decimal list-inside space-y-2">
                      {paragraph.split('\n').map((item: string, j: number) => (
                        <li key={j} className="text-muted-foreground">{item.replace(/^\d+\./, '').trim()}</li>
                      ))}
                    </ol>
                  )
                } else {
                  return (
                    <p key={i} className="text-muted-foreground leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  )
                }
              })}
            </div>
          </div>

          {/* Share and Actions */}
          <div className="border-t border-b border-border py-6 mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="font-semibold">Share this article:</span>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to explore these services?</h2>
            <p className="text-muted-foreground mb-6">
              Check out our complete catalog of digital services and get started today.
            </p>
            <Link href="/services">
              <Button className="bg-primary hover:bg-primary/90">Browse Services</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
