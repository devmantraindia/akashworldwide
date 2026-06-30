'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { BLOGS } from '@/lib/content-data';

const App = () => (
  <main className="min-h-screen">
    <Navbar />
    <PageHeader
      badge="Blog"
      title="Guides & insights for"
      highlight="digital India"
      subtitle="Practical walkthroughs, tips, and updates to help you navigate government and utility services with confidence."
    />
    <section className="container mx-auto px-4 pb-20">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOGS.map((b, i) => (
          <motion.div key={b.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Link href={`/blogs/${b.slug}`}>
              <Card className="glass border-white/5 overflow-hidden h-full hover-glow transition-all group">
                <div className={`h-40 bg-gradient-to-br ${b.cover} relative`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <Badge className="absolute top-4 left-4 bg-black/40 border-0 text-white backdrop-blur">{b.category}</Badge>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-white/50 mb-3">
                    <span>{b.date}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 leading-snug group-hover:text-purple-300 transition-colors text-balance">{b.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed line-clamp-3">{b.excerpt}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm text-purple-400 font-medium">
                    Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
    <Footer />
  </main>
);
export default App;
