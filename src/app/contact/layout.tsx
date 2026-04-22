import type { Metadata } from 'next';
import { SITE_ORIGIN } from '@/lib/siteUrl';

export const metadata: Metadata = {
  title: 'Contact Us — Get in Touch with ZAYBAASH',
  description: 'Contact ZAYBAASH for support, order inquiries, or styling advice. Reach our team by email, phone, or WhatsApp. Located in Islamabad, Pakistan. We respond within 24 hours.',
  alternates: {
    canonical: `${SITE_ORIGIN}/contact`,
  },
  openGraph: {
    title: 'Contact ZAYBAASH — Customer Support & Inquiries',
    description: "Get in touch with the ZAYBAASH team. We're here to help with orders, returns, size advice and more. Response within 24 hours.",
    url: `${SITE_ORIGIN}/contact`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact ZAYBAASH',
      },
    ],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
