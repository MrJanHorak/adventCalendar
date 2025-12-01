import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import CharityBanner from '@/components/CharityBanner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Doorly Advent - Create Your Magical Calendar',
  description:
    'Create and share personalized advent calendars with your loved ones. Open a new surprise each day in December!',
  metadataBase: new URL('https://doorly-advent.vercel.app'),
  openGraph: {
    title: 'Doorly Advent - Create Your Magical Calendar',
    description:
      'Create and share personalized advent calendars with your loved ones. Open a new surprise each day in December!',
    url: 'https://doorly-advent.vercel.app',
    siteName: 'Doorly Advent',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Doorly Advent - Personalized Advent Calendars',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Doorly Advent - Create Your Magical Calendar',
    description:
      'Create and share personalized advent calendars with your loved ones. Open a new surprise each day in December!',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        {/* Google Analytics */}
        <Script
          strategy='afterInteractive'
          src='https://www.googletagmanager.com/gtag/js?id=G-F7Q8ZBCPYJ'
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F7Q8ZBCPYJ');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <CharityBanner />
      </body>
    </html>
  );
}
