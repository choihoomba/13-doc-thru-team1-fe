import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }) {
  const cookieStore = await cookies();
  const hasAccessToken = cookieStore.has('accessToken');

  if (hasAccessToken) {
    redirect('/challenges');
  }

  return children;
}
