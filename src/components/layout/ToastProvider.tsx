'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
};

type ToastContextValue = {
  toast: (input: { title: string; message?: string; type?: ToastType }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function iconFor(type: ToastType) {
  if (type === 'success') return CheckCircle2;
  if (type === 'error') return TriangleAlert;
  return Info;
}

function classesFor(type: ToastType) {
  if (type === 'success') {
    return {
      border: 'border-green-200/70',
      icon: 'text-green-600',
      title: 'text-green-800',
      message: 'text-green-700/90',
      bg: 'bg-white/95',
    };
  }

  if (type === 'error') {
    return {
      border: 'border-rose-200/70',
      icon: 'text-rose-600',
      title: 'text-rose-800',
      message: 'text-rose-700/90',
      bg: 'bg-white/95',
    };
  }

  return {
    border: 'border-nude/40',
    icon: 'text-brown',
    title: 'text-brown',
    message: 'text-brown-muted',
    bg: 'bg-white/95',
  };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((input: { title: string; message?: string; type?: ToastType }) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const next: Toast = {
      id,
      title: input.title,
      message: input.message,
      type: input.type ?? 'info',
    };

    setToasts((prev) => [next, ...prev].slice(0, 4));
    window.setTimeout(() => dismiss(id), 2800);
  }, [dismiss]);

  const value = useMemo<ToastContextValue>(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-[140] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const Icon = iconFor(t.type);
            const c = classesFor(t.type);

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 16, y: -6 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 12, y: -8 }}
                transition={{ duration: 0.22 }}
                className={`pointer-events-auto rounded-xl border ${c.border} ${c.bg} p-3 shadow-[0_16px_46px_-22px_rgba(58,46,42,0.45)] backdrop-blur`}
              >
                <div className="flex items-start gap-3">
                  <Icon size={18} className={`mt-0.5 ${c.icon}`} strokeWidth={2} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold ${c.title}`}>{t.title}</p>
                    {t.message && <p className={`mt-0.5 text-xs ${c.message}`}>{t.message}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(t.id)}
                    className="rounded p-1 text-brown-muted hover:bg-beige/60 hover:text-brown"
                    aria-label="Dismiss notification"
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
