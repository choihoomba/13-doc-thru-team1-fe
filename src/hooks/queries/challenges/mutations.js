import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createChallenge, updateChallenge } from '@/lib/api/challenges';

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

/**
 * [챌린지 수정 페이지] PATCH 성공 후 상세와 목록 캐시를 무효화합니다.
 *
 * 상세 페이지와 목록 페이지 담당자가 같은 challengeKeys를 사용하면 수정 직후
 * 최신 데이터를 다시 조회할 수 있습니다. 공용 캐시에 응답을 임의로 덮어쓰지
 * 않아 다른 화면에서 필요한 relation 데이터가 사라지는 문제도 방지합니다.
 */
export function useUpdateChallenge(challengeId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => updateChallenge(challengeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: challengeKeys.detail(challengeId),
      });
      queryClient.invalidateQueries({ queryKey: challengeKeys.lists() });
    },
  });
}
