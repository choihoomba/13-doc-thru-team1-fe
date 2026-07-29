'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { getMe } from '@/lib/api/auth';

import LoadingDisplay from '@/components/ui/LoadingDisplay';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchUser() {
      try {
        const data = await getMe();
        if (!ignore) setUser(data);
      } catch {
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchUser();

    return () => {
      ignore = true;
    };
  }, [pathname]);

  if (isLoading) {
    return <LoadingDisplay className="min-h-screen" />;
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용 가능');
  }
  return context;
}
