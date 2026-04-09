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
    description: `Shop the ${product.name} at ZAYBAASH, Pakistan's premium beauty with style destination. ${product.description}`,
    openGraph: {
      title: `${product.name} | ZAYBAASH Pakistan`,
      description: `Shop the ${product.name} at ZAYBAASH, Pakistan's premium beauty with style destination.`,
      url: `https://zaybaash.com/product/${product.id}`,
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
      title: `${product.name} | ZAYBAASH Pakistan`,
      description: `Shop the ${product.name} at ZAYBAASH, Pakistan's premium beauty with style destination.`,
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
