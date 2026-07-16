import { getChallenges } from '@/lib/api/challenges';
import { useQuery } from '@tanstack/react-query';

import { challengeKeys } from './keys';

// TODO: 예시 코드입니다.
export function useChallenges(params) {
  return useQuery({
    queryKey: challengeKeys.lists(),
    queryFn: () => getChallenges(params),
  });
}
