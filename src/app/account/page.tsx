'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, Package, MapPin, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/account/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  if (authLoading || !user) {
    return (
      <AppShell>
        <div className="min-h-screen pt-32 bg-cream flex justify-center text-brown-muted text-sm font-inter tracking-widest uppercase">
          Loading Profile...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen pt-24 pb-24 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Sidebar Profile */}
            <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-[0_20px_45px_-30px_rgba(58,46,42,0.15)] p-6 border border-nude/30 sticky top-24">
              <div className="w-16 h-16 bg-beige rounded-full flex items-center justify-center text-2xl font-playfair text-brown mb-4 mx-auto md:mx-0">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <h1 className="text-xl font-playfair text-brown text-center md:text-left">{user.firstName} {user.lastName}</h1>
              <p className="text-sm font-inter text-brown-muted text-center md:text-left mb-6">{user.email}</p>
              
              <div className="space-y-2 border-t border-nude/40 pt-4">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-cream rounded-xl text-brown font-inter text-sm font-medium hover:bg-beige transition">
                  <Package size={16} /> My Orders
                </button>
                <Link href="/wishlist">
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cream rounded-xl text-brown font-inter text-sm font-medium transition">
                    <Heart size={16} /> Wishlist
                  </button>
                </Link>
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl text-red-600 font-inter text-sm font-medium transition mt-8"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>

            {/* Main Content (Orders) */}
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-playfair text-brown mb-6">Order History</h2>
              
              {loadingOrders ? (
                <div className="p-8 text-center text-sm font-inter text-brown-muted">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-nude/30 text-center">
                  <Package size={32} className="mx-auto text-nude mb-4" />
                  <h3 className="text-lg font-playfair text-brown mb-2">No orders yet</h3>
                  <p className="text-sm font-inter text-brown-muted mb-6">When you purchase a dress, it will appear here with tracking info.</p>
                  <Link href="/dresses" className="btn-luxury inline-block">Explore Collection</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-2xl p-6 border border-nude/30 shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-nude/40 pb-4 mb-4 gap-4">
                        <div>
                          <p className="text-xs font-inter tracking-[0.1em] uppercase text-brown-muted mb-1">Order #{order.orderId}</p>
                          <p className="text-sm font-inter text-brown">{order.date} {order.time && `· ${order.time}`}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-lg font-playfair text-brown">Rs {order.total.toLocaleString()}</p>
                          <span className={`inline-block mt-1 px-3 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-full ${
                            order.status === 'pending' ? 'bg-[#F0C9BF] text-brown' :
                            order.status === 'shipped' ? 'bg-[#B7C9D7] text-white' :
                            order.status === 'delivered' ? 'bg-[#6B8E6B] text-white' : 'bg-beige text-brown'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-16 h-20 bg-beige rounded overflow-hidden relative flex-shrink-0">
                              {/* Simple placeholder since items might not have images saved in DB, but normally they do */}
                              <div className="absolute inset-0 flex items-center justify-center text-[10px] text-brown-muted font-inter">Item</div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-playfair text-brown">{item.name}</p>
                              <p className="text-xs font-inter text-brown-muted mt-1">
                                Size: {item.size} · Color: {item.color} · Qty: {item.qty}
                              </p>
                            </div>
                            <div className="text-sm font-inter text-brown font-medium">
                              Rs {item.price.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </AppShell>
  );
}
