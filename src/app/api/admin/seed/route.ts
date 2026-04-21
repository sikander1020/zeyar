import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { connectDB } from '@/lib/mongodb';

const IMG_DUMMY_1 = "https://images.unsplash.com/photo-1550614000-4b95f463cb14?q=80&w=600&auto=format&fit=crop";
const IMG_DUMMY_2 = "https://images.unsplash.com/photo-1583391733959-f156d90b2405?q=80&w=600&auto=format&fit=crop";
const IMG_DUMMY_3 = "https://images.unsplash.com/photo-1512413513146-24e54e4c274d?q=80&w=600&auto=format&fit=crop";
const IMG_DUMMY_4 = "https://images.unsplash.com/photo-1574349141014-9b596e1a4dca?q=80&w=600&auto=format&fit=crop";

export async function GET() {
  try {
    await connectDB();

    // 1. Create or Update Categories
    const categoriesData = [
      { categoryId: 'CAT-KHAADI', name: 'Khaadi Formals', slug: 'khaadi-formals', description: 'Classic Khaadi festive wear', image: IMG_DUMMY_1 },
      { categoryId: 'CAT-LIMELIGHT', name: 'Limelight Pret', slug: 'limelight-pret', description: 'Chic everyday pret by Limelight', image: IMG_DUMMY_2 },
      { categoryId: 'CAT-SAPPHIRE', name: 'Sapphire Unstitched', slug: 'sapphire-unstitched', description: 'Beautiful unstitched collections', image: IMG_DUMMY_3 },
      { categoryId: 'CAT-SANASAFINAZ', name: 'Sana Safinaz Luxury', slug: 'sana-safinaz-luxury', description: 'Elite luxury fashion', image: IMG_DUMMY_4 },
    ];

    for (const cat of categoriesData) {
      await Category.findOneAndUpdate({ categoryId: cat.categoryId }, cat, { upsert: true, new: true });
    }

    // 2. Create Products
    const productsData = [
      {
        productId: 'KHA-1001',
        name: 'Khaadi 3-Piece Embroidered Khaddar',
        category: 'Khaadi Formals',
        price: 8500,
        originalPrice: 10500,
        costPrice: 5000,
        stock: 50,
        sold: 12,
        images: [IMG_DUMMY_1, IMG_DUMMY_2],
        frontImageUrl: IMG_DUMMY_1,
        backImageUrl: IMG_DUMMY_2,
        description: 'Exquisite 3-piece khaddar suit featuring delicate thread embroidery on the neckline and a printed shawl. Perfect for the winter breeze in Pakistan.',
        details: ['Fabric: Premium Khaddar', 'Dupatta: Printed Khaddar Shawl', 'Embroidered Neckline', 'Dyed Trousers'],
        sizes: ['S', 'M', 'L', 'XL'],
        sizeChartRows: [
          { size: 'S', chest: 19, waist: 18, hips: 20, length: 38 },
          { size: 'M', chest: 20, waist: 19, hips: 21, length: 39 },
          { size: 'L', chest: 21, waist: 20, hips: 22, length: 40 },
        ],
        colors: [{ name: 'Rust Red', hex: '#8B0000' }, { name: 'Mustard', hex: '#FFDB58' }],
        rating: 4.9, reviewCount: 24,
        tags: ['Khaadi', 'Winter', 'Embroidered'],
        isNewArrival: true,
        isBestseller: true
      },
      {
        productId: 'LL-2050',
        name: 'Limelight Printed Lawn Kurti',
        category: 'Limelight Pret',
        price: 3200,
        originalPrice: 4000,
        costPrice: 1800,
        stock: 120,
        sold: 65,
        images: [IMG_DUMMY_2, IMG_DUMMY_3],
        frontImageUrl: IMG_DUMMY_2,
        backImageUrl: IMG_DUMMY_3,
        description: 'Vibrant digitally printed lawn kurti with a chic boat neckline and bell sleeves. An absolute essential for college/university wear.',
        details: ['Fabric: Fine Lawn', 'Digital Print', 'Boat Neck', 'Bell Sleeves'],
        sizes: ['XS', 'S', 'M', 'L'],
        sizeChartRows: [
          { size: 'S', chest: 18, waist: 17, hips: 19, length: 36 },
          { size: 'M', chest: 19, waist: 18, hips: 20, length: 37 },
        ],
        colors: [{ name: 'Teal Blue', hex: '#008080' }, { name: 'Soft Pink', hex: '#FFB6C1' }],
        rating: 4.7, reviewCount: 88,
        tags: ['Limelight', 'Pret', 'Kurti', 'Summer'],
        isSale: true
      },
      {
        productId: 'SAP-800',
        name: 'Sapphire Daily Unstitched 2-Piece',
        category: 'Sapphire Unstitched',
        price: 4500,
        costPrice: 2000,
        stock: 300,
        sold: 150,
        images: [IMG_DUMMY_3, IMG_DUMMY_4],
        frontImageUrl: IMG_DUMMY_3,
        backImageUrl: IMG_DUMMY_4,
        description: 'Elegant geometric print lawn shirt paired with matching cambric trousers. High-quality everyday fashion guaranteed by Sapphire.',
        details: ['Fabric: Lawn Shirt, Cambric Trousers', 'Unstitched', '3 Meters Shirt', '2.5 Meters Trouser'],
        sizes: ['Unstitched'],
        sizeChartRows: [],
        colors: [{ name: 'Emerald Green', hex: '#50C878' }],
        rating: 4.5, reviewCount: 42,
        tags: ['Sapphire', 'Unstitched', 'Daily Wear'],
        isBestseller: true
      },
      {
        productId: 'SS-900',
        name: 'Sana Safinaz Muzlin Luxury Formals',
        category: 'Sana Safinaz Luxury',
        price: 18500,
        costPrice: 9000,
        stock: 15,
        sold: 4,
        images: [IMG_DUMMY_4, IMG_DUMMY_1],
        frontImageUrl: IMG_DUMMY_4,
        backImageUrl: IMG_DUMMY_1,
        description: 'Heavy chiffon formal suit with intricate zaari and sequin work. Complemented beautifully with a pure crushed silk dupatta.',
        details: ['Fabric: Chiffon & Silk', 'Zari & Sequin Embroidery', 'Crushed Dupatta', 'Raw Silk Trousers'],
        sizes: ['S', 'M', 'L', 'XL'],
        sizeChartRows: [
          { size: 'M', chest: 21, waist: 19, hips: 22, length: 42 },
          { size: 'L', chest: 22, waist: 20, hips: 23, length: 43 },
        ],
        colors: [{ name: 'Midnight Black', hex: '#000000' }, { name: 'Rose Gold', hex: '#B76E79' }],
        rating: 5.0, reviewCount: 11,
        tags: ['Sana Safinaz', 'Luxury Formals', 'Wedding Wear'],
        isSignatureDress: true
      }
    ];

    for (const prod of productsData) {
      await Product.findOneAndUpdate({ productId: prod.productId }, prod, { upsert: true, new: true });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully injected Pakistani Brand Dummy Products!',
      insertedCategories: categoriesData.length,
      insertedProducts: productsData.length
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
