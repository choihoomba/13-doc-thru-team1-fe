import clientFetch from '@/lib/api/clientFetch';

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
