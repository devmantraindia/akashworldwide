'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getUser, clearAuth } from '@/lib/client-auth';
import { Menu, X, Sparkles, LayoutDashboard, LogOut } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { setUser(getUser()); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const logout = () => { clearAuth(); setUser(null); router.push('/'); };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? 'py-2' : 'py-4'}`}
    >
      <div className="container mx-auto px-4">
        <div className={`glass-strong rounded-2xl flex items-center justify-between px-5 py-3 transition-all`}>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="font-bold text-lg tracking-tight">
              <span className="gradient-text">akash</span><span className="text-white">worldwide</span>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5 ${pathname === l.href ? 'text-white bg-white/5' : 'text-white/70 hover:text-white'}`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <Button asChild variant="ghost" size="sm" className="text-white/80">
                  <Link href={user.role === 'customer' ? '/dashboard' : '/admin/dashboard'}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />Dashboard
                  </Link>
                </Button>
                <Button onClick={logout} variant="ghost" size="sm" className="text-white/80"><LogOut className="w-4 h-4" /></Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="text-white/80"><Link href="/login">Sign in</Link></Button>
                <Button asChild size="sm" className="btn-gradient text-white border-0"><Link href="/signup">Get started</Link></Button>
              </>
            )}
          </div>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-white/5">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="glass rounded-2xl mt-2 p-4 lg:hidden">
              <div className="flex flex-col gap-1">
                {LINKS.map(l => (
                  <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-white/5">{l.label}</Link>
                ))}
                <div className="pt-2 border-t border-white/10 mt-2 flex flex-col gap-2">
                  {user ? (
                    <>
                      <Button asChild variant="outline" className="w-full"><Link href={user.role === 'customer' ? '/dashboard' : '/admin/dashboard'}>Dashboard</Link></Button>
                      <Button onClick={logout} variant="ghost" className="w-full">Logout</Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="w-full"><Link href="/login">Sign in</Link></Button>
                      <Button asChild className="w-full btn-gradient text-white"><Link href="/signup">Get started</Link></Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
