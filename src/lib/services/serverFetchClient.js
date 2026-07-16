/**
 * 서버 전용 로직
 * httpOnly 쿠키 등 브라우저 접근 불가 영역
 * 서버 전용 fetch wrapper (defaultFetch)
 */

// TODO: 예시 코드입니다.
export default async function defaultFetch(input, init = {}) {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response;
}
