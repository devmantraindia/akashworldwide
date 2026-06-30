'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, ShoppingBag, Users, CreditCard, Settings, LogOut, TrendingUp, Clock, CheckCircle2, XCircle, Eye, ShieldCheck, Sparkles, IndianRupee, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api, getUser, clearAuth } from '@/lib/client-auth';
import { toast } from 'sonner';

const STATUS_COLORS = {
  PENDING: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  VERIFICATION: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  PROCESSING: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  APPROVED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  COMPLETED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  REJECTED: 'bg-red-500/15 text-red-300 border-red-500/30',
};

const App = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tab, setTab] = useState('overview');
  const [filter, setFilter] = useState('');

  const reload = async () => {
    try {
      const s = await api('/admin/stats'); setStats(s);
      const o = await api(`/admin/orders${filter ? `?status=${filter}` : ''}`); setOrders(o.orders || []);
      const c = await api('/admin/customers'); setCustomers(c.customers || []);
    } catch (e) { toast.error(e.message); if (e.message.includes('Unauthorized') || e.message.includes('Forbidden')) router.push('/admin'); }
  };

  useEffect(() => {
    const u = getUser(); if (!u || !['admin','super_admin'].includes(u.role)) { router.push('/admin'); return; }
    setUser(u); reload();
  }, [router]);

  useEffect(() => { if (user) reload(); }, [filter]);

  const act = async (orderId, action) => {
    try {
      await api(`/admin/orders/${orderId}/${action}`, { method: 'POST', body: JSON.stringify({}) });
      toast.success(`Order ${action}d`);
      reload();
    } catch (e) { toast.error(e.message); }
  };

  const logout = () => { clearAuth(); router.push('/admin'); };

  if (!user) return null;

  return (
    <main className="min-h-screen flex">
      <aside className="w-64 glass-strong border-r border-white/10 p-5 hidden lg:flex flex-col fixed top-0 bottom-0 left-0">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-white"/></div>
          <div className="font-bold"><span className="gradient-text">Admin</span> Console</div>
        </div>
        <nav className="space-y-1 flex-1">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: stats?.pending },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(it => (
            <button key={it.id} onClick={() => setTab(it.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${tab === it.id ? 'bg-purple-500/15 text-white border border-purple-500/30' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
              <it.icon className="w-4 h-4"/><span className="flex-1 text-left">{it.label}</span>
              {it.badge ? <Badge className="bg-amber-500 text-black">{it.badge}</Badge> : null}
            </button>
          ))}
        </nav>
        <div className="glass rounded-xl p-3">
          <div className="text-xs text-white/50">Logged in as</div>
          <div className="text-sm font-semibold truncate">{user.email}</div>
          <div className="text-xs text-purple-300 mt-1">{user.role.replace('_',' ')}</div>
          <Button onClick={logout} variant="ghost" size="sm" className="w-full mt-3"><LogOut className="w-4 h-4 mr-2"/>Logout</Button>
        </div>
      </aside>
      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <motion.div initial={{opacity:0}} animate={{opacity:1}}>
          {tab === 'overview' && stats && (
            <>
              <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
                <div>
                  <div className="text-sm text-white/50">Welcome back</div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Operations <span className="gradient-text">overview</span></h1>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Revenue', v: `₹${stats.revenue.toLocaleString()}`, icon: IndianRupee, color: 'from-emerald-500 to-teal-500' },
                  { label: 'Total Orders', v: stats.totalOrders, icon: ShoppingBag, color: 'from-purple-500 to-fuchsia-500' },
                  { label: 'Pending Verification', v: stats.pending, icon: Clock, color: 'from-amber-500 to-orange-500' },
                  { label: 'Customers', v: stats.customers, icon: Users, color: 'from-blue-500 to-cyan-500' },
                ].map((s, i) => (
                  <Card key={i} className="glass border-white/5 p-5">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-5 h-5 text-white"/></div>
                    <div className="text-2xl font-bold">{s.v}</div>
                    <div className="text-xs text-white/60">{s.label}</div>
                  </Card>
                ))}
              </div>
              <Card className="glass border-white/5 p-6">
                <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Orders — last 7 days</h3><TrendingUp className="w-4 h-4 text-purple-300"/></div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.chart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" fontSize={12}/>
                      <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12}/>
                      <Tooltip contentStyle={{ background: 'rgba(15,13,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}/>
                      <Line type="monotone" dataKey="orders" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </>
          )}
          {tab === 'orders' && (
            <>
              <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">All <span className="gradient-text">orders</span></h1>
                  <p className="text-white/60 mt-1 text-sm">Verify payments and update order status.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['','VERIFICATION','PROCESSING','COMPLETED','REJECTED'].map(s => (
                    <Button key={s||'all'} onClick={()=>setFilter(s)} size="sm" variant={filter===s ? 'default' : 'outline'} className={filter===s ? 'btn-gradient text-white border-0' : 'border-white/10'}>{s || 'All'}</Button>
                  ))}
                </div>
              </div>
              <Card className="glass border-white/5 p-4">
                {orders.length === 0 ? <div className="text-center py-10 text-white/60">No orders found.</div> : (
                  <div className="space-y-3">{orders.map(o => (
                    <div key={o.id} className="glass border-white/5 rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-semibold">{o.serviceName}</div>
                          <Badge variant="outline" className={STATUS_COLORS[o.status]||''}>{o.status}</Badge>
                        </div>
                        <div className="text-xs text-white/50 mt-1">#{o.id.slice(0,8)} · {o.userName} ({o.userEmail}) · {new Date(o.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold gradient-text">₹{o.amount}</div>
                        {o.payment && <div className="text-xs text-white/60 font-mono">{o.payment.transactionId}</div>}
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild><Button size="sm" variant="outline" className="border-white/10"><Eye className="w-4 h-4"/></Button></DialogTrigger>
                          <DialogContent className="glass-strong border-white/10 max-w-2xl">
                            <DialogHeader><DialogTitle>{o.serviceName} — #{o.id.slice(0,8)}</DialogTitle></DialogHeader>
                            <div className="space-y-3 text-sm">
                              <div><b>Customer:</b> {o.userName} ({o.userEmail})</div>
                              <div><b>Status:</b> {o.status}</div>
                              <div><b>Amount:</b> ₹{o.amount}</div>
                              <div><b>Form Data:</b><pre className="glass rounded-lg p-3 mt-1 text-xs overflow-auto">{JSON.stringify(o.formData, null, 2)}</pre></div>
                              {o.payment && <div><b>Payment:</b><pre className="glass rounded-lg p-3 mt-1 text-xs overflow-auto">{JSON.stringify({transactionId: o.payment.transactionId, name: o.payment.name, mobile: o.payment.mobile, paymentTime: o.payment.paymentTime}, null, 2)}</pre>
                                {o.payment.screenshot && <img src={o.payment.screenshot} className="mt-2 rounded-lg max-h-72" alt="proof"/>}
                              </div>}
                            </div>
                          </DialogContent>
                        </Dialog>
                        {o.status === 'VERIFICATION' && (<>
                          <Button onClick={()=>act(o.id,'verify')} size="sm" className="btn-gradient text-white border-0"><CheckCircle2 className="w-4 h-4 mr-1"/>Verify</Button>
                          <Button onClick={()=>act(o.id,'reject')} size="sm" variant="outline" className="border-red-500/30 text-red-300"><XCircle className="w-4 h-4 mr-1"/>Reject</Button>
                        </>)}
                        {o.status === 'PROCESSING' && (
                          <Button onClick={()=>act(o.id,'complete')} size="sm" className="btn-gradient text-white border-0"><CheckCircle2 className="w-4 h-4 mr-1"/>Complete</Button>
                        )}
                      </div>
                    </div>
                  ))}</div>
                )}
              </Card>
            </>
          )}
          {tab === 'customers' && (
            <>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">All <span className="gradient-text">customers</span></h1>
              <Card className="glass border-white/5 p-4">
                {customers.length === 0 ? <div className="text-center py-10 text-white/60">No customers yet.</div> : (
                  <div className="space-y-2">{customers.map(c => (
                    <div key={c.id} className="glass rounded-xl p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center font-bold">{c.name[0]}</div>
                      <div className="flex-1"><div className="font-medium">{c.name}</div><div className="text-xs text-white/60">{c.email} · {c.phone || 'No phone'}</div></div>
                      <div className="text-xs text-white/50">{new Date(c.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))}</div>
                )}
              </Card>
            </>
          )}
          {tab === 'settings' && (
            <SettingsTab />
          )}
        </motion.div>
      </div>
    </main>
  );
};

