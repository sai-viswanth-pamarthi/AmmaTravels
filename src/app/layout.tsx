import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsAppButton } from '@/components/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Amma Travels — Car & Bike Rental in Kakinada, Andhra Pradesh',
  description:
    'Reliable self-drive car and bike rentals in Kakinada, AP. Clear rates, verified fleet, complimentary helmets, and local hub pickup.',
  keywords: [
    'Car rental Kakinada',
    'Bike rental Kakinada',
    'Royal Enfield rental Kakinada',
    'Activa rental Kakinada',
    'Self-drive cars Kakinada',
    'Amma Travels',
  ],
  authors: [{ name: 'Amma Travels' }],
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Amma Travels — Self-Drive Car & Bike Rentals in Kakinada',
    description:
      'Discover cars and bikes for your next journey in Kakinada with transparent pricing and verified fleet.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F6F5F2] text-[#242424] flex flex-col antialiased selection:bg-[#C49A52] selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
