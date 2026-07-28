import { CHALLENGE_TAB_TO_VIEW } from '@/lib/constants/constants';

import clientFetch from './clientFetch';
import { ENDPOINTS } from './endpoints';

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

  const response = await clientFetch(`${ENDPOINTS.challenges}?${params}`);

  // 백엔드 공통 응답 { success, data: { challenges, pagination } }
  return response.data;
}
