import Link from 'next/link';
import { Sparkles, Mail, MapPin, Phone, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-950/20 pointer-events-none" />
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="font-bold text-lg"><span className="gradient-text">Digital</span> Portal</div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">India’s premium digital service portal. 150+ government & utility services available online, securely, with assistance.</p>
            <div className="flex gap-3 mt-5">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg glass hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/services?category=govt" className="hover:text-white">Government Documents</Link></li>
              <li><Link href="/services?category=tax" className="hover:text-white">Tax & Compliance</Link></li>
              <li><Link href="/services?category=banking" className="hover:text-white">Banking</Link></li>
              <li><Link href="/services?category=insurance" className="hover:text-white">Insurance</Link></li>
              <li><Link href="/services?category=travel" className="hover:text-white">Travel</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/admin" className="hover:text-white">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-purple-400" /><span>support@digitalportal.in</span></li>
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-purple-400" /><span>+91 80000 12345</span></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-purple-400" /><span>Bangalore, India</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <div>© {new Date().getFullYear()} Digital Service Portal. All rights reserved.</div>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
            <Link href="#" className="hover:text-white">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
