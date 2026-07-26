export default async function serverFetchClient(input, init = {}) {
  const response = await fetch(input, init);

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
