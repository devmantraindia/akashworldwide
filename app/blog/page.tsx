'use client'

import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, ArrowRight, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const blogPosts = [
  {
    id: 1,
    title: 'PM Kisan Yojana 2024 - How to Apply Online & Check Status',
    excerpt: 'Complete guide to apply for PM Kisan Yojana and check your application status online.',
    content: 'Detailed content about PM Kisan Yojana benefits, eligibility, and application process...',
    category: 'Government Schemes',
    date: '2024-06-27',
    author: 'Admin',
    image: '📄',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Benefits of Digital Services in Daily Life',
    excerpt: 'Discover how digital services are revolutionizing everyday tasks and improving efficiency.',
    content: 'Comprehensive article about digital transformation and its benefits...',
    category: 'Digital India',
    date: '2024-06-25',
    author: 'Admin',
    image: '💡',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'Aadhaar Update Online - Step by Step Guide',
    excerpt: 'Learn how to update your Aadhaar details easily through our online portal.',
    content: 'Step-by-step instructions for updating Aadhaar information...',
    category: 'Aadhaar Services',
    date: '2024-06-20',
    author: 'Admin',
    image: '👤',
    readTime: '4 min read',
  },
  {
    id: 4,
    title: 'Why Insurance is Important for Your Future',
    excerpt: 'Understand the importance of insurance and how it protects your financial future.',
    content: 'In-depth article about insurance types and their benefits...',
    category: 'Insurance',
    date: '2024-06-15',
    author: 'Admin',
    image: '🛡️',
    readTime: '6 min read',
  },
  {
    id: 5,
    title: 'Top 5 Mistakes to Avoid When Applying for PAN',
    excerpt: 'Common mistakes people make during PAN application and how to avoid them.',
    content: 'List of common PAN application errors and their solutions...',
    category: 'Documentation',
    date: '2024-06-10',
    author: 'Admin',
    image: '🎫',
    readTime: '5 min read',
  },
  {
    id: 6,
    title: 'How to Link Your Aadhaar with Your Bank Account',
    excerpt: 'Guide to linking your Aadhaar number with your bank account for easy KYC.',
    content: 'Complete process of Aadhaar linking with banking services...',
    category: 'Banking',
    date: '2024-06-05',
    author: 'Admin',
    image: '🏦',
    readTime: '4 min read',
  },
]

const categories = ['All', ...Array.from(new Set(blogPosts.map(p => p.category)))]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Blog</h1>
            <p className="text-lg text-muted-foreground">Latest news, guides, and insights about digital services</p>
          </div>

          {/* Search and Filter */}
          <div className="space-y-6 mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card border-border text-foreground placeholder-muted-foreground pr-12"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </div>

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

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {filteredPosts.map(post => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition group h-full">
                  <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-8 text-5xl flex items-center justify-center">
                    {post.image}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No blog posts found matching your criteria</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
