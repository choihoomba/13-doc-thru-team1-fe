'use client';

import { createContext, useContext } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getMe } from '@/lib/api/auth';

import { authKeys } from '@/hooks/queries/auth/keys';

import LoadingDisplay from '@/components/ui/LoadingDisplay';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: user, isLoading } = useQuery({
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

  if (isLoading) {
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
