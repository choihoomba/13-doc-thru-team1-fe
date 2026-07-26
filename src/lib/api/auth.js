import clientFetch from './clientFetch';
import { ENDPOINTS } from './endpoints';

/** accessToken Cookie를 기준으로 현재 로그인 사용자를 조회합니다. */
export function getCurrentUser() {
  return clientFetch(ENDPOINTS.authMe);
}

/** 회원가입은 인증 Cookie를 발급하지 않으므로 사용자 정보만 반환합니다. */
export function signup(credentials) {
  return clientFetch(ENDPOINTS.authSignup, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/** 로그인 성공 시 백엔드가 httpOnly 인증 Cookie를 설정합니다. */
export function signin(credentials) {
  return clientFetch(ENDPOINTS.authSignin, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/** DB의 refreshToken을 제거하고 브라우저 인증 Cookie를 삭제합니다. */
export function signout() {
  return clientFetch(ENDPOINTS.authSignout, {
    method: 'POST',
  });
}

/** refreshToken Cookie로 accessToken과 refreshToken을 다시 발급합니다. */
export function refreshSession() {
  return clientFetch(ENDPOINTS.authRefresh, {
    method: 'POST',
  });
}
