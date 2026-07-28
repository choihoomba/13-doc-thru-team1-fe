import { useQuery } from '@tanstack/react-query';

import { getMyChallenges } from '@/lib/api/challengeMine';
import { getChallenges } from '@/lib/api/challenges';

import { challengeKeys } from './keys';

// TODO: 예시 코드입니다.
export function useChallenges(params) {
  return useQuery({
    queryKey: challengeKeys.lists(),
    queryFn: () => getChallenges(params),
  });
}

/** 나의 챌린지(참여중/완료/신청) 탭별 목록 조회 */
export function useMyChallenges({
  tab,
  page = 1,
  limit = 10,
  search = '',
  status,
}) {
  return useQuery({
    queryKey: challengeKeys.mine(tab, { page, limit, search, status }),
    queryFn: () => getMyChallenges({ tab, page, limit, search, status }),
  });
}
