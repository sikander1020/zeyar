import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZEYAR — Luxury Women's Fashion",
  description: "Discover ZEYAR's exclusive collection of luxury women's fashion. Elegant dresses, abayas, casual and formal wear crafted for the modern woman.",
  keywords: "ZEYAR, luxury fashion, women's clothing, elegant dresses, abaya, premium fashion",
  openGraph: {
    title: "ZEYAR — Luxury Women's Fashion",
    description: "Discover ZEYAR's exclusive collection of luxury women's fashion.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
