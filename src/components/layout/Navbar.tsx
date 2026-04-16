'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, Menu, X, ArrowRight, Moon, Sun } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import type { StoreProduct } from '@/types/storefront';
import { useTheme } from '@/components/layout/ThemeProvider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/dresses', label: 'Dresses' },
  { href: '/dresses?category=One Piece', label: 'One Piece' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const { theme, toggleTheme } = useTheme();
  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Warm up critical routes from the first paint so navigation feels instant.
    router.prefetch('/shop');
    router.prefetch('/dresses');
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 180);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!searchOpen) return;
    if (debouncedQuery.length < 2) {
      setProducts([]);
      return;
    }

    let mounted = true;
    fetch(`/api/products?q=${encodeURIComponent(debouncedQuery)}&limit=12`, { cache: 'no-store' })
      .then((res) => res.json() as Promise<{ products?: StoreProduct[] }>)
      .then((data) => {
        if (mounted) setProducts(data.products ?? []);
      })
      .catch(() => {
        if (mounted) setProducts([]);
      });

    return () => {
      mounted = false;
    };
  }, [searchOpen, debouncedQuery]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass shadow-lg shadow-nude/10 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex flex-col items-center">
            <span
              className="text-3xl font-playfair font-bold tracking-[0.2em] gradient-rose-text transition-all duration-300"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ZAYBAASH
            </span>
            <span
              className="text-[9px] tracking-[0.35em] uppercase text-brown-muted font-inter font-light"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Beauty with Style
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch
                  onMouseEnter={() => {
                    if (link.href.startsWith('/shop')) router.prefetch('/shop');
                    if (link.href.startsWith('/dresses')) router.prefetch('/dresses');
                  }}
                  onFocus={() => {
                    if (link.href.startsWith('/shop')) router.prefetch('/shop');
                    if (link.href.startsWith('/dresses')) router.prefetch('/dresses');
                  }}
                  className="text-[11px] tracking-[0.18em] uppercase font-inter font-medium text-brown hover:text-rose-gold transition-colors duration-300 relative group"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-rose-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-brown hover:text-rose-gold transition-colors duration-300"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
            </button>
            <button
              onClick={() => { setSearchOpen(true); setTimeout(() => document.getElementById('searchInput')?.focus(), 100); }}
              className="hidden md:flex p-2 text-brown hover:text-rose-gold transition-colors duration-300"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link
              href="/wishlist"
              className="relative p-2 text-brown hover:text-rose-gold transition-colors duration-300"
              aria-label="Wishlist"
            >
              <Heart size={18} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-gold text-white text-[9px] flex items-center justify-center font-semibold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={toggleCart}
              className="relative p-2 text-brown hover:text-rose-gold transition-colors duration-300"
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-gold text-white text-[9px] flex items-center justify-center font-semibold"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>
            <button
              className="lg:hidden p-2 text-brown hover:text-rose-gold transition-colors duration-300"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brown/40 backdrop-blur-sm z-[60]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-cream z-[70] flex flex-col p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <span
                  className="text-2xl font-playfair gradient-rose-text"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  ZAYBAASH
                </span>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-brown" aria-label="Close menu">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              <ul className="flex flex-col gap-6">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      prefetch
                      className="text-lg font-playfair text-brown hover:text-rose-gold transition-colors duration-300"
                      onClick={() => setMobileOpen(false)}
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <button
                onClick={toggleTheme}
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-nude/40 px-4 py-2 text-sm text-brown hover:border-rose-gold hover:text-rose-gold transition-colors duration-300"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <div className="mt-auto pt-8 border-t border-nude/30">
                <p className="text-[11px] tracking-[0.15em] uppercase text-brown-muted font-inter">
                  © 2026 ZAYBAASH. Beauty with Style.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-cream/95 backdrop-blur-md z-[100] flex flex-col"
          >
            <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-20 flex flex-col">
              <div className="flex justify-between items-center mb-12">
                <span className="text-sm tracking-[0.2em] uppercase text-brown-muted font-inter">Search</span>
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="p-2 text-brown hover:text-rose-gold transition-colors"
                  aria-label="Close search"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              <div className="relative mb-12">
                <input
                  id="searchInput"
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-4xl md:text-5xl lg:text-6xl font-playfair text-brown bg-transparent border-b-2 border-nude/40 pb-4 focus:outline-none focus:border-rose-gold transition-colors placeholder:text-nude"
                />
              </div>

              {searchQuery.length >= 2 && (
                <div className="flex-1 overflow-y-auto">
                  <p className="text-xs uppercase tracking-[0.1em] text-brown-muted mb-6">Results</p>
                  <div className="space-y-6">
                    {products
                      .map((p, i) => (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Link
                            href={`/product/${p.id}`}
                            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                            className="group flex justify-between items-center bg-white/50 p-4 hover:bg-white transition-colors"
                          >
                            <span className="text-lg font-playfair text-brown group-hover:text-rose-gold transition-colors">
                              {p.name}
                            </span>
                            <ArrowRight size={18} className="text-nude group-hover:text-rose-gold transition-colors" />
                          </Link>
                        </motion.div>
                      ))}
                    
                    {products.length === 0 && (
                      <p className="text-brown-muted font-inter">No pieces found matching &quot;{searchQuery}&quot;.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
