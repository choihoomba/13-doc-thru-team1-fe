import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import * as authService from '@/lib/services/authService';

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  let user;
  try {
    user = await authService.getMe(cookieHeader);
  } catch {
    user = null;
  }

  if (!user) {
    redirect('/signin');
  }

  if (user.role !== 'ADMIN') {
    redirect('/challenges');
  }

  return children;
}
