'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const Q = [
  ['How do I place an order?', 'Pick a service, fill basic details, complete the UPI QR payment and submit your transaction ID. Once verified, your order moves to processing automatically.'],
  ['How does manual QR payment work?', 'After placing an order, scan the UPI QR with any UPI app (GPay, PhonePe, Paytm), make the payment, then upload the screenshot and enter your transaction ID. Admin verifies usually within minutes during business hours.'],
  ['Is my data secure?', 'Yes. All documents are encrypted at rest, accessed only by authorised operators, and every action is audit-logged.'],
  ['Can I get a refund?', 'Yes. If your order is rejected for our reasons, full refund within 5–7 business days. See our Refund Policy for details.'],
  ['Do you cover all states of India?', 'Yes. All central and state-level services are supported via our CSC and partner network.'],
  ['How fast is processing?', 'Most services are completed within 24–48 hours. Some govt services (e.g. Passport) follow official SLA shown on each service page.'],
  ['Do you offer business accounts?', 'Yes. Check the Pricing page or contact sales for enterprise plans with dedicated relationship managers.'],
  ['What payment methods do you accept?', 'Currently UPI via manual QR. All major UPI apps work: GPay, PhonePe, Paytm, BHIM, Amazon Pay.'],
];

const App = () => (
  <main className="min-h-screen">
    <Navbar/>
    <section className="pt-32 pb-20 container mx-auto px-4 max-w-3xl">
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-4 border-white/10">FAQ</Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Frequently asked <span className="gradient-text">questions</span></h1>
      </div>
      <Accordion type="single" collapsible className="glass rounded-2xl p-2">
        {Q.map(([q, a], i) => (
          <AccordionItem key={i} value={`q${i}`} className="border-white/5">
            <AccordionTrigger className="px-4 hover:no-underline text-left">{q}</AccordionTrigger>
            <AccordionContent className="px-4 text-white/60">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
    <Footer/>
  </main>
);
export default App;
