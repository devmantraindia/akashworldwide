'use client';
import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { BLOGS } from '@/lib/content-data';

export default function BlogArticle({ params }) {
  const { slug } = use(params);
  const blog = BLOGS.find((b) => b.slug === slug);
  if (!blog) return notFound();
  const related = BLOGS.filter((b) => b.slug !== slug).slice(0, 3);

  return (
    <main className="min-h-screen">
      <Navbar />
      <article className="pt-32 pb-12 container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>
          <Badge variant="outline" className="mb-4 border-white/10">{blog.category}</Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-5 text-balance">{blog.title}</h1>
          <div className="flex items-center gap-4 text-sm text-white/50 mb-8">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{blog.author}</span>
            <span>{blog.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{blog.readTime}</span>
          </div>
          <div className={`h-56 md:h-72 rounded-2xl bg-gradient-to-br ${blog.cover} mb-10`} />
          <div className="space-y-5">
            {blog.content.map((para, i) => (
              <p key={i} className="text-white/75 leading-relaxed text-lg">{para}</p>
            ))}
          </div>
          <Card className="glass border-white/5 p-6 mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1">Ready to get started?</h3>
              <p className="text-sm text-white/60">Browse 150+ services and apply online in minutes.</p>
            </div>
            <Button asChild className="btn-gradient text-white border-0 whitespace-nowrap">
              <Link href="/services">Explore services <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </Card>
        </motion.div>
      </article>

      <section className="container mx-auto px-4 pb-20 max-w-5xl">
        <h2 className="text-xl font-semibold mb-6">More articles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {related.map((b) => (
            <Link key={b.slug} href={`/blogs/${b.slug}`}>
              <Card className="glass border-white/5 overflow-hidden h-full hover-glow transition-all group">
                <div className={`h-28 bg-gradient-to-br ${b.cover}`} />
                <div className="p-5">
                  <h3 className="font-semibold mb-1 leading-snug group-hover:text-purple-300 transition-colors text-balance">{b.title}</h3>
                  <p className="text-xs text-white/50">{b.readTime}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
