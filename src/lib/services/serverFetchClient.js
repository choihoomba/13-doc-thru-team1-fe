export default async function serverFetchClient(input, init = {}) {
  let response;
  try {
    response = await fetch(input, init);
  } catch {
    const error = new Error(
      '서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
    );
    error.code = 'NETWORK_ERROR';
    throw error;
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

  return response;
}
