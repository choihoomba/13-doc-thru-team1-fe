import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  cancelChallenge,
  createChallenge,
  deleteChallenge,
} from '@/lib/api/challenges1.js';

import { challengeKeys } from '@/hooks/queries/challenges/keys1.js';

export function useCreateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.lists() });
    },
  });
}

export function useDeleteChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => deleteChallenge(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.lists() });
    },
    onError: (error) => {
      console.error('챌린지 삭제 실패:', error.message);
      alert('삭제 중 오류가 발생했습니다.');
    },
  });
}

export function useCancelChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => cancelChallenge(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.lists() });
      queryClient.removeQueries({ queryKey: challengeKeys.detail(id) });
    },
    onError: (error) => {
      console.error('챌린지 취소 실패:', error.message);
      alert('취소 중 오류가 발생했습니다.');
    },
  });
}
