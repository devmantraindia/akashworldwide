'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Shield, Zap, Users, Award, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const App = () => (
  <main className="min-h-screen">
    <Navbar />
    <section className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
        <Badge variant="outline" className="mb-4 border-white/10">About us</Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Making digital services <span className="gradient-text">simple for India</span>.</h1>
        <p className="text-lg text-white/70 leading-relaxed mb-12">Digital Service Portal is an enterprise-grade platform that lets Indians apply for any government, utility, banking or travel service from the comfort of their home. We partner with verified CSC, NPCI, BBPS and government agencies to deliver fast, secure and assisted experiences.</p>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { i: Users, t: '50,000+ users', d: 'Trusted across all 28 states' },
            { i: Sparkles, t: '150+ services', d: 'Continuously expanding' },
            { i: Award, t: '500+ partners', d: 'Verified, official integrations' },
            { i: Shield, t: 'Bank-grade security', d: 'Encrypted documents, audited access' },
            { i: Zap, t: '24h average TAT', d: 'For digital services' },
            { i: Headphones, t: '24/7 support', d: 'Real humans on call' },
          ].map((c, i) => (
            <Card key={i} className="glass border-white/5 p-6">
              <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center mb-3"><c.i className="w-5 h-5 text-white"/></div>
              <h3 className="font-semibold mb-1">{c.t}</h3>
              <p className="text-sm text-white/60">{c.d}</p>
            </Card>
          ))}
        </div>
      </motion.div>
    </section>
    <Footer/>
  </main>
);
export default App;
