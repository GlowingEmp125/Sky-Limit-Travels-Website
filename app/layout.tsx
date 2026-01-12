import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sky Limit Travels - Discover Your Next Adventure',
  description: 'Travel experiences and unforgettable adventures around the world. Expert travel planning, exclusive destinations, and personalised itineraries.',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/slt-logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/slt-logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-16589485108"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16589485108');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Providers>
          <Navigation />
          <div className="pt-20">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}