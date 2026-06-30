'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Clock, XCircle, Sparkles, Copy, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api, getUser } from '@/lib/client-auth';
import { toast } from 'sonner';

const STATUS_LABELS = {
  PENDING: 'Pending Payment', VERIFICATION: 'Awaiting Verification', PROCESSING: 'Processing',
  APPROVED: 'Approved', COMPLETED: 'Completed', REJECTED: 'Rejected', CANCELLED: 'Cancelled'
};

const App = () => {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [settings, setSettings] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ transactionId: '', name: '', mobile: '', paymentTime: '', screenshot: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const d = await api(`/orders/${id}`);
      setOrder(d.order);
      const u = getUser();
      if (u) setPaymentForm(f => ({ ...f, name: u.name, mobile: u.phone || '' }));
    } catch (e) { toast.error(e.message); router.push('/dashboard'); }
  };

  useEffect(() => {
    if (!getUser()) { router.push(`/login?next=/order/${id}`); return; }
    load();
    fetch('/api/settings/public').then(r => r.json()).then(setSettings);
  }, [id, router]);

  const onFile = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error('Max 2MB image');
    const reader = new FileReader();
    reader.onload = () => setPaymentForm(f => ({ ...f, screenshot: reader.result }));
    reader.readAsDataURL(file);
  };

  const submitPayment = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await api(`/orders/${id}/payment`, { method: 'POST', body: JSON.stringify(paymentForm) });
      toast.success('Payment submitted. Admin will verify shortly.');
      load();
    } catch (err) { toast.error(err.message); } finally { setSubmitting(false); }
  };

  if (!order) return <main className="min-h-screen"><Navbar/><div className="pt-40 text-center text-white/60">Loading order...</div></main>;

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/dashboard" className="text-sm text-white/60 hover:text-white inline-flex items-center gap-1 mb-4"><ArrowLeft className="w-4 h-4"/>Back to dashboard</Link>
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
            <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">{order.serviceName}</h1>
                <div className="text-sm text-white/50 mt-1">Order #{order.id.slice(0,8)} · created {new Date(order.createdAt).toLocaleString()}</div>
              </div>
              <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-300 px-3 py-1.5 text-sm">{STATUS_LABELS[order.status]}</Badge>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-6">
                {order.status === 'PENDING' && settings && (
                  <Card className="glass-strong border-purple-500/20 p-6">
                    <div className="flex items-center gap-2 mb-1"><Sparkles className="w-4 h-4 text-purple-300"/><span className="text-xs font-semibold uppercase tracking-wider text-purple-300">Step 1 — Pay via UPI</span></div>
                    <h3 className="font-semibold text-xl mb-4">Scan & Pay ₹{order.amount}</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-2xl p-4 flex items-center justify-center">
                        <img src={settings.qrImage} alt="UPI QR" className="w-full max-w-[280px]" />
                      </div>
                      <div className="space-y-3">
                        <div><div className="text-xs text-white/50 mb-1">UPI ID</div>
                          <div className="flex items-center gap-2"><code className="glass px-3 py-2 rounded-lg font-mono text-sm">{settings.upiId}</code>
                            <Button size="icon" variant="ghost" onClick={()=>{navigator.clipboard.writeText(settings.upiId); toast.success('Copied');}}><Copy className="w-4 h-4"/></Button>
                          </div>
                        </div>
                        <div><div className="text-xs text-white/50 mb-1">Payee</div><div className="text-sm">{settings.payeeName}</div></div>
                        <div><div className="text-xs text-white/50 mb-1">Amount</div><div className="text-2xl font-bold gradient-text">₹{order.amount}</div></div>
                        <div className="glass rounded-lg p-3 text-xs text-amber-300 flex gap-2"><AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5"/>Pay exact amount and submit transaction details below.</div>
                      </div>
                    </div>
                  </Card>
                )}

                {order.status === 'PENDING' && (
                  <Card className="glass border-white/10 p-6">
                    <div className="flex items-center gap-2 mb-1"><Upload className="w-4 h-4 text-purple-300"/><span className="text-xs font-semibold uppercase tracking-wider text-purple-300">Step 2 — Submit payment proof</span></div>
                    <h3 className="font-semibold text-xl mb-4">Confirm your payment</h3>
                    <form onSubmit={submitPayment} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div><Label className="mb-1.5 block text-xs">Transaction ID / UTR</Label><Input required value={paymentForm.transactionId} onChange={e=>setPaymentForm({...paymentForm, transactionId:e.target.value})} placeholder="e.g. 234567891234" className="bg-white/5 border-white/10"/></div>
                        <div><Label className="mb-1.5 block text-xs">Name on UPI</Label><Input required value={paymentForm.name} onChange={e=>setPaymentForm({...paymentForm, name:e.target.value})} className="bg-white/5 border-white/10"/></div>
                        <div><Label className="mb-1.5 block text-xs">Mobile</Label><Input required value={paymentForm.mobile} onChange={e=>setPaymentForm({...paymentForm, mobile:e.target.value})} className="bg-white/5 border-white/10"/></div>
                        <div><Label className="mb-1.5 block text-xs">Payment Time</Label><Input type="datetime-local" required value={paymentForm.paymentTime} onChange={e=>setPaymentForm({...paymentForm, paymentTime:e.target.value})} className="bg-white/5 border-white/10"/></div>
                      </div>
                      <div><Label className="mb-1.5 block text-xs">Payment Screenshot (max 2MB)</Label>
                        <Input type="file" accept="image/*" onChange={onFile} className="bg-white/5 border-white/10 file:text-white"/>
                        {paymentForm.screenshot && <img src={paymentForm.screenshot} alt="preview" className="mt-3 rounded-lg max-h-40"/>}
                      </div>
                      <Button type="submit" disabled={submitting} className="w-full btn-gradient text-white border-0 h-11">{submitting ? 'Submitting...' : 'Submit for verification'}</Button>
                    </form>
                  </Card>
                )}

                {order.status !== 'PENDING' && (
                  <Card className="glass border-white/5 p-6">
                    <h3 className="font-semibold text-xl mb-4">Timeline</h3>
                    <div className="space-y-4">{(order.timeline||[]).map((t, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                          {t.status === 'REJECTED' ? <XCircle className="w-4 h-4 text-red-400"/> : (['COMPLETED','APPROVED','PROCESSING'].includes(t.status) ? <CheckCircle2 className="w-4 h-4 text-emerald-400"/> : <Clock className="w-4 h-4 text-purple-300"/>)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{STATUS_LABELS[t.status] || t.status}</div>
                          <div className="text-xs text-white/50">{new Date(t.at).toLocaleString()} — {t.note}</div>
                        </div>
                      </div>
                    ))}</div>
                  </Card>
                )}
              </div>
              <div className="lg:col-span-2">
                <Card className="glass border-white/5 p-6 sticky top-28">
                  <h3 className="font-semibold mb-4">Order summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-white/60">Service</span><span className="font-medium text-right">{order.serviceName}</span></div>
                    <div className="flex justify-between"><span className="text-white/60">Order ID</span><span className="font-mono">{order.id.slice(0,8)}</span></div>
                    <div className="flex justify-between"><span className="text-white/60">Status</span><span>{STATUS_LABELS[order.status]}</span></div>
                    <div className="flex justify-between pt-3 border-t border-white/10"><span>Total</span><span className="text-2xl font-bold gradient-text">₹{order.amount}</span></div>
                  </div>
                  {order.payment && (
                    <div className="mt-5 pt-5 border-t border-white/10">
                      <div className="text-xs text-white/50 mb-2 uppercase tracking-wider">Payment</div>
                      <div className="text-sm"><div>Txn ID: <span className="font-mono">{order.payment.transactionId}</span></div></div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer/>
    </main>
  );
};
export default App;
