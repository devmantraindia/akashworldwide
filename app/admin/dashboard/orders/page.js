'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Eye, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { api } from '@/lib/client-auth';
import { toast } from 'sonner';
import AdminShell from '@/components/admin/admin-shell';
import { PageHeader, StatusBadge } from '@/components/admin/ui-bits';

const FILTERS = ['', 'PENDING', 'VERIFICATION', 'PROCESSING', 'COMPLETED', 'REJECTED'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      const o = await api(`/admin/orders${filter ? `?status=${filter}` : ''}`);
      setOrders(o.orders || []);
    } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };

  useEffect(() => { reload(); }, [filter]);

  const act = async (orderId, action) => {
    try {
      await api(`/admin/orders/${orderId}/${action}`, { method: 'POST', body: JSON.stringify({}) });
      toast.success(`Order ${action}d`);
      reload();
    } catch (e) { toast.error(e.message); }
  };

  const visible = orders.filter(o => {
    if (!q) return true;
    const s = q.toLowerCase();
    return o.serviceName?.toLowerCase().includes(s) || o.userName?.toLowerCase().includes(s) || o.userEmail?.toLowerCase().includes(s) || o.id?.toLowerCase().includes(s);
  });

  return (
    <AdminShell>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <PageHeader title="All" highlight="orders" subtitle="Verify payments and update order status.">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search orders..." className="pl-9 bg-white/5 border-white/10 h-9 w-56" />
          </div>
        </PageHeader>
        <div className="flex gap-2 flex-wrap mb-5">
          {FILTERS.map(s => (
            <Button key={s || 'all'} onClick={() => setFilter(s)} size="sm" variant={filter === s ? 'default' : 'outline'} className={filter === s ? 'btn-gradient text-white border-0' : 'border-white/10'}>{s || 'All'}</Button>
          ))}
        </div>
        <Card className="glass border-white/5 p-4">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-white/50"><Loader2 className="w-5 h-5 animate-spin mr-2" />Loading...</div>
          ) : visible.length === 0 ? (
            <div className="text-center py-10 text-white/60">No orders found.</div>
          ) : (
            <div className="space-y-3">{visible.map(o => (
              <div key={o.id} className="glass border-white/5 rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-semibold">{o.serviceName}</div>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="text-xs text-white/50 mt-1">#{o.id.slice(0, 8)} · {o.userName} ({o.userEmail}) · {new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold gradient-text">₹{o.amount}</div>
                  {o.payment && <div className="text-xs text-white/60 font-mono">{o.payment.transactionId}</div>}
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild><Button size="sm" variant="outline" className="border-white/10" aria-label="View order"><Eye className="w-4 h-4" /></Button></DialogTrigger>
                    <DialogContent className="glass-strong border-white/10 max-w-2xl">
                      <DialogHeader><DialogTitle>{o.serviceName} — #{o.id.slice(0, 8)}</DialogTitle></DialogHeader>
                      <div className="space-y-3 text-sm max-h-[70vh] overflow-auto">
                        <div><b>Customer:</b> {o.userName} ({o.userEmail})</div>
                        <div><b>Status:</b> {o.status}</div>
                        <div><b>Amount:</b> ₹{o.amount}</div>
                        <div><b>Form Data:</b><pre className="glass rounded-lg p-3 mt-1 text-xs overflow-auto">{JSON.stringify(o.formData, null, 2)}</pre></div>
                        {o.payment && (
                          <div><b>Payment:</b>
                            <pre className="glass rounded-lg p-3 mt-1 text-xs overflow-auto">{JSON.stringify({ transactionId: o.payment.transactionId, name: o.payment.name, mobile: o.payment.mobile, paymentTime: o.payment.paymentTime }, null, 2)}</pre>
                            {o.payment.screenshot && <img src={o.payment.screenshot || "/placeholder.svg"} className="mt-2 rounded-lg max-h-72" alt="Payment proof" />}
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  {o.status === 'VERIFICATION' && (<>
                    <Button onClick={() => act(o.id, 'verify')} size="sm" className="btn-gradient text-white border-0"><CheckCircle2 className="w-4 h-4 mr-1" />Verify</Button>
                    <Button onClick={() => act(o.id, 'reject')} size="sm" variant="outline" className="border-red-500/30 text-red-300"><XCircle className="w-4 h-4 mr-1" />Reject</Button>
                  </>)}
                  {o.status === 'PROCESSING' && (
                    <Button onClick={() => act(o.id, 'complete')} size="sm" className="btn-gradient text-white border-0"><CheckCircle2 className="w-4 h-4 mr-1" />Complete</Button>
                  )}
                </div>
              </div>
            ))}</div>
          )}
        </Card>
      </motion.div>
    </AdminShell>
  );
}
