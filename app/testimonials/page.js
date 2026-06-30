'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Quote, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '@/lib/services-data';

const STATS = [
  { v: '50,000+', l: 'Happy customers' },
  { v: '4.9/5', l: 'Average rating' },
  { v: '99.9%', l: 'Success rate' },
  { v: '150+', l: 'Services offered' },
];

const App = () => (
  <main className="min-h-screen">
    <Navbar />
    <PageHeader
      badge="Testimonials"
      title="Loved by people"
      highlight="across India"
      subtitle="Real stories from customers who got their services done faster and easier with akashworldwide."
    />

    <section className="container mx-auto px-4 pb-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {STATS.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Card className="glass border-white/5 p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-1">{s.v}</div>
              <div className="text-sm text-white/60">{s.l}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Card className="glass border-white/5 p-6 h-full flex flex-col">
              <Quote className="w-8 h-8 text-purple-400/50 mb-3" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/75 leading-relaxed mb-5 flex-1">{t.text}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full btn-gradient flex items-center justify-center text-white font-semibold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-white/50">{t.role}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="container mx-auto px-4 pb-20">
      <Card className="glass-strong border-white/10 p-10 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-balance">Join thousands of happy customers</h2>
        <p className="text-white/60 mb-6">Experience the simplest way to access digital services in India.</p>
        <Button asChild className="btn-gradient text-white border-0">
          <Link href="/signup">Get started free <ArrowRight className="w-4 h-4 ml-2" /></Link>
        </Button>
      </Card>
    </section>
    <Footer />
  </main>
);
export default App;
