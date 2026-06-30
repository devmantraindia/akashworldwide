import './globals.css';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'Digital Service Portal — 150+ Government & Utility Services Online',
  description: 'Enterprise digital service portal for PAN, Aadhaar, Passport, GST, ITR, Insurance, Recharge, Booking and 150+ services. Fast, secure and trusted by 50,000+ users.',
  keywords: 'PAN card, Aadhaar, Passport, GST, ITR, Voter ID, Driving Licence, Digital Services, eGov, CSC, BBPS',
  openGraph: { title: 'Digital Service Portal', description: '150+ Digital Services. Trusted by 50,000+ users.', type: 'website' },
  icons: { icon: '/favicon.ico' },
};

export const viewport = { themeColor: '#08080c' };

const App = ({ children }) => {
  return (
    <html lang="en" className="dark">
      <body className="bg-mesh noise text-foreground antialiased min-h-screen">
        {children}
        <Toaster richColors position="top-center" theme="dark" />
      </body>
    </html>
  );
};

export default App;
