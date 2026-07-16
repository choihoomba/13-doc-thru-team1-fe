'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import { useAuth } from '@/lib/providers/AuthProvider';

/** 비회원 레이아웃 */
export default function AuthLayout({ children }) {
  // TODO: 인증/인가 작업 후 처리
  // const router = useRouter();
  // const { user, isLoading } = useAuth();

  // useEffect(() => {
  //   if (!isLoading && user) {
  //     router.replace('/challenges');
  //   }
  // }, [isLoading, user, router]);

  // if (isLoading || user) return null;

  return children;
}
