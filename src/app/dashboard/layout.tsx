import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard — ZEYAR',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#FAF7F4' }}>
        {children}
      </body>
    </html>
  );
}
