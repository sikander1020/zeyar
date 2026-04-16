'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  const stored = window.localStorage.getItem('zaybaash-theme');
  if (stored === 'dark' || stored === 'light') return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  window.localStorage.setItem('zaybaash-theme', theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const nextTheme = resolveInitialTheme();
    setThemeState(nextTheme);
    applyTheme(nextTheme);
  }, []);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    applyTheme(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((theme === 'light' ? 'dark' : 'light'));
  }, [theme, setTheme]);

  const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
