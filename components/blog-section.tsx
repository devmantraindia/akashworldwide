'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: 'PM Kisan Yojana 2024 - How to Apply Online & Check Status',
    category: 'Government Schemes',
    date: '2 days ago',
    image: '📄',
  },
  {
    id: 2,
    title: 'Benefits of Digital Services in Daily Life',
    category: 'Digital India',
    date: '5 days ago',
    image: '💡',
  },
  {
    id: 3,
    title: 'Aadhaar Update Online - Step by Step Guide',
    category: 'Aadhaar Services',
    date: '1 week ago',
    image: '👤',
  },
  {
    id: 4,
    title: 'Why Insurance is Important for Your Future',
    category: 'Insurance',
    date: '1 week ago',
    image: '🛡️',
  },
]

export default function BlogSection() {
  return (
    <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30 border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">Latest from Our Blog</h2>
            <p className="text-muted-foreground">Stay updated with helpful guides and news</p>
          </div>
          <Link href="/blog" className="text-primary hover:text-accent flex items-center gap-2 text-sm hidden md:flex">
            View All Blogs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition cursor-pointer group">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-8 text-5xl flex items-center justify-center">
                  {post.image}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="text-primary text-sm font-medium group-hover:translate-x-1 transition inline-flex items-center gap-1">
                    Read More <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
