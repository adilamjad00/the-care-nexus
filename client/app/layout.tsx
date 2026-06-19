import type { Metadata } from 'next';
import {
  Plus_Jakarta_Sans,
  Fraunces,
  Noto_Nastaliq_Urdu,
  Baloo_Bhaijaan_2,
} from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/providers/StoreProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { NextAuthProvider } from '@/providers/NextAuthProvider';
import { Toaster } from 'react-hot-toast';

/* Plus Jakarta Sans — closest Google Fonts match to Aspekta (geometric, clean, variable) */
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable:
    '--font-inter' /* keep CSS var name so all existing --font-inter refs still resolve */,
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'SOFT'],
});

const notoUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  variable: '--font-noto-urdu',
  display: 'swap',
  weight: ['400', '700'],
});

const balooUrdu = Baloo_Bhaijaan_2({
  subsets: ['arabic'],
  variable: '--font-baloo-urdu',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title:
    'The Care Nexus | AI-Powered Voice-Enabled Healthcare Management Platform',
  description: 'Digital Healthcare Platform',
  icons: {
    icon: '/logo4.PNG',
    apple: '/logo4.PNG',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${plusJakarta.variable} ${fraunces.variable} ${notoUrdu.variable} ${balooUrdu.variable}`}
      suppressHydrationWarning
    >
      <body
        className='font-sans antialiased bg-background text-text-primary'
        suppressHydrationWarning
      >
        <StoreProvider>
          <LanguageProvider>
            <NextAuthProvider>{children}</NextAuthProvider>
            <Toaster
              containerStyle={{ zIndex: 99999 }}
              toastOptions={{ style: { zIndex: 99999 } }}
            />
          </LanguageProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
