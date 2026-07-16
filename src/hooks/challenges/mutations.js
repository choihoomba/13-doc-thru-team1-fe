import { createChallenge } from '@/lib/api/challenges';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { challengeKeys } from './keys';

// TODO: 예시 코드입니다.
export function useCreateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.lists() });
    },
  });
}
