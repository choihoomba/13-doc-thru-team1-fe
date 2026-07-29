import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { CHALLENGE_TAB_TO_VIEW } from '@/lib/constants/constants';

/**
 * 검색·필터 조건을 Query String으로 변환합니다.
 *
 * undefined, null, 빈 문자열, 빈 배열은 요청에서 제외합니다.
 * 분야처럼 여러 값을 선택하는 조건은 같은 key를 반복해서 전달합니다.
 * 예: field=NEXTJS&field=API
 */
function createSearchParams(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        searchParams.append(key, String(item));
      });

      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
}

/**
 * 일반 목록, 관리자 신청 관리, 나의 챌린지가 공통으로 사용하는
 * 챌린지 목록 조회 함수입니다.
 */
export async function getChallenges(params = {}) {
  const queryString = createSearchParams(params);

  const endpoint = queryString
    ? `${ENDPOINTS.challenges.list}?${queryString}`
    : ENDPOINTS.challenges.list;

  const response = await clientFetch(endpoint);

  // 백엔드 공통 응답 { success, data }에서 실제 데이터만 반환합니다.
  return response.data;
}

/**
 * 나의 챌린지(참여중/완료/신청) 목록을 조회합니다.
 * 탭 값을 백엔드 view 값으로 변환한 뒤 공통 getChallenges를 재사용합니다.
 * BE: GET /challenges?view=participating|completed|applied
 *
 * @param tab 'ongoing' | 'completed' | 'applied' (CHALLENGE_TABS 값)
 * @param status 'applied' 탭에서만 사용하는 신청 상태 하위 필터
 * (PENDING | APPROVED | REJECTED | DELETED | CLOSED)
 */
export function getMyChallenges({
  tab,
  page = 1,
  limit = 10,
  search = '',
  status,
} = {}) {
  return getChallenges({
    view: CHALLENGE_TAB_TO_VIEW[tab],
    page,
    limit,
    search: search || undefined,
    status: tab === 'applied' ? status : undefined,
  });
}

/**
 * 상세 페이지와 관리자 수정 페이지에서 사용할
 * 챌린지 한 건을 조회합니다.
 */
export async function getChallenge(challengeId) {
  const response = await clientFetch(ENDPOINTS.challenges.detail(challengeId));

  return response.data;
}

/**
 * 신규 챌린지를 신청합니다.
 */
export async function createChallenge(payload) {
  const response = await clientFetch(ENDPOINTS.challenges.list, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response.data;
}

/**
 * 관리자 챌린지 수정 페이지에서 변경 정보와 수정 사유를 전달합니다.
 */
export async function updateChallenge(challengeId, payload) {
  const response = await clientFetch(ENDPOINTS.challenges.detail(challengeId), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return response.data;
}

/** 진행 중인 챌린지 삭제 (ADMIN 전용, soft delete)
 * - DELETE /challenges/:id
 */
export async function deleteChallenge({ id, reason }) {
  return clientFetch(ENDPOINTS.challenges.detail(id), {
    method: 'DELETE',
    body: JSON.stringify({ reason }),
  });
}
