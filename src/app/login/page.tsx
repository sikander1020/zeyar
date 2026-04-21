'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useAuthStore } from '@/store/useAuthStore';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { fetchSession } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to authenticate');
      
      await fetchSession(); // Refresh Zustand state
      router.push('/account');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen pt-32 pb-24 bg-cream flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_45px_-30px_rgba(58,46,42,0.2)] p-8 border border-nude/30">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-playfair text-brown mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-xs tracking-[0.1em] uppercase font-inter text-brown-muted">
              {isLogin ? 'Sign in to access your luxury profile' : 'Join the Zaybaash collection'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-center">
              <p className="text-xs text-red-600 font-inter">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.1em] uppercase text-brown-muted mb-1.5 ml-1">First Name</label>
                  <input
                    required
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))}
                    className="input-luxury w-full"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.1em] uppercase text-brown-muted mb-1.5 ml-1">Last Name</label>
                  <input
                    required
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))}
                    className="input-luxury w-full"
                    placeholder="Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] tracking-[0.1em] uppercase text-brown-muted mb-1.5 ml-1">Email Address</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                className="input-luxury w-full"
                placeholder="jane@example.com"
              />
            </div>

            <div className="relative">
              <label className="block text-[10px] tracking-[0.1em] uppercase text-brown-muted mb-1.5 ml-1">Password</label>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                className="input-luxury w-full pr-10"
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-brown-muted hover:text-brown transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-luxury mt-2 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-nude/40 pt-6">
            <p className="text-xs text-brown-muted font-inter">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-brown font-semibold hover:underline underline-offset-4"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
