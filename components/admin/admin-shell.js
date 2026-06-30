'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Users, CreditCard, Settings, LogOut, ShieldCheck, Package, BarChart3, FileText, UserCog, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api, getUser, clearAuth } from '@/lib/client-auth';

const NAV = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/dashboard/orders', label: 'Orders', icon: ShoppingBag, badgeKey: 'pending' },
  { href: '/admin/dashboard/services', label: 'Services', icon: Package },
  { href: '/admin/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/admin/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/dashboard/content', label: 'Content', icon: FileText },
  { href: '/admin/dashboard/admins', label: 'Admin Users', icon: UserCog, superOnly: true },
  { href: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [pending, setPending] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u || !['admin', 'super_admin'].includes(u.role)) { router.push('/admin'); return; }
    setUser(u);
    api('/admin/stats').then(s => setPending(s.pending || 0)).catch(() => {});
  }, [router]);

  useEffect(() => { setOpen(false); }, [pathname]);

  const logout = () => { clearAuth(); router.push('/admin'); };

  if (!user) return null;

  const items = NAV.filter(it => !it.superOnly || user.role === 'super_admin');

  const SidebarInner = (
    <>
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-white" /></div>
        <div className="font-bold"><span className="gradient-text">akashworldwide</span></div>
      </div>
      <nav className="space-y-1 flex-1 overflow-y-auto">
        {items.map(it => {
          const active = pathname === it.href;
          const badge = it.badgeKey === 'pending' ? pending : 0;
          return (
            <Link key={it.href} href={it.href} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${active ? 'bg-purple-500/15 text-white border border-purple-500/30' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
              <it.icon className="w-4 h-4" /><span className="flex-1">{it.label}</span>
              {badge ? <Badge className="bg-amber-500 text-black">{badge}</Badge> : null}
            </Link>
          );
        })}
      </nav>
      <div className="glass rounded-xl p-3 mt-3">
        <div className="text-xs text-white/50">Logged in as</div>
        <div className="text-sm font-semibold truncate">{user.email}</div>
        <div className="text-xs text-purple-300 mt-1 capitalize">{user.role.replace('_', ' ')}</div>
        <Button onClick={logout} variant="ghost" size="sm" className="w-full mt-3"><LogOut className="w-4 h-4 mr-2" />Logout</Button>
      </div>
    </>
  );

  return (
    <main className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="w-64 glass-strong border-r border-white/10 p-5 hidden lg:flex flex-col fixed top-0 bottom-0 left-0 z-40">
        {SidebarInner}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 glass-strong border-b border-white/10 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-white" /></div>
          <span className="font-bold text-sm gradient-text">akashworldwide</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="w-5 h-5" /></Button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 glass-strong border-r border-white/10 p-5 flex flex-col">
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="absolute top-3 right-3" aria-label="Close menu"><X className="w-5 h-5" /></Button>
            {SidebarInner}
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64 p-5 pt-20 lg:p-10">
        {children}
      </div>
    </main>
  );
}
