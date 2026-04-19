import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SITE_ORIGIN } from "@/lib/siteUrl";
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { ToastProvider } from '@/components/layout/ToastProvider';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  icons: {
    icon: [
      { url: '/apple-icon.png', type: 'image/png', sizes: 'any' },
      { url: '/apple-icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/apple-icon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/apple-icon.png',
  },
  title: {
    template: "%s | ZAYBAASH — Beauty with Style in Pakistan",
    default: "ZAYBAASH — Beauty with Style in Pakistan | Premium Women's Fashion",
  },
  description: "Discover ZAYBAASH's exclusive collection of beauty with style in Pakistan. Elegant one-piece statement pieces, matched two-piece sets, and premium designer wear for the modern Pakistani woman. Shop luxury fashion online.",
  keywords: "ZAYBAASH, beauty with style Pakistan, women's clothing Pakistan, elegant dresses, one piece dresses, two piece suits, premium fashion Karachi, Lahore, Islamabad, Pakistani designer wear, luxury fashion online",
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    title: "ZAYBAASH — Beauty with Style Pakistan | Premium Fashion",
    description: "Discover ZAYBAASH's exclusive collection of beauty with style in Pakistan. Shop elegant dresses, one-piece & two-piece designer wear.",
    url: SITE_ORIGIN,
    siteName: 'ZAYBAASH',
    locale: 'en_PK',
    type: "website",
    images: [
      {
        url: '/apple-icon.png',
        width: 192,
        height: 192,
        alt: 'ZAYBAASH Logo - Beauty with Style',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: "ZAYBAASH — Beauty with Style Pakistan",
    description: "Discover ZAYBAASH's exclusive collection of premium women's fashion in Pakistan.",
    images: ['/apple-icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ZAYBAASH',
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/apple-icon.png`,
    description: 'Beauty with Style in Pakistan - Premium women\'s fashion',
    sameAs: [
      'https://www.instagram.com/zaybaash/',
      'https://www.tiktok.com/@zaybaash/',
      'https://facebook.com/zaybaash',
    ],
  };

  return (
    <html lang="en-PK">
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-ERQGVY9029"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-ERQGVY9029');`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const stored = localStorage.getItem('zaybaash-theme');
    const theme = stored === 'dark' || stored === 'light'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
