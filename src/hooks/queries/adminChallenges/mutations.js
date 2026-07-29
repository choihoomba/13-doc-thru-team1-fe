import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  approveAdminChallenge,
  rejectAdminChallenge,
} from '@/lib/api/adminChallenges';

import { adminChallengeKeys } from './keys';

// 상태 변경 후 목록과 상세 정보를 서버에서 다시 받아옵니다.
function invalidateAdminChallenges(queryClient, challengeId) {
  return Promise.all([
    queryClient.invalidateQueries({
      queryKey: adminChallengeKeys.lists(),
    }),
    queryClient.invalidateQueries({
      queryKey: adminChallengeKeys.detail(challengeId),
    }),
  ]);
}

export function useApproveAdminChallenge(challengeId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => approveAdminChallenge(challengeId),
    onSuccess: () => invalidateAdminChallenges(queryClient, challengeId),
  });
}

export function useRejectAdminChallenge(challengeId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason) => rejectAdminChallenge(challengeId, reason),
    onSuccess: () => invalidateAdminChallenges(queryClient, challengeId),
  });
}
