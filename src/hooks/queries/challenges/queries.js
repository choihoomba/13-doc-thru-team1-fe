import { useQuery } from '@tanstack/react-query';

import { getChallenge, getChallenges } from '@/lib/api/challenges';

import { challengeKeys } from './keys';

export function useChallenges(params) {
  return useQuery({
    queryKey: challengeKeys.lists(params),
    queryFn: () => getChallenges(params),
  });
}

// ✅ 챌린지 상세 (pending/rejected/deleted 상세 페이지 공용)
export function useChallenge(id) {
  return useQuery({
    queryKey: challengeKeys.detail(id),
    queryFn: () => getChallenge(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}
