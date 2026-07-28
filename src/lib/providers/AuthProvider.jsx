'use client';

import { createContext, useContext, useEffect } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { getMe } from '@/lib/api/auth';

import { authKeys } from '@/hooks/queries/auth/keys';

import LoadingDisplay from '@/components/ui/LoadingDisplay';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { data: user, isPending } = useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      try {
        return await getMe();
      } catch {
        return null;
      }
    },
    retry: false,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: authKeys.me() });
  }, [pathname, queryClient]);

  if (isPending) {
    return <LoadingDisplay className="min-h-screen" />;
  }

  return (
    <AuthContext.Provider value={{ user: user ?? null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용 가능');
  }
  return context;
}
