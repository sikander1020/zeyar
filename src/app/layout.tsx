import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SITE_ORIGIN } from "@/lib/siteUrl";
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { ToastProvider } from '@/components/layout/ToastProvider';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
};

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
    template: "ZAYBAASH | %s",
    default: "ZAYBAASH",
  },
  description: "ZAYBAASH official store. Premium women's fashion in Pakistan with luxury one-piece dresses, two-piece suits, and signature handcrafted styles.",
  keywords: [
    "ZAYBAASH",
    "beauty with style Pakistan",
    "women's clothing Pakistan",
    "luxury dresses Pakistan",
    "one piece dresses Pakistan",
    "two piece suits Pakistan",
    "premium women fashion Islamabad",
    "Pakistani designer wear online",
    "buy dresses online Pakistan",
    "women fashion Karachi Lahore",
    "zaybaash.com",
    "ZAYBAASH brand",
  ],
  authors: [{ name: 'ZAYBAASH', url: SITE_ORIGIN }],
  creator: 'ZAYBAASH',
  publisher: 'ZAYBAASH',
  category: 'fashion',
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    title: "ZAYBAASH — Premium Women's Fashion in Pakistan",
    description: "Shop ZAYBAASH — Pakistan's premier luxury women's fashion brand. One-piece dresses, two-piece suits, and signature handcrafted pieces. Free delivery across major cities.",
    url: SITE_ORIGIN,
    siteName: 'ZAYBAASH',
    locale: 'en_PK',
    type: "website",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZAYBAASH — Beauty with Style in Pakistan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@zaybaash',
    creator: '@zaybaash',
    title: "ZAYBAASH — Premium Women's Fashion in Pakistan",
    description: "Pakistan's premier luxury women's fashion. Shop one-piece dresses, two-piece suits & signature pieces. Free delivery.",
    images: ['/og-image.png'],
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
  },
  alternates: {
    canonical: SITE_ORIGIN,
    languages: {
      'en-PK': SITE_ORIGIN,
      'x-default': SITE_ORIGIN,
    },
  },
  other: {
    'facebook-domain-verification': 'i1l8y9vlrmov8985cem7vqx9yty908',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: 'ZAYBAASH',
    alternateName: 'Zaybaash Fashion',
    url: SITE_ORIGIN,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_ORIGIN}/apple-icon.png`,
      width: 192,
      height: 192,
    },
    image: `${SITE_ORIGIN}/og-image.png`,
    description: 'ZAYBAASH is Pakistan\'s premier luxury women\'s fashion brand. Beauty with Style — premium one-piece dresses, two-piece suits and signature handcrafted pieces delivered across Pakistan.',
    foundingDate: '2026',
    foundingLocation: 'Islamabad, Pakistan',
    areaServed: 'PK',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+92-321-964-3246',
        contactType: 'customer service',
        email: 'care.zaybaash@gmail.com',
        availableLanguage: ['en', 'ur'],
        areaServed: 'PK',
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '10:00',
          closes: '18:00',
        },
      },
    ],
    sameAs: [
      'https://www.instagram.com/zaybaash/',
      'https://www.tiktok.com/@zaybaash/',
      'https://www.facebook.com/zaybaash/',
      'https://x.com/zaybaash',
    ],
  };

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    url: SITE_ORIGIN,
    name: 'ZAYBAASH',
    description: 'Pakistan\'s premier luxury women\'s fashion brand',
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    inLanguage: 'en-PK',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_ORIGIN}/dresses?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_ORIGIN,
      },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
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
