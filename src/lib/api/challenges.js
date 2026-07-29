import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { CHALLENGE_TAB_TO_VIEW } from '@/lib/constants/constants';

/**
 * 챌린지 목록을 조회합니다.
 *
 * 기존 useChallenges가 사용하는 함수이며, query 값이 있을 때만 URLSearchParams로
 * 직렬화합니다. 응답의 공통 `{ success, data }` 껍질은 API 계층에서 벗겨 화면과
 * Query Hook이 실제 목록 데이터만 다루도록 합니다.
 */
export async function getChallenges(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value != null && value !== ''),
  ).toString();
  const response = await clientFetch(
    query ? `/api/challenges?${query}` : '/api/challenges',
  );

  return response.data;
}

/**
 * [챌린지 수정 페이지] 수정 폼의 초기값으로 사용할 챌린지 상세를 조회합니다.
 *
 * 팀 공통 clientFetch와 상대 경로를 사용하므로 인증 쿠키, 토큰 갱신,
 * 백엔드 `{ message, code }` 오류 변환은 clientFetch가 담당합니다.
 */
export async function getChallenge(challengeId) {
  const response = await clientFetch(`/api/challenges/${challengeId}`);

  return response.data;
}

/**
 * 신규 챌린지를 신청합니다.
 *
 * 팀 공통 clientFetch와 상대 경로를 사용해 Next.js 프록시를 거칩니다.
 * userId, status, currentParticipants는 서버 관리 값이므로 payload에 포함하지 않습니다.
 */
export function createChallenge(payload) {
  return clientFetch('/api/challenges', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * [챌린지 수정 페이지] 관리자 챌린지 정보와 수정 사유를 전달합니다.
 *
 * 백엔드는 같은 PATCH 경로에서 승인·거절·취소·정보 수정을 body로 구분합니다.
 * 이 함수에는 status나 action을 넣지 않고 변경된 Form 필드와 reason만 전달해
 * 정보 수정 분기로 안전하게 들어가도록 합니다.
 */
export async function updateChallenge(challengeId, payload) {
  const response = await clientFetch(`/api/challenges/${challengeId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return response.data;
}

/**
 * 나의 챌린지(참여중/완료/신청) 목록을 조회합니다.
 * BE: GET /challenges?view=participating|completed|applied
 *
 * @param tab 'ongoing' | 'completed' | 'applied' (CHALLENGE_TABS 값)
 * @param status 'applied' 탭에서만 사용하는 신청 상태 하위 필터
 * (PENDING | APPROVED | REJECTED | DELETED | CLOSED)
 */
export async function getMyChallenges({
  tab,
  page = 1,
  limit = 10,
  search = '',
  status,
} = {}) {
  const params = new URLSearchParams({
    view: CHALLENGE_TAB_TO_VIEW[tab],
    page: String(page),
    limit: String(limit),
  });

  if (search) params.set('search', search);
  if (status && tab === 'applied') params.set('status', status);

  const { data } = await clientFetch(`${ENDPOINTS.challenges.list}?${params}`);
  return data;
}

/** 챌린지 상세 정보 조회
 * - GET /challenges/:id
 */
export async function getChallengesById(id) {
  try {
    const result = await clientFetch(`${ENDPOINTS.challenges}/${id}`);
    return result.data;
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

/** 진행 중인 챌린지 삭제 (ADMIN 전용, soft delete)
 * - DELETE /challenges/:id
 */
export async function deleteChallenge({ id, reason }) {
  return clientFetch(`${ENDPOINTS.challenges}/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ reason }),
  });
}
