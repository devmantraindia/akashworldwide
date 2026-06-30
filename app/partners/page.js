'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Handshake, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { PARTNERS } from '@/lib/services-data';

const BENEFITS = [
  { i: ShieldCheck, t: 'Verified & compliant', d: 'Every integration follows official guidelines and security standards.' },
  { i: Handshake, t: 'Trusted network', d: '500+ partners across government, banking, and utility sectors.' },
  { i: TrendingUp, t: 'Grow together', d: 'Reach 50,000+ active customers looking for digital services.' },
];

const App = () => (
  <main className="min-h-screen">
    <Navbar />
    <PageHeader
      badge="Partners"
      title="Powered by India's most"
      highlight="trusted institutions"
      subtitle="We work hand in hand with verified government bodies, banks, and service providers to deliver fast, reliable outcomes."
    />

    <section className="container mx-auto px-4 pb-12">
      <div className="grid md:grid-cols-3 gap-5 mb-16">
        {BENEFITS.map((b, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Card className="glass border-white/5 p-6 h-full">
              <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center mb-3"><b.i className="w-5 h-5 text-white" /></div>
              <h3 className="font-semibold mb-1">{b.t}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{b.d}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section className="overflow-hidden py-8 border-y border-white/5">
      <div className="marquee">
        {[...PARTNERS, ...PARTNERS].map((p, i) => (
          <div key={i} className="glass rounded-xl px-8 py-4 flex items-center justify-center text-white/70 font-semibold whitespace-nowrap text-lg">
            {p}
          </div>
        ))}
      </div>
    </section>

    <section className="container mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-8 text-center">Our partner ecosystem</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
        {PARTNERS.map((p, i) => (
          <motion.div key={p} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
            <Card className="glass border-white/5 p-6 flex items-center justify-center text-center h-24 hover:bg-white/5 transition-colors">
              <span className="font-semibold text-white/80">{p}</span>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="container mx-auto px-4 pb-20">
      <Card className="glass-strong border-white/10 p-10 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-balance">Become a partner</h2>
        <p className="text-white/60 mb-6 max-w-xl mx-auto">Integrate your services with akashworldwide and reach thousands of customers across India.</p>
        <Button asChild className="btn-gradient text-white border-0">
          <Link href="/contact">Get in touch <ArrowRight className="w-4 h-4 ml-2" /></Link>
        </Button>
      </Card>
    </section>
    <Footer />
  </main>
);
export default App;
