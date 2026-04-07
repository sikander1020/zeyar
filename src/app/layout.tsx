import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://zeyar.me'),
  title: {
    template: "%s | ZEYAR — Luxury Women's Fashion in Pakistan",
    default: "ZEYAR — Luxury Women's Fashion in Pakistan",
  },
  description: "Discover ZEYAR's exclusive collection of luxury women's fashion in Pakistan. Elegant one-piece statement pieces, matched two-piece sets, and premium designer wear for the modern Pakistani woman.",
  keywords: "ZEYAR, modern and royal touch Pakistan, women's clothing, elegant dresses, one piece dresses, two piece suits, premium fashion Karachi, Lahore, Islamabad",
  openGraph: {
    title: "ZEYAR — Luxury Women's Fashion Pakistan",
    description: "Discover ZEYAR's exclusive collection of luxury women's fashion in Pakistan.",
    url: 'https://zeyar.me',
    siteName: 'ZEYAR',
    locale: 'en_PK',
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "ZEYAR — Luxury Women's Fashion Pakistan",
    description: "Discover ZEYAR's exclusive collection of luxury women's fashion in Pakistan.",
  },
  alternates: {
    canonical: '/',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-PK">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
