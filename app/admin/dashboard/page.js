'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, Clock, TrendingUp, IndianRupee, CheckCircle2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api } from '@/lib/client-auth';
import { toast } from 'sonner';
import AdminShell from '@/components/admin/admin-shell';

export default function OverviewPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api('/admin/stats').then(setStats).catch(e => toast.error(e.message));
  }, []);

  return (
    <AdminShell>
      {!stats ? (
        <div className="flex items-center justify-center py-32 text-white/50"><Loader2 className="w-6 h-6 animate-spin mr-2" />Loading overview...</div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-8">
            <div className="text-sm text-white/50">Welcome back</div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Operations <span className="gradient-text">overview</span></h1>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Revenue', v: `₹${stats.revenue.toLocaleString()}`, icon: IndianRupee, color: 'from-emerald-500 to-teal-500' },
              { label: 'Total Orders', v: stats.totalOrders, icon: ShoppingBag, color: 'from-purple-500 to-fuchsia-500' },
              { label: 'Pending Verification', v: stats.pending, icon: Clock, color: 'from-amber-500 to-orange-500' },
              { label: 'Customers', v: stats.customers, icon: Users, color: 'from-blue-500 to-cyan-500' },
            ].map((s, i) => (
              <Card key={i} className="glass border-white/5 p-5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-5 h-5 text-white" /></div>
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-xs text-white/60">{s.label}</div>
              </Card>
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="glass border-white/5 p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Orders — last 7 days</h3><TrendingUp className="w-4 h-4 text-purple-300" /></div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: 'rgba(15,13,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                    <Line type="monotone" dataKey="orders" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="glass border-white/5 p-6">
              <h3 className="font-semibold mb-4">Order pipeline</h3>
              <div className="space-y-3">
                {[
                  { label: 'Awaiting verification', v: stats.pending, icon: Clock, color: 'text-amber-300' },
                  { label: 'Processing', v: stats.processing, icon: Loader2, color: 'text-purple-300' },
                  { label: 'Completed', v: stats.completed, icon: CheckCircle2, color: 'text-emerald-300' },
                ].map((r, i) => (
                  <div key={i} className="glass rounded-xl p-3 flex items-center gap-3">
                    <r.icon className={`w-5 h-5 ${r.color}`} />
                    <span className="flex-1 text-sm text-white/70">{r.label}</span>
                    <span className="font-bold text-lg">{r.v}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      )}
    </AdminShell>
  );
}
