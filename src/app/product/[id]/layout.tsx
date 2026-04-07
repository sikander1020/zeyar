import { products } from '@/data/products';
import { Metadata } from 'next';

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const product = products.find((p) => p.id === params.id);
  if (!product) {
    return { title: 'Product Not Found' };
  }
  return {
    title: product.name,
    description: `Shop the ${product.name} at ZEYAR, Pakistan's premium luxury fashion destination. ${product.description}`,
    openGraph: {
      title: `${product.name} | ZEYAR Pakistan`,
      description: `Shop the ${product.name} at ZEYAR, Pakistan's premium luxury fashion destination.`,
      url: `https://zeyar.me/product/${product.id}`,
      images: [
        {
          url: product.images[0] || '',
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ZEYAR Pakistan`,
      description: `Shop the ${product.name} at ZEYAR, Pakistan's premium luxury fashion destination.`,
      images: [product.images[0] || ''],
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
