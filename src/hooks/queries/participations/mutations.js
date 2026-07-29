import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createParticipation } from '@/lib/api/participations';

import { challengeKeys } from '@/hooks/queries/challenges/keys';

/** 작업 도전하기 (챌린지 참여 등록)
 * 성공하면 currentParticipants/viewer가 바뀌므로 해당 챌린지 상세를 갱신
 */
export function useCreateParticipation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createParticipation,
    onSuccess: (_data, { challengeId }) => {
      queryClient.invalidateQueries({
        queryKey: challengeKeys.detail(challengeId),
      });
    },
  });
}
