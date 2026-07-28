import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createChallenge } from '@/lib/api/challenges';

import { challengeKeys } from './keys';

export function useCreateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.lists() });
    },
  });
}
