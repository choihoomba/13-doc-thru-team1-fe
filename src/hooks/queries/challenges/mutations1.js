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
      queryClient.invalidateQueries({ queryKey: challengeKeys.all });
    },
  });
}

export function useDeleteChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => deleteChallenge(id, reason),
    onSuccess: () => {
      // keys1의 lists는 params를 필수로 받아 lists()로 호출하면 키가 어긋나므로, all 키를 사용하여 모든 챌린지 관련 쿼리를 무효화합니다.
      queryClient.invalidateQueries({ queryKey: challengeKeys.all });
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
      queryClient.invalidateQueries({ queryKey: challengeKeys.all });
      queryClient.removeQueries({ queryKey: challengeKeys.detail(id) });
    },
    onError: (error) => {
      console.error('챌린지 취소 실패:', error.message);
      alert('취소 중 오류가 발생했습니다.');
    },
  });
}
