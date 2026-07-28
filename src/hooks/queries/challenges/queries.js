import { useQuery } from '@tanstack/react-query';

import { getChallenge, getChallenges } from '@/lib/api/challenges';

import { challengeKeys } from './keys';

// TODO: 예시 코드입니다.
export function useChallenges(params) {
  return useQuery({
    queryKey: challengeKeys.lists(),
    queryFn: () => getChallenges(params),
  });
}

/**
 * [챌린지 수정 페이지] URL의 challengeId에 해당하는 상세 데이터를 조회합니다.
 *
 * id가 준비되기 전에는 요청하지 않아 `/api/challenges/undefined` 호출을 막고,
 * 상세 전용 queryKey를 사용해 목록 캐시와 섞이지 않도록 합니다.
 */
export function useChallenge(challengeId) {
  return useQuery({
    queryKey: challengeKeys.detail(challengeId),
    queryFn: () => getChallenge(challengeId),
    enabled: Boolean(challengeId),
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
