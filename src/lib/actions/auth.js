'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { authService } from '@/lib/services/authService';

export async function signupAction(prevState, formData) {
  const email = formData.get('email');
  const nickname = formData.get('nickname');
  const password = formData.get('password');

  try {
    await authService.signup({ email, nickname, password });
  } catch (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signinAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  let user;
  let setCookieHeaders;
  try {
    const result = await authService.signin({ email, password });
    user = result.user;
    setCookieHeaders = result.setCookieHeaders;
  } catch (error) {
    return { error: error.message };
  }

  const cookieStore = await cookies();
  setCookieHeaders.forEach((cookie) => {
    cookieStore.set(parseCookieString(cookie));
  });

  redirect(user.role === 'ADMIN' ? '/admin/manage' : '/challenges');
}

export async function signoutAction() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  try {
    await authService.signout(cookieHeader);
  } catch (error) {
    console.error('signout 요청 실패:', error);
    // - 실패해도 클라이언트 쿠키는 지워서 로그아웃 상태로 보이게 처리
  }

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');

  redirect('/signin');
}

function parseCookieString(setCookieStr) {
  const [pair, ...attrs] = setCookieStr.split('; ');
  const [name, value] = pair.split('=');

  const options = {};
  attrs.forEach((attr) => {
    const [key, val] = attr.split('=');
    const k = key.toLowerCase();
    if (k === 'max-age') options.maxAge = Number(val);
    if (k === 'path') options.path = val;
    if (k === 'httponly') options.httpOnly = true;
    if (k === 'secure') options.secure = true;
    if (k === 'samesite') options.sameSite = val.toLowerCase();
  });

  return { name, value, ...options };
}
