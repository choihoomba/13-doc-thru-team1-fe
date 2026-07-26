import serverFetchClient from '@/lib/services/serverFetchClient';

const BACKEND_URL = process.env.BACKEND_URL;

export async function signup(credentials) {
  await serverFetchClient(`${BACKEND_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
}

export async function signin(credentials) {
  const response = await serverFetchClient(`${BACKEND_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const { data: user } = await response.json();
  const setCookieHeaders = response.headers.getSetCookie?.() ?? [];

  return { user, setCookieHeaders };
}

export async function signout(cookieHeader) {
  await serverFetchClient(`${BACKEND_URL}/auth/signout`, {
    method: 'POST',
    headers: { cookie: cookieHeader },
  });
}

export async function getMe(cookieHeader) {
  const response = await serverFetchClient(`${BACKEND_URL}/auth/me`, {
    headers: { cookie: cookieHeader },
  });

  const { data: user } = await response.json();
  return user;
}
