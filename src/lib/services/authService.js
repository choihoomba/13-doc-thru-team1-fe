import defaultFetch from './serverFetchClient';

/**
 * 서버 전용 로직
 * httpOnly 쿠키 등 브라우저 접근 불가 영역
 * signin/signup/signout, Set-Cookie 파싱
 */

// TODO: 예시 코드입니다.
export async function signin(credentials) {
  const response = await defaultFetch('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  return parseSetCookie(response);
}

function parseSetCookie(response) {
  return response.headers.getSetCookie?.() ?? [];
}
