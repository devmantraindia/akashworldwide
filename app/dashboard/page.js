'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle2, AlertCircle, XCircle, ArrowRight, Wallet, FileText, Bell, Settings as SettingsIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api, getUser } from '@/lib/client-auth';

const STATUS = {
  PENDING: { label: 'Pending Payment', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: Clock },
  VERIFICATION: { label: 'Awaiting Verification', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30', icon: Clock },
  PROCESSING: { label: 'Processing', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30', icon: Sparkles },
  APPROVED: { label: 'Approved', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: CheckCircle2 },
  COMPLETED: { label: 'Completed', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: CheckCircle2 },
  REJECTED: { label: 'Rejected', color: 'bg-red-500/15 text-red-300 border-red-500/30', icon: XCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-white/10 text-white/60 border-white/10', icon: XCircle },
};

const App = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser(); if (!u) { router.push('/login?next=/dashboard'); return; }
    setUser(u);
    api('/orders').then(d => { setOrders(d.orders || []); setLoading(false); }).catch(()=>setLoading(false));
  }, [router]);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => ['PENDING','VERIFICATION'].includes(o.status)).length,
    processing: orders.filter(o => o.status === 'PROCESSING').length,
    completed: orders.filter(o => ['COMPLETED','APPROVED'].includes(o.status)).length,
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="mb-10">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <div className="text-sm text-white/50 mb-1">Welcome back</div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">Hi, <span className="gradient-text">{user?.name?.split(' ')[0]}</span></h1>
              </div>
              <Button asChild className="btn-gradient text-white border-0"><Link href="/services">Browse services <ArrowRight className="w-4 h-4 ml-1"/></Link></Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Orders', v: stats.total, icon: ShoppingBag, color: 'from-purple-500 to-indigo-500' },
              { label: 'Pending', v: stats.pending, icon: Clock, color: 'from-amber-500 to-orange-500' },
              { label: 'Processing', v: stats.processing, icon: Sparkles, color: 'from-blue-500 to-cyan-500' },
              { label: 'Completed', v: stats.completed, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500' },
            ].map((s, i) => (
              <Card key={i} className="glass border-white/5 p-5 hover-glow">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-5 h-5 text-white"/></div>
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-xs text-white/60">{s.label}</div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card className="glass border-white/5 p-2 sticky top-28">
                {[
                  { label: 'My Orders', icon: ShoppingBag, active: true },
                  { label: 'Wallet', icon: Wallet },
                  { label: 'Documents', icon: FileText },
                  { label: 'Notifications', icon: Bell },
                  { label: 'Settings', icon: SettingsIcon },
                ].map((it, i) => (
                  <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${it.active ? 'bg-white/5 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                    <it.icon className="w-4 h-4"/>{it.label}
                  </button>
                ))}
              </Card>
            </div>
            <div className="lg:col-span-3">
              <Card className="glass border-white/5 p-6">
                <h3 className="font-semibold text-xl mb-4">Your orders</h3>
                {loading ? (
                  <div className="space-y-3">{Array.from({length:3}).map((_,i)=>(<div key={i} className="h-20 glass rounded-xl animate-pulse"/>))}</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4"><ShoppingBag className="w-7 h-7 text-white/40"/></div>
                    <p className="text-white/60 mb-4">No orders yet</p>
                    <Button asChild className="btn-gradient text-white border-0"><Link href="/services">Place your first order</Link></Button>
                  </div>
                ) : (
                  <div className="space-y-3">{orders.map(o => {
                    const S = STATUS[o.status] || STATUS.PENDING;
                    return (
                      <Link key={o.id} href={`/order/${o.id}`} className="block">
                        <div className="glass border-white/5 rounded-xl p-4 hover:border-purple-500/30 transition flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="font-semibold">{o.serviceName}</div>
                              <Badge variant="outline" className={S.color}>{S.label}</Badge>
                            </div>
                            <div className="text-xs text-white/50 mt-1">Order #{o.id.slice(0,8)} · {new Date(o.createdAt).toLocaleString()}</div>
                          </div>
                          <div className="text-right"><div className="font-bold gradient-text">₹{o.amount}</div><ArrowRight className="w-4 h-4 text-white/40 ml-auto mt-1"/></div>
                        </div>
                      </Link>
                    );
                  })}</div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
};
export default App;
