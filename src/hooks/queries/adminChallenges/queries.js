import { useQuery } from '@tanstack/react-query';

import {
  getAdminChallenge,
  getAdminChallengeApplications,
} from '@/lib/api/adminChallenges';

import { adminChallengeKeys } from './keys';

// 검색·상태·정렬·페이지 조건에 맞는 어드민 신청 목록을 조회합니다.
export function useAdminChallengeApplications(params) {
  return useQuery({
    queryKey: adminChallengeKeys.list(params),
    queryFn: () => getAdminChallengeApplications(params),
    placeholderData: (previousData) => previousData,
    meta: {
      name: '어드민 챌린지 신청 목록 조회',
    },
  });
}

// URL의 challengeId에 해당하는 어드민 챌린지 상세를 조회합니다.
export function useAdminChallenge(challengeId) {
  return useQuery({
    queryKey: adminChallengeKeys.detail(challengeId),
    queryFn: () => getAdminChallenge(challengeId),
    enabled: Boolean(challengeId),
    meta: {
      name: '어드민 챌린지 신청 상세 조회',
    },
  });
}
