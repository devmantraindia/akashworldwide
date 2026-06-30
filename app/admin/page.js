'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { setAuth } from '@/lib/client-auth';
import { toast } from 'sonner';

const App = () => {
  const router = useRouter();
  const [email, setEmail] = useState('info.akashworldwide@gmail.com');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setAuth(data.token, data.user);
      toast.success(`Welcome ${data.user.role.replace('_',' ')}!`);
      router.push('/admin/dashboard');
    } catch (err) { toast.error(err.message); } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-mesh">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl orb" />
        <div className="absolute bottom-20 right-0 w-[28rem] h-[28rem] bg-fuchsia-500/20 rounded-full blur-3xl orb" style={{animationDelay:'3s'}} />
      </div>
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-md w-full">
        <Card className="glass-strong border-white/10 p-8">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-white"/></div>
            <div className="font-bold text-lg"><span className="gradient-text">Admin</span> Console</div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Administrator login</h1>
          <p className="text-white/60 text-sm mb-6">Restricted access. Authorised personnel only.</p>
          <form onSubmit={submit} className="space-y-4">
            <div><Label className="mb-1.5 block text-xs">Email</Label>
              <div className="relative"><Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40"/>
                <Input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="pl-9 bg-white/5 border-white/10 h-11"/></div></div>
            <div><Label className="mb-1.5 block text-xs">Password</Label>
              <div className="relative"><Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40"/>
                <Input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="pl-9 bg-white/5 border-white/10 h-11"/></div></div>
            <Button type="submit" disabled={loading} className="w-full btn-gradient text-white border-0 h-11">{loading ? 'Signing in...' : <>Sign in <ArrowRight className="w-4 h-4 ml-1"/></>}</Button>
          </form>
          <div className="mt-6 glass rounded-xl p-3 text-xs text-white/60">
            <div className="font-semibold text-white mb-1">Default Super Admin</div>
            <div>Email: <code className="text-purple-300">info.akashworldwide@gmail.com</code></div>
            <div>Password: <code className="text-purple-300">Admin@123</code></div>
          </div>
        </Card>
      </motion.div>
    </main>
  );
};
export default App;
