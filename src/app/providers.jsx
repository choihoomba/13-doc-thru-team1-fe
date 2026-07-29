'use client';

import { AuthProvider } from '@/lib/providers/AuthProvider.jsx';
import ModalProvider from '@/lib/providers/ModalProvider';
import QueryProvider from '@/lib/providers/QueryProvider';

/** QueryProvider + AuthProvider + ModalProvider */
export default function Providers({ children }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ModalProvider>{children}</ModalProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
