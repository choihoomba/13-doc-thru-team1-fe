import serverFetchClient from '@/lib/services/serverFetchClient';

const BACKEND_URL = process.env.BACKEND_URL;

async function signup(credentials) {
  await serverFetchClient(`${BACKEND_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
}

async function signin(credentials) {
  const response = await serverFetchClient(`${BACKEND_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const { data: user } = await response.json();
  const setCookieHeaders = response.headers.getSetCookie?.() ?? [];

  return { user, setCookieHeaders };
}

async function signout(cookieHeader) {
  await serverFetchClient(`${BACKEND_URL}/auth/signout`, {
    method: 'POST',
    headers: { cookie: cookieHeader },
  });
}

async function getMe(cookieHeader) {
  const response = await serverFetchClient(`${BACKEND_URL}/auth/me`, {
    headers: { cookie: cookieHeader },
  });

  const { data: user } = await response.json();
  return user;
}

export const authService = { signup, signin, signout, getMe };
