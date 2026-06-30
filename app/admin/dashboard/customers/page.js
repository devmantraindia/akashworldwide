'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Eye, Ban, CheckCircle2, Mail, Phone, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/lib/client-auth';
import { toast } from 'sonner';
import AdminShell from '@/components/admin/admin-shell';
import { PageHeader, StatusBadge } from '@/components/admin/ui-bits';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const reload = async () => {
    setLoading(true);
    try { const d = await api('/admin/customers'); setCustomers(d.customers || []); }
    catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const view = async (id) => {
    setDetailLoading(true); setDetail({});
    try { const d = await api(`/admin/customers/${id}`); setDetail(d); }
    catch (e) { toast.error(e.message); setDetail(null); } finally { setDetailLoading(false); }
  };

  const toggleSuspend = async (c) => {
    if (!confirm(`${c.suspended ? 'Reactivate' : 'Suspend'} ${c.name}?`)) return;
    try {
      const r = await api(`/admin/customers/${c.id}/suspend`, { method: 'POST', body: JSON.stringify({}) });
      toast.success(r.suspended ? 'Customer suspended' : 'Customer reactivated');
      reload();
      if (detail?.customer?.id === c.id) setDetail({ ...detail, customer: { ...detail.customer, suspended: r.suspended } });
    } catch (e) { toast.error(e.message); }
  };

  const visible = customers.filter(c => !q || c.name?.toLowerCase().includes(q.toLowerCase()) || c.email?.toLowerCase().includes(q.toLowerCase()) || (c.phone || '').includes(q));

  return (
    <AdminShell>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <PageHeader title="All" highlight="customers" subtitle={`${customers.length} registered customers.`}>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." className="pl-9 bg-white/5 border-white/10 h-9 w-56" />
          </div>
        </PageHeader>

        <Card className="glass border-white/5 p-4">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-white/50"><Loader2 className="w-5 h-5 animate-spin mr-2" />Loading...</div>
          ) : visible.length === 0 ? (
            <div className="text-center py-10 text-white/60">No customers found.</div>
          ) : (
            <div className="space-y-2">{visible.map(c => (
              <div key={c.id} className="glass rounded-xl p-3 flex items-center gap-3 flex-wrap">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center font-bold shrink-0">{(c.name || '?')[0].toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium flex items-center gap-2">{c.name}{c.suspended && <Badge variant="outline" className="border-red-500/30 text-red-300 text-xs">Suspended</Badge>}</div>
                  <div className="text-xs text-white/60 truncate">{c.email} · {c.phone || 'No phone'}</div>
                </div>
                <div className="text-center px-3 hidden sm:block">
                  <div className="font-bold text-sm">{c.orderCount || 0}</div>
                  <div className="text-[10px] text-white/50">orders</div>
                </div>
                <div className="text-center px-3 hidden sm:block">
                  <div className="font-bold text-sm gradient-text">₹{(c.totalSpent || 0).toLocaleString()}</div>
                  <div className="text-[10px] text-white/50">spent</div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => view(c.id)} size="sm" variant="outline" className="border-white/10"><Eye className="w-4 h-4" /></Button>
                  <Button onClick={() => toggleSuspend(c)} size="sm" variant="outline" className={c.suspended ? 'border-emerald-500/30 text-emerald-300' : 'border-red-500/30 text-red-300'}>
                    {c.suspended ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            ))}</div>
          )}
        </Card>
      </motion.div>

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="glass-strong border-white/10 max-w-2xl">
          <DialogHeader><DialogTitle>Customer details</DialogTitle></DialogHeader>
          {detailLoading ? (
            <div className="flex items-center justify-center py-12 text-white/50"><Loader2 className="w-5 h-5 animate-spin mr-2" />Loading...</div>
          ) : detail?.customer ? (
            <div className="space-y-4 max-h-[70vh] overflow-auto">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center font-bold text-xl">{(detail.customer.name || '?')[0].toUpperCase()}</div>
                <div>
                  <div className="font-semibold text-lg">{detail.customer.name}</div>
                  <div className="text-sm text-white/60 flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{detail.customer.email}</div>
                  <div className="text-sm text-white/60 flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{detail.customer.phone || 'No phone'}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Card className="glass border-white/5 p-3 text-center"><div className="text-xl font-bold">{detail.orders.length}</div><div className="text-xs text-white/50">Orders</div></Card>
                <Card className="glass border-white/5 p-3 text-center"><div className="text-xl font-bold gradient-text flex items-center justify-center"><IndianRupee className="w-4 h-4" />{detail.totalSpent.toLocaleString()}</div><div className="text-xs text-white/50">Spent</div></Card>
                <Card className="glass border-white/5 p-3 text-center"><div className="text-sm font-bold mt-1">{new Date(detail.customer.createdAt).toLocaleDateString()}</div><div className="text-xs text-white/50">Joined</div></Card>
              </div>
              <div>
                <div className="text-sm font-semibold mb-2">Order history</div>
                {detail.orders.length === 0 ? <div className="text-sm text-white/50 py-4 text-center glass rounded-lg">No orders yet.</div> : (
                  <div className="space-y-2">{detail.orders.map(o => (
                    <div key={o.id} className="glass rounded-lg p-3 flex items-center justify-between gap-2 flex-wrap">
                      <div><div className="text-sm font-medium">{o.serviceName}</div><div className="text-xs text-white/50">{new Date(o.createdAt).toLocaleDateString()}</div></div>
                      <div className="flex items-center gap-2"><StatusBadge status={o.status} /><span className="font-bold text-sm">₹{o.amount}</span></div>
                    </div>
                  ))}</div>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
