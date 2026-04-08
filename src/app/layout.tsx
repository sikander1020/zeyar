import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://zeyar.me'),
  title: {
    template: "%s | ZAYBAASH — Beauty with Style in Pakistan",
    default: "ZAYBAASH — Beauty with Style in Pakistan",
  },
  description: "Discover ZAYBAASH's exclusive collection of beauty with style in Pakistan. Elegant one-piece statement pieces, matched two-piece sets, and premium designer wear for the modern Pakistani woman.",
  keywords: "ZAYBAASH, beauty with style Pakistan, women's clothing, elegant dresses, one piece dresses, two piece suits, premium fashion Karachi, Lahore, Islamabad",
  openGraph: {
    title: "ZAYBAASH — Beauty with Style Pakistan",
    description: "Discover ZAYBAASH's exclusive collection of beauty with style in Pakistan.",
    url: 'https://zeyar.me',
    siteName: 'ZAYBAASH',
    locale: 'en_PK',
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "ZAYBAASH — Beauty with Style Pakistan",
    description: "Discover ZAYBAASH's exclusive collection of beauty with style in Pakistan.",
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
