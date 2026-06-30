'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, FileText, CheckCircle2, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api, getUser } from '@/lib/client-auth';
import { toast } from 'sonner';

const App = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', address: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/services/${slug}`).then(r => r.json()).then(d => setService(d.service));
  }, [slug]);

  const onOrder = async (e) => {
    e.preventDefault();
    if (!getUser()) { toast.info('Please sign in to place an order'); router.push(`/login?next=/services/${slug}`); return; }
    setSubmitting(true);
    try {
      const d = await api('/orders', { method: 'POST', body: JSON.stringify({ serviceId: slug, formData }) });
      toast.success('Order created. Complete payment to proceed.');
      router.push(`/order/${d.order.id}`);
    } catch (err) { toast.error(err.message); } finally { setSubmitting(false); }
  };

  if (!service) return <main className="min-h-screen"><Navbar /><div className="pt-40 text-center text-white/60">Loading service...</div></main>;

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <Link href="/services" className="text-sm text-white/50 hover:text-white">← Back to services</Link>
              <div className="flex items-center gap-3 mt-4 mb-3">
                {service.govt && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">Government</Badge>}
                {service.popular && <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">Popular</Badge>}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">{service.name}</h1>
              <p className="text-lg text-white/60 mb-8">{service.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="glass rounded-xl p-4">
                  <div className="text-xs text-white/50 mb-1">Estimated time</div>
                  <div className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-purple-400" />{service.time}</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="text-xs text-white/50 mb-1">Service fee</div>
                  <div className="font-semibold text-xl gradient-text">{service.price === 0 ? 'FREE' : `₹${service.price}`}</div>
                </div>
              </div>
              <Card className="glass border-white/5 p-6 mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-purple-400" />Documents required</h3>
                <ul className="space-y-2">{service.documents.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />{d}</li>
                ))}</ul>
              </Card>
              <Card className="glass border-white/5 p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-400" />How it works</h3>
                <ol className="space-y-3 text-sm text-white/70">
                  <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>Place your order with required details below</li>
                  <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>Complete UPI payment by scanning the QR shown after order</li>
                  <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>Admin verifies payment & order moves to Processing</li>
                  <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>Track updates & download final document from dashboard</li>
                </ol>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <div className="sticky top-28">
                <Card className="glass-strong border-white/10 p-6">
                  <h3 className="font-semibold text-xl mb-1">Apply now</h3>
                  <p className="text-sm text-white/60 mb-5">Fill basic details to create your order.</p>
                  <form onSubmit={onOrder} className="space-y-4">
                    <div><Label className="mb-1.5 block text-xs">Full Name</Label><Input required value={formData.fullName} onChange={e=>setFormData({...formData, fullName:e.target.value})} placeholder="As per Aadhaar" className="bg-white/5 border-white/10"/></div>
                    <div><Label className="mb-1.5 block text-xs">Mobile</Label><Input required value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} placeholder="10-digit" className="bg-white/5 border-white/10"/></div>
                    <div><Label className="mb-1.5 block text-xs">Email</Label><Input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="bg-white/5 border-white/10"/></div>
                    <div><Label className="mb-1.5 block text-xs">Address</Label><Textarea value={formData.address} onChange={e=>setFormData({...formData, address:e.target.value})} rows={2} className="bg-white/5 border-white/10"/></div>
                    <div><Label className="mb-1.5 block text-xs">Notes (optional)</Label><Textarea value={formData.notes} onChange={e=>setFormData({...formData, notes:e.target.value})} rows={2} className="bg-white/5 border-white/10"/></div>
                    <Button type="submit" disabled={submitting} className="w-full btn-gradient text-white border-0 h-12 text-base">
                      {submitting ? 'Creating...' : <>Continue to Payment<ArrowRight className="w-4 h-4 ml-2"/></>}
                    </Button>
                    <div className="flex items-center gap-2 text-xs text-white/50 justify-center"><Shield className="w-3.5 h-3.5"/>Your data is encrypted & secure</div>
                  </form>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
};
export default App;
