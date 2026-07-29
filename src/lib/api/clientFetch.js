import { ENDPOINTS } from '@/lib/api/endpoints';

let refreshPromise = null;

async function requestRefresh() {
  if (!refreshPromise) {
    refreshPromise = fetch(ENDPOINTS.auth.refresh, {
      method: 'POST',
      credentials: 'same-origin',
    }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * 브라우저 fetch wrapper
 * credentials: same-origin
 * - 프록시(app/api/[...path]/route.js)를 통해 항상 우리 서버(같은 도메인)로만
 *   요청이 나가는 구조라 same-origin으로 충분함
 * - include 대신 same-origin을 쓰는 이유: 실수로 절대 URL(외부 도메인)이
 *   들어와도 쿠키가 새어나가지 않도록 방어하기 위함
 */
export default async function clientFetch(input, init = {}) {
  let response;
  try {
    response = await fetch(input, {
      ...init,
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    });
  } catch {
    const error = new Error(
      '서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
    );
    error.code = 'NETWORK_ERROR';
    throw error;
  }

  if (response.status === 401) {
    const errorBody = await response
      .clone()
      .json()
      .catch(() => null);

    if (errorBody?.code === 'TOKEN_EXPIRED' && !init._retried) {
      try {
        const refreshResponse = await requestRefresh();

        if (refreshResponse.ok) {
          return clientFetch(input, { ...init, _retried: true });
        }
      } catch {
        const error = new Error(
          '세션 갱신에 실패했습니다. 다시 로그인해주세요.',
        );
        error.code = 'REFRESH_FAILED';
        throw error;
      }
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const error = new Error(
      errorBody?.message ?? '요청 처리 중 오류가 발생했습니다',
    );
    error.code = errorBody?.code;
    error.status = response.status;
    throw error;
  }

  return response.json();
}
