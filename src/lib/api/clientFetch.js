import { ENDPOINTS } from '@/lib/api/endpoints';

let refreshPromise = null;

async function requestRefresh() {
  if (!refreshPromise) {
    refreshPromise = fetch(ENDPOINTS.auth.refresh, {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * 브라우저 fetch wrapper
 * credentials: include
 */
export default async function clientFetch(input, init = {}) {
  const response = await fetch(input, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

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