function SettingsTab() {
  const [s, setS] = useState({ qrImage: '', upiId: '', payeeName: '' });
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/settings/public').then(r=>r.json()).then(d => { setS(d); setLoading(false); }); }, []);
  const save = async (e) => {
    e.preventDefault();
    try { await api('/admin/settings', { method: 'POST', body: JSON.stringify(s) }); toast.success('Settings saved.'); }
    catch (e) { toast.error(e.message); }
  };
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">Payment <span className="gradient-text">settings</span></h1>
      <Card className="glass border-white/5 p-6 max-w-2xl">
        {loading ? <div className="text-white/60">Loading...</div> : (
          <form onSubmit={save} className="space-y-4">
            <div><label className="text-xs text-white/70 mb-1 block">UPI ID</label><input value={s.upiId} onChange={e=>setS({...s, upiId:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm"/></div>
            <div><label className="text-xs text-white/70 mb-1 block">Payee Name</label><input value={s.payeeName} onChange={e=>setS({...s, payeeName:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm"/></div>
            <div><label className="text-xs text-white/70 mb-1 block">QR Image URL</label><input value={s.qrImage} onChange={e=>setS({...s, qrImage:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm"/></div>
            {s.qrImage && <img src={s.qrImage} className="max-w-[200px] rounded-lg bg-white p-2" alt="QR"/>}
            <Button type="submit" className="btn-gradient text-white border-0">Save changes</Button>
          </form>
        )}
      </Card>
    </>
  );
}
export default App;
