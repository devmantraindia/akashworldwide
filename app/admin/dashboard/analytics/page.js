'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, ShoppingBag, TrendingUp, Percent, Loader2, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api } from '@/lib/client-auth';
import { toast } from 'sonner';
import AdminShell from '@/components/admin/admin-shell';
import { PageHeader } from '@/components/admin/ui-bits';

const COLORS = ['#a855f7', '#22c55e', '#f59e0b', '#3b82f6', '#ec4899', '#14b8a6', '#ef4444', '#8b5cf6'];
const tooltipStyle = { background: 'rgba(15,13,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 };

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => { api('/admin/analytics').then(setData).catch(e => toast.error(e.message)); }, []);

  const exportCsv = () => {
    if (!data) return;
    const rows = [['Date', 'Revenue', 'Orders'], ...data.daily.map(d => [d.day, d.revenue, d.orders])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'akashworldwide-analytics.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminShell>
      {!data ? (
        <div className="flex items-center justify-center py-32 text-white/50"><Loader2 className="w-6 h-6 animate-spin mr-2" />Loading analytics...</div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <PageHeader title="Analytics &" highlight="reports" subtitle="Revenue, conversion and service performance.">
            <Button onClick={exportCsv} variant="outline" className="border-white/10 h-9"><Download className="w-4 h-4 mr-1" />Export CSV</Button>
          </PageHeader>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Revenue', v: `₹${data.revenue.toLocaleString()}`, icon: IndianRupee, color: 'from-emerald-500 to-teal-500' },
              { label: 'Avg Order Value', v: `₹${data.aov.toLocaleString()}`, icon: TrendingUp, color: 'from-purple-500 to-fuchsia-500' },
              { label: 'Conversion Rate', v: `${data.conversion}%`, icon: Percent, color: 'from-amber-500 to-orange-500' },
              { label: 'Paid Orders', v: `${data.paidOrders}/${data.totalOrders}`, icon: ShoppingBag, color: 'from-blue-500 to-cyan-500' },
            ].map((s, i) => (
              <Card key={i} className="glass border-white/5 p-5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-5 h-5 text-white" /></div>
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-xs text-white/60">{s.label}</div>
              </Card>
            ))}
          </div>

          <Card className="glass border-white/5 p-6 mb-6">
            <h3 className="font-semibold mb-4">Revenue — last 30 days</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.daily}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" fontSize={11} interval={4} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={2} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card className="glass border-white/5 p-6">
              <h3 className="font-semibold mb-4">Order status breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {data.statusData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="glass border-white/5 p-6">
              <h3 className="font-semibold mb-4">Revenue by category</h3>
              {data.catData.length === 0 ? <div className="text-sm text-white/50 py-16 text-center">No revenue data yet.</div> : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.catData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90}>
                        {data.catData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </div>

          <Card className="glass border-white/5 p-6">
            <h3 className="font-semibold mb-4">Top services by revenue</h3>
            {data.topServices.length === 0 ? <div className="text-sm text-white/50 py-10 text-center">No sales yet.</div> : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.topServices} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                    <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={11} width={120} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                    <Bar dataKey="revenue" fill="#a855f7" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </AdminShell>
  );
}
