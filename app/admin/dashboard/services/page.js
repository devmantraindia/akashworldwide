'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Loader2, Star, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { api } from '@/lib/client-auth';
import { toast } from 'sonner';
import AdminShell from '@/components/admin/admin-shell';
import { PageHeader } from '@/components/admin/ui-bits';

const EMPTY = { name: '', category: 'govt', price: 0, time: '3-5 days', popular: false, govt: false, active: true, documents: '', description: '' };

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const d = await api('/admin/services');
      setServices(d.services || []);
      setCategories(d.categories || []);
    } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const catName = (id) => categories.find(c => c.id === id)?.name || id;

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name, category: s.category, price: s.price, time: s.time, popular: !!s.popular, govt: !!s.govt, active: s.active !== false, documents: (s.documents || []).join(', '), description: s.description || '' });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) {
        await api(`/admin/services/${editing.slug}`, { method: 'POST', body: JSON.stringify(form) });
        toast.success('Service updated');
      } else {
        await api('/admin/services', { method: 'POST', body: JSON.stringify(form) });
        toast.success('Service created');
      }
      setOpen(false); reload();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  const remove = async (s) => {
    if (!confirm(`Delete "${s.name}"? This cannot be undone.`)) return;
    try { await api(`/admin/services/${s.slug}`, { method: 'DELETE' }); toast.success('Service deleted'); reload(); }
    catch (e) { toast.error(e.message); }
  };

  const toggleActive = async (s) => {
    try { await api(`/admin/services/${s.slug}`, { method: 'POST', body: JSON.stringify({ active: s.active === false }) }); reload(); }
    catch (e) { toast.error(e.message); }
  };

  const visible = services.filter(s => (!cat || s.category === cat) && (!q || s.name.toLowerCase().includes(q.toLowerCase())));

  return (
    <AdminShell>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <PageHeader title="Services" highlight="management" subtitle={`${services.length} services in catalog.`}>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." className="pl-9 bg-white/5 border-white/10 h-9 w-44" />
          </div>
          <Button onClick={openNew} className="btn-gradient text-white border-0 h-9"><Plus className="w-4 h-4 mr-1" />New service</Button>
        </PageHeader>

        <div className="flex gap-2 flex-wrap mb-5">
          <Button onClick={() => setCat('')} size="sm" variant={cat === '' ? 'default' : 'outline'} className={cat === '' ? 'btn-gradient text-white border-0' : 'border-white/10'}>All</Button>
          {categories.map(c => (
            <Button key={c.id} onClick={() => setCat(c.id)} size="sm" variant={cat === c.id ? 'default' : 'outline'} className={cat === c.id ? 'btn-gradient text-white border-0' : 'border-white/10'}>{c.name}</Button>
          ))}
        </div>

        <Card className="glass border-white/5 p-4">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-white/50"><Loader2 className="w-5 h-5 animate-spin mr-2" />Loading...</div>
          ) : visible.length === 0 ? (
            <div className="text-center py-10 text-white/60">No services found.</div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">{visible.map(s => (
              <div key={s.slug} className={`glass rounded-xl p-4 border ${s.active === false ? 'border-white/5 opacity-60' : 'border-white/5'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold flex items-center gap-1.5 truncate">{s.popular && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}{s.name}</div>
                    <div className="text-xs text-white/50 mt-0.5">{catName(s.category)} · {s.time}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold gradient-text">{s.price === 0 ? 'Free' : `₹${s.price}`}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {s.govt && <Badge variant="outline" className="border-white/10 text-xs">Govt</Badge>}
                  <Badge variant="outline" className={s.active === false ? 'border-red-500/30 text-red-300 text-xs' : 'border-emerald-500/30 text-emerald-300 text-xs'}>{s.active === false ? 'Inactive' : 'Active'}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                  <Switch checked={s.active !== false} onCheckedChange={() => toggleActive(s)} aria-label="Toggle active" />
                  <span className="text-xs text-white/50 flex-1">Visible to customers</span>
                  <Button onClick={() => openEdit(s)} size="icon" variant="ghost" className="h-8 w-8" aria-label="Edit"><Pencil className="w-4 h-4" /></Button>
                  <Button onClick={() => remove(s)} size="icon" variant="ghost" className="h-8 w-8 text-red-300" aria-label="Delete"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}</div>
          )}
        </Card>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-strong border-white/10 max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Package className="w-5 h-5 text-purple-300" />{editing ? 'Edit service' : 'New service'}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3 max-h-[70vh] overflow-auto pr-1">
            <div><Label className="mb-1.5 block text-xs">Name</Label><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-white/5 border-white/10" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="mb-1.5 block text-xs">Category</Label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm">
                  {categories.map(c => <option key={c.id} value={c.id} className="bg-zinc-900">{c.name}</option>)}
                </select>
              </div>
              <div><Label className="mb-1.5 block text-xs">Price (₹)</Label><Input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="bg-white/5 border-white/10" /></div>
            </div>
            <div><Label className="mb-1.5 block text-xs">Processing time</Label><Input value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="bg-white/5 border-white/10" /></div>
            <div><Label className="mb-1.5 block text-xs">Required documents (comma separated)</Label><Input value={form.documents} onChange={e => setForm({ ...form, documents: e.target.value })} placeholder="Aadhaar Card, PAN Card" className="bg-white/5 border-white/10" /></div>
            <div><Label className="mb-1.5 block text-xs">Description</Label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm" /></div>
            <div className="flex items-center gap-6 flex-wrap pt-1">
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.popular} onCheckedChange={v => setForm({ ...form, popular: v })} />Popular</label>
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.govt} onCheckedChange={v => setForm({ ...form, govt: v })} />Government</label>
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} />Active</label>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" className="border-white/10" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving} className="btn-gradient text-white border-0">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
