'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Lock, Mail, User as UserIcon, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { setAuth } from '@/lib/client-auth';
import { toast } from 'sonner';

const App = () => {
  const router = useRouter();
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(f) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      setAuth(data.token, data.user);
      toast.success(`Welcome aboard, ${data.user.name}!`);
      router.push('/dashboard');
    } catch (err) { toast.error(err.message); } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20 min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-md w-full">
          <Card className="glass-strong border-white/10 p-8">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center"><Sparkles className="w-5 h-5 text-white"/></div>
              <div className="font-bold text-lg"><span className="gradient-text">akash</span><span className="text-white">worldwide</span></div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Create account</h1>
            <p className="text-white/60 text-sm mb-6">Free forever. No credit card required.</p>
            <form onSubmit={submit} className="space-y-4">
              <div><Label className="mb-1.5 block text-xs">Full Name</Label>
                <div className="relative"><UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40"/>
                  <Input required value={f.name} onChange={e=>setF({...f, name:e.target.value})} className="pl-9 bg-white/5 border-white/10 h-11"/></div></div>
              <div><Label className="mb-1.5 block text-xs">Email</Label>
                <div className="relative"><Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40"/>
                  <Input type="email" required value={f.email} onChange={e=>setF({...f, email:e.target.value})} className="pl-9 bg-white/5 border-white/10 h-11"/></div></div>
              <div><Label className="mb-1.5 block text-xs">Mobile</Label>
                <div className="relative"><Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40"/>
                  <Input required value={f.phone} onChange={e=>setF({...f, phone:e.target.value})} className="pl-9 bg-white/5 border-white/10 h-11"/></div></div>
              <div><Label className="mb-1.5 block text-xs">Password</Label>
                <div className="relative"><Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40"/>
                  <Input type="password" required minLength={6} value={f.password} onChange={e=>setF({...f, password:e.target.value})} className="pl-9 bg-white/5 border-white/10 h-11"/></div></div>
              <Button type="submit" disabled={loading} className="w-full btn-gradient text-white border-0 h-11">{loading ? 'Creating...' : <>Create account <ArrowRight className="w-4 h-4 ml-1"/></>}</Button>
            </form>
            <div className="text-center text-sm text-white/60 mt-6">Already have one? <Link href="/login" className="text-purple-300 hover:text-purple-200 font-medium">Sign in</Link></div>
          </Card>
        </motion.div>
      </section>
    </main>
  );
};
export default App;
