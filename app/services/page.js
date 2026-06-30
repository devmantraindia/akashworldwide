'use client';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Clock, Filter, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSearchParams } from 'next/navigation';

function ServicesInner() {
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get('q') || '');
  const [cat, setCat] = useState(sp.get('category') || '');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (cat) params.set('category', cat);
    fetch(`/api/services?${params}`).then(r => r.json()).then(d => {
      setServices(d.services || []); setCategories(d.categories || []); setLoading(false);
    });
  }, [q, cat]);

  return (
    <>
      <section className="pt-32 pb-10">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-10">
            <Badge variant="outline" className="mb-4 border-white/10">{services.length} services available</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">All <span className="gradient-text">services</span></h1>
            <p className="text-white/60">Search and apply for 150+ government, utility, banking & travel services online.</p>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            <div className="glass-strong rounded-2xl p-2 flex items-center gap-2">
              <Search className="w-5 h-5 text-white/50 ml-3" />
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search services..." className="border-0 bg-transparent h-11 focus-visible:ring-0" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            <Button onClick={() => setCat('')} variant={!cat ? 'default' : 'outline'} size="sm" className={!cat ? 'btn-gradient text-white border-0' : 'border-white/10'}>All</Button>
            {categories.map(c => (
              <Button key={c.id} onClick={() => setCat(c.id)} variant={cat === c.id ? 'default' : 'outline'} size="sm" className={cat === c.id ? 'btn-gradient text-white border-0' : 'border-white/10'}>{c.name}</Button>
            ))}
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-3 gap-5">{Array.from({length:9}).map((_,i)=>(<div key={i} className="glass rounded-2xl h-48 animate-pulse"/>))}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i*0.02, 0.5) }}>
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
          )}
          {!loading && services.length === 0 && (
            <div className="glass rounded-2xl p-10 text-center text-white/60">No services found. Try a different search.</div>
          )}
        </div>
      </section>
    </>
  );
}

const App = () => (
  <main className="relative min-h-screen">
    <Navbar />
    <Suspense fallback={<div className="pt-32 text-center text-white/60">Loading...</div>}>
      <ServicesInner />
    </Suspense>
    <Footer />
  </main>
);
export default App;
