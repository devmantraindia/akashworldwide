'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

const App = () => (
  <main className="min-h-screen">
    <Navbar/>
    <section className="pt-32 pb-20 container mx-auto px-4 max-w-3xl">
      <Badge variant="outline" className="mb-4 border-white/10">Contact</Badge>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Let’s <span className="gradient-text">talk</span>.</h1>
      <p className="text-white/60 mb-10">Need help with a service? Have feedback? Want to partner with us? Reach out anytime.</p>
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[{i:Mail, t:'Email', v:'support@digitalportal.in'},{i:Phone, t:'Phone', v:'+91 80000 12345'},{i:MapPin, t:'Address', v:'Bangalore, India'}].map((c,i)=>(
          <Card key={i} className="glass border-white/5 p-5"><c.i className="w-5 h-5 text-purple-300 mb-2"/><div className="text-xs text-white/50">{c.t}</div><div className="font-semibold mt-1">{c.v}</div></Card>
        ))}
      </div>
      <Card className="glass-strong border-white/10 p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Prefer self-service?</h3>
        <p className="text-white/60 mb-5">Find instant answers in our FAQ or open a support ticket from your dashboard.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button asChild variant="outline" className="border-white/10"><Link href="/faq">View FAQ</Link></Button>
          <Button asChild className="btn-gradient text-white border-0"><Link href="/dashboard">Open Support Ticket</Link></Button>
        </div>
      </Card>
    </section>
    <Footer/>
  </main>
);
export default App;
