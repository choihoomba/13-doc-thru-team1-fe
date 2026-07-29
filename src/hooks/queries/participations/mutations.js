import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  cancelParticipation,
  createParticipation,
} from '@/lib/api/participations';

import { challengeKeys } from '@/hooks/queries/challenges/keys';
import { submissionKeys } from '@/hooks/queries/submissions/keys';

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

/** 작업 도전 포기하기 (참여 취소)
 * 성공하면 챌린지 상세(참여 상태)와 작업물 목록(참여 현황/최다 추천)을 갱신
 */
export function useCancelParticipation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ participationId }) => cancelParticipation(participationId),
    onSuccess: (_data, { challengeId }) => {
      // useChallenge는 URL 파라미터(string)로 쿼리 키를 만드는데 여기 challengeId는
      // API 응답(number)이라, 그대로 넘기면 캐시 키가 어긋나 무효화가 조용히 실패함
      if (challengeId) {
        queryClient.invalidateQueries({
          queryKey: challengeKeys.detail(String(challengeId)),
        });
      }
      queryClient.invalidateQueries({ queryKey: submissionKeys.all });
    },
  });
}
