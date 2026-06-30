'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles, Shield, Zap, Clock, CheckCircle2, Star, TrendingUp, Users, Award, Headphones, FileText, Landmark, Plane, Smartphone, HeartHandshake, Receipt, GraduationCap, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

const ICONS = { FileText, Landmark, Plane, Smartphone, HeartHandshake, Receipt, GraduationCap, Stethoscope, Shield, Zap };
const PARTNERS = ['CSC','UIDAI','DigiLocker','Protean','UTIITSL','Passport Seva','IRCTC','NPCI','BBPS','LIC','SBI','IPPB','PM Kisan','Ayushman Bharat','GST','Income Tax','NIA','New India','United India','Oriental'];

function Counter({ to, suffix = '', duration = 2 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const step = (now) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.floor(eased * to));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{n.toLocaleString()}{suffix}</>;
}

const App = () => {
  const [q, setQ] = useState('');
  const [popular, setPopular] = useState([]);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/services?popular=1').then(r => r.json()).then(d => {
      setPopular((d.services || []).slice(0, 12));
      setCategories(d.categories || []);
    });
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    router.push(`/services${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl orb" />
        <div className="absolute top-40 right-0 w-[28rem] h-[28rem] bg-fuchsia-500/20 rounded-full blur-3xl orb" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[60vh] left-1/3 w-[32rem] h-[32rem] bg-indigo-600/20 rounded-full blur-3xl orb" style={{ animationDelay: '6s' }} />
      </div>

      {/* HERO */}
      <section className="relative pt-40 pb-20">
        <div className="absolute inset-0 grid-bg -z-10" />
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-7 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/80">Trusted by 50,000+ users · 99.9% success rate</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.05] mb-6">
              All digital services.<br/>
              <span className="gradient-text">One trusted portal.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
              Apply for PAN, Aadhaar, Passport, GST, ITR, Driving Licence and 150+ services online. Fast processing, secure documents, expert assistance.
            </p>
            <form onSubmit={onSearch} className="max-w-2xl mx-auto">
              <div className="glass-strong rounded-2xl p-2 flex items-center gap-2 hover-glow transition">
                <Search className="w-5 h-5 text-white/50 ml-3" />
                <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search PAN, Passport, GST, Aadhaar..." className="border-0 bg-transparent text-base h-12 focus-visible:ring-0" />
                <Button type="submit" className="btn-gradient text-white border-0 h-12 px-6">Search<ArrowRight className="w-4 h-4 ml-1" /></Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-xs text-white/50">
                <span>Trending:</span>
                {['PAN Card','Passport','GST','ITR','Aadhaar','FASTag'].map(t => (
                  <Link key={t} href={`/services?q=${t}`} className="px-3 py-1 rounded-full glass hover:bg-white/10 text-white/70">{t}</Link>
                ))}
              </div>
            </form>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-20">
            {[
              { v: 150, s: '+', label: 'Services', icon: Sparkles },
              { v: 50000, s: '+', label: 'Happy Users', icon: Users },
              { v: 500, s: '+', label: 'Partners', icon: Award },
              { v: 99, s: '.9%', label: 'Success Rate', icon: TrendingUp },
            ].map((it, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center hover-glow transition">
                <it.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-3xl md:text-4xl font-bold gradient-text"><Counter to={it.v} suffix={it.s} /></div>
                <div className="text-xs text-white/60 mt-1">{it.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 border-white/10">Categories</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Browse by <span className="gradient-text">category</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((c, i) => {
              const Icon = ICONS[c.icon] || Sparkles;
              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/services?category=${c.id}`}>
                    <Card className="glass border-white/5 hover:border-purple-500/40 transition-all p-5 hover-glow group cursor-pointer h-full">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3 group-hover:scale-110 transition`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-semibold text-sm">{c.name}</div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <Badge variant="outline" className="mb-3 border-white/10">Popular</Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Most requested <span className="gradient-text">services</span></h2>
            </div>
            <Button asChild variant="ghost" className="text-white/80"><Link href="/services">View all services<ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {popular.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                <Link href={`/services/${s.slug}`}>
                  <Card className="glass border-white/5 hover:border-purple-500/40 transition-all p-6 hover-glow group cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 border border-purple-500/30 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-purple-300" />
                      </div>
                      {s.govt && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">Govt</Badge>}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{s.name}</h3>
                    <p className="text-sm text-white/50 line-clamp-2 mb-4">{s.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="text-xs text-white/50 flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{s.time}</div>
                      <div className="font-bold text-purple-300">{s.price === 0 ? 'FREE' : `₹${s.price}`}</div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16">
        <div className="container mx-auto px-4 mb-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-3 border-white/10">Trusted partners</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Powered by India’s <span className="gradient-text">leading institutions</span></h2>
          </div>
        </div>
        <div className="relative overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)]">
          <div className="marquee">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div key={i} className="glass rounded-xl px-8 py-4 flex items-center justify-center min-w-[180px] text-white/70 font-semibold whitespace-nowrap">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 border-white/10">Why us</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Built for <span className="gradient-text">trust & speed</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Bank-grade security', desc: 'Documents encrypted at rest. Role-based access. Audit logs for every action.' },
              { icon: Zap, title: 'Lightning fast', desc: 'Most digital services completed within 24–48 hours. Realtime status updates.' },
              { icon: Headphones, title: '24/7 expert support', desc: 'Talk to a real human anytime. Ticket system with admin replies and attachments.' },
            ].map((it, i) => (
              <Card key={i} className="glass border-white/5 p-8 hover-glow">
                <div className="w-12 h-12 rounded-xl btn-gradient flex items-center justify-center mb-4"><it.icon className="w-6 h-6 text-white" /></div>
                <h3 className="font-semibold text-xl mb-2">{it.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{it.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 border-white/10">Testimonials</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Loved by <span className="gradient-text">50,000+ users</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Rajesh Kumar', role: 'Business Owner', text: 'Got my GST registration done in 3 days. Excellent service, constant updates.' },
              { name: 'Priya Sharma', role: 'Homemaker', text: 'Applied for Aadhaar update from home. Saved me a full day at the seva kendra.' },
              { name: 'Amit Patel', role: 'Freelancer', text: 'Filed my ITR in 30 minutes. Team helped with deductions I didn’t even know about.' },
              { name: 'Sneha Reddy', role: 'Student', text: 'Tatkal passport in 9 days! Best service for last-minute travel.' },
              { name: 'Vikram Singh', role: 'Farmer', text: 'PM Kisan registration was free and they followed up till the money arrived.' },
              { name: 'Anita Verma', role: 'Teacher', text: 'Driving Licence renewal was painless. No more standing in long queues.' },
            ].map((t, i) => (
              <Card key={i} className="glass border-white/5 p-6 hover-glow">
                <div className="flex gap-1 mb-3">{Array.from({length:5}).map((_,j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400"/>)}</div>
                <p className="text-white/80 mb-5 text-sm leading-relaxed">“{t.text}”</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center font-bold">{t.name[0]}</div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-white/50">{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 border-white/10">FAQ</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Frequently asked <span className="gradient-text">questions</span></h2>
          </div>
          <Accordion type="single" collapsible className="glass rounded-2xl p-2">
            {[
              { q: 'How do I place an order?', a: 'Choose a service, click Order Now, fill in basic details and complete the manual UPI QR payment. Once verified by admin, your order moves to processing.' },
              { q: 'How does payment verification work?', a: 'After scanning the QR and paying via UPI, upload the screenshot and enter the transaction ID. Our admin team verifies within minutes during business hours.' },
              { q: 'Is my data secure?', a: 'Yes. All documents are stored encrypted, accessible only by authorised operators, and audit-logged for every access.' },
              { q: 'What if my order is rejected?', a: 'You’ll see the reason in the order timeline. Full refunds are processed within 5–7 business days as per refund policy.' },
              { q: 'Do you support all 28 states?', a: 'Yes. We cover all central and state-level services across India through our partner network.' },
            ].map((f, i) => (
              <AccordionItem key={i} value={`q${i}`} className="border-white/5">
                <AccordionTrigger className="px-4 hover:no-underline text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="px-4 text-white/60">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-strong rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-fuchsia-600/20" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Ready to <span className="gradient-text">get started?</span></h2>
              <p className="text-white/60 mb-8 max-w-xl mx-auto">Create your free account, choose from 150+ services, and let our experts handle the rest.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button asChild size="lg" className="btn-gradient text-white border-0 h-12 px-7"><Link href="/signup">Create free account<ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-7 border-white/10"><Link href="/services">Browse services</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};
export default App;
