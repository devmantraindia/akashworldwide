'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const TIERS = [
  { name: 'Pay-as-you-go', price: 'Service fee only', features: ['Pay per service', 'Standard processing', 'Email support', 'Order tracking'], cta: 'Browse services', href: '/services' },
  { name: 'Pro', price: '₹499/mo', popular: true, features: ['Priority processing (50% faster)', '10% off all services', 'Priority chat support', 'Multi-user access (up to 3)'], cta: 'Start Pro trial', href: '/signup' },
  { name: 'Business', price: '₹1,999/mo', features: ['Bulk service orders', 'Dedicated relationship manager', '15% off + custom invoicing', 'API access for partners'], cta: 'Contact sales', href: '/contact' },
];

const App = () => (
  <main className="min-h-screen">
    <Navbar/>
    <section className="pt-32 pb-20 container mx-auto px-4 max-w-6xl">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 border-white/10">Pricing</Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Simple, <span className="gradient-text">honest pricing</span></h1>
        <p className="text-white/60">Only pay for what you use. No hidden fees. Cancel anytime.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {TIERS.map((t, i) => (
          <Card key={i} className={`relative p-7 ${t.popular ? 'glass-strong border-purple-500/40' : 'glass border-white/5'}`}>
            {t.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 btn-gradient text-white text-xs font-semibold px-3 py-1 rounded-full">Most popular</div>}
            <div className="font-semibold text-lg mb-1">{t.name}</div>
            <div className="text-3xl font-bold gradient-text mb-5">{t.price}</div>
            <ul className="space-y-2 mb-6">{t.features.map((f, j) => <li key={j} className="flex gap-2 text-sm text-white/70"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5"/>{f}</li>)}</ul>
            <Button asChild className={`w-full ${t.popular ? 'btn-gradient text-white border-0' : ''}`} variant={t.popular ? 'default' : 'outline'}><Link href={t.href}>{t.cta}</Link></Button>
          </Card>
        ))}
      </div>
    </section>
    <Footer/>
  </main>
);
export default App;
