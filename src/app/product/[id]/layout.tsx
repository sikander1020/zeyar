import { Metadata } from 'next';
import { SITE_ORIGIN } from '@/lib/siteUrl';

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  return {
    title: 'Product Details',
    description: 'Shop premium ZAYBAASH pieces with live catalog pricing and availability.',
    openGraph: {
      title: 'Product Details | ZAYBAASH Pakistan',
      description: 'Shop premium ZAYBAASH pieces with live catalog pricing and availability.',
      url: `${SITE_ORIGIN}/product/${params.id}`,
      images: [
        {
          url: '/apple-icon.png',
          width: 800,
          height: 800,
          alt: 'ZAYBAASH',
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Product Details | ZAYBAASH Pakistan',
      description: 'Shop premium ZAYBAASH pieces with live catalog pricing and availability.',
      images: ['/apple-icon.png'],
    }
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
