import clientFetch from '@/lib/api/clientFetch';

const CHALLENGES_ENDPOINT = '/api/challenges';

export async function createChallenge(data) {
  return clientFetch(CHALLENGES_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getChallenges(params = {}) {
  // ✅ undefined/null/빈 문자열 값은 querystring에 'undefined' 문자열로
  //    직렬화되는 것을 방지하기 위해 걸러냅니다.
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );
  const queryString = new URLSearchParams(entries).toString();

  return clientFetch(
    `${CHALLENGES_ENDPOINT}${queryString ? `?${queryString}` : ''}`,
  );
}

// ✅ 상세 조회 (pending/rejected/deleted 페이지에서 사용)
export async function getChallenge(id) {
  return clientFetch(`${CHALLENGES_ENDPOINT}/${id}`);
}

export async function deleteChallenge(id, reason) {
  return clientFetch(`${CHALLENGES_ENDPOINT}/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ reason }),
  });
}

// ✅ 승인 대기 신청 취소 (PATCH { action: 'CANCEL' })
export async function cancelChallenge(id) {
  return clientFetch(`${CHALLENGES_ENDPOINT}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ action: 'CANCEL' }),
  });
}
