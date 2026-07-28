import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createFeedback,
  createLike,
  deleteFeedback,
  deleteLike,
  deleteSubmission,
  updateFeedback,
} from '@/lib/api/submissions';

import { submissionKeys } from './keys';

/** 피드백 작성 */
export function useCreateFeedback(submissionId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) => createFeedback(submissionId, content),
    onSuccess: () => {
      // 작성 API 응답에 작성자 정보가 없어 목록을 다시 조회한다
      queryClient.invalidateQueries({
        queryKey: submissionKeys.feedbacks(submissionId),
      });
    },
  });
}

/** 피드백 수정 */
export function useUpdateFeedback(submissionId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ feedbackId, content }) =>
      updateFeedback(feedbackId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: submissionKeys.feedbacks(submissionId),
      });
    },
  });
}

/** 피드백 삭제 */
export function useDeleteFeedback(submissionId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feedbackId) => deleteFeedback(feedbackId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: submissionKeys.feedbacks(submissionId),
      });
    },
  });
}

/** 작업물 삭제 (본인: content 초기화 / 어드민: soft delete는 백엔드가 role로 분기) */
export function useDeleteSubmission(submissionId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteSubmission(submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: submissionKeys.all,
      });
    },
  });
}

/**
 * 좋아요 토글 (현재 상태에 따라 등록/취소)
 *
 * 캐시를 낙관적으로 먼저 갱신해 화면에 즉시 반영하고,
 * 실패 시 이전 값으로 롤백, 완료 후 서버 값으로 재동기화한다.
 * (컴포넌트가 로컬 state로 하트를 들고 있으면 서버 갱신이 반영되지 않는 문제가 있어
 * 캐시를 단일 소스로 삼아 여기서 관리한다)
 */
export function useToggleLike(submissionId) {
  const queryClient = useQueryClient();
  const queryKey = submissionKeys.detail(submissionId);

  return useMutation({
    mutationFn: (isLiked) =>
      isLiked ? deleteLike(submissionId) : createLike(submissionId),
    onMutate: async (isLiked) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            isLiked: !isLiked,
            _count: {
              ...old.data._count,
              likes: old.data._count.likes + (isLiked ? -1 : 1),
            },
          },
        };
      });

      return { previous };
    },
    onError: (_error, _isLiked, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
