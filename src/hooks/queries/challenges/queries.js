import { useQuery } from '@tanstack/react-query';

import { getChallenge } from '@/lib/api/challenges';

import { challengeKeys } from './keys';

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
  });
}
