import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  getFeedbacks,
  getSubmission,
  getSubmissions,
  getTopLikedSubmission,
} from '@/lib/api/submissions';

import { submissionKeys } from './keys';

/** 작업물 상세 조회 */
export function useSubmission(submissionId) {
  return useQuery({
    queryKey: submissionKeys.detail(submissionId),
    queryFn: () => getSubmission(submissionId),
    enabled: !!submissionId,
  });
}

/**
 * 피드백 목록 조회 (커서 페이지네이션)
 * 백엔드가 nextCursor/hasNext를 주므로 useInfiniteQuery로 "더보기"를 처리한다
 */
export function useFeedbacks(submissionId) {
  return useInfiniteQuery({
    queryKey: submissionKeys.feedbacks(submissionId),
    queryFn: ({ pageParam }) =>
      getFeedbacks(submissionId, { cursor: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    enabled: !!submissionId,
  });
}

export function useTopLikedSubmission(challengeId) {
  return useQuery({
    queryKey: submissionKeys.topLiked(challengeId),
    queryFn: () => getTopLikedSubmission(challengeId),
    enabled: Boolean(challengeId),
    meta: { name: 'topLikedSubmission' },
  });
}

export function useSubmissions({ challengeId, page, limit }) {
  return useQuery({
    queryKey: submissionKeys.list(challengeId, page, limit),
    queryFn: () => getSubmissions({ challengeId, page, limit }),
    enabled: Boolean(challengeId),
    placeholderData: (previousData) => previousData,
    meta: { name: 'submissions' },
  });
}
