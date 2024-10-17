

import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';
import { Inter } from "next/font/google";
import Footer from '@/components/ui/Footer';
import { createClient } from '@/utils/supabase/server';
import {
  getUser
} from '@/utils/supabase/queries';
import GoogleAnalytics from '@/GoogleAnalytics';
import FbPixel from '@/FbPixel';

import ConsentBanner from '@/components/ui/CookieConsent/page';

const title = 'WebBot';
const description = 'Custom ChatGPT for Your Website.';
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  
  title: {
    template: `%s | ${title}`,
    default: 'webBot',
  },
  description: description,
  keywords: [
    'ChatGPT',
    'ChatGPT-4',
    'OpenAI',
    'AI',
    'Artificial Intelligence',
    'Chatbot',
    'AI Chatbot',
    'AI Assistant',
    'AI Chat',
    'AI Chatbot',
    'AI Chatbot',],
  authors: [{ name: 'webBot', url: getURL() }],
  creator: 'webBot',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: title,
    description: description,
    url: getURL(),
    siteName: title,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,  
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'app',
    title: 'Next.js',
    description: 'The React Framework for the Web',
    siteId: '1467726470533754880',
    creator: '@nextjs',
    creatorId: '1467726470533754880',
    images: {
      url: 'https://nextjs.org/og.png',
      alt: 'Next.js Logo',
    },
    app: {
      name: 'twitter_app',
      id: {
        iphone: 'twitter_app://iphone',
        ipad: 'twitter_app://ipad',
        googleplay: 'twitter_app://googleplay',
      },
      url: {
        iphone: 'https://iphone_url',
        ipad: 'https://ipad_url',
      },
    },
  },
  // manifest: 'https://nextjs.org/manifest.json',
  category: 'technology',
  
  
};


export default async function RootLayout({ children, params }: PropsWithChildren<{ params: { slug: string } }>) {

  const isDashboard = params.slug === 'dashboard';
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <head>
        <GoogleAnalytics GA_MEASUREMENT_ID={`${process.env.GA_MEASUREMENT_ID}`} />
        {/* <FbPixel /> */}
        {/* <CookieConsentBanner /> */}
      </head>
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <main
          id="skip"
          className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
        >
          {children}
        </main>

        <Suspense>
          <Toaster />
        </Suspense>
        <ConsentBanner/>
      </body>
    </html>
  );
}
