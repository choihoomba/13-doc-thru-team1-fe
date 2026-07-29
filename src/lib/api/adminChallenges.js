import clientFetch from '@/lib/api/clientFetch';

// 공통 ENDPOINTS를 수정하지 않고 어드민 신청 관리에서만 사용하는 상대경로입니다.
const ADMIN_CHALLENGES_ENDPOINT = '/api/challenges';

// 값이 있는 검색 조건만 Query String에 포함합니다.
function createSearchParams(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
}

// 어드민 챌린지 신청 목록을 조회합니다.
export async function getAdminChallengeApplications({
  search,
  status,
  sort = 'latest',
  page = 1,
  limit = 10,
} = {}) {
  const queryString = createSearchParams({
    view: 'admin',
    search,
    status,
    sort,
    page,
    limit,
  });

  const response = await clientFetch(
    `${ADMIN_CHALLENGES_ENDPOINT}?${queryString}`,
  );

  return response.data;
}

// 어드민 신청 관리 상세 화면에 표시할 챌린지 한 건을 조회합니다.
export async function getAdminChallenge(challengeId) {
  const response = await clientFetch(
    `${ADMIN_CHALLENGES_ENDPOINT}/${challengeId}`,
  );

  return response.data;
}

// 승인·거절에서 공통으로 사용하는 상태 변경 요청입니다.
async function updateAdminChallengeStatus(challengeId, payload) {
  const response = await clientFetch(
    `${ADMIN_CHALLENGES_ENDPOINT}/${challengeId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}

// 승인 대기 중인 챌린지를 승인합니다.
export function approveAdminChallenge(challengeId) {
  return updateAdminChallengeStatus(challengeId, {
    status: 'APPROVED',
  });
}

// 승인 대기 중인 챌린지를 사유와 함께 거절합니다.
export function rejectAdminChallenge(challengeId, reason) {
  return updateAdminChallengeStatus(challengeId, {
    status: 'REJECTED',
    reason: reason.trim(),
  });
}
