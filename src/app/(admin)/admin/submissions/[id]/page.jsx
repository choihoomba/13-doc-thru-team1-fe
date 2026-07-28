'use client';

import { use } from 'react';

import { useAuth } from '@/lib/providers/AuthProvider';

import { useModal } from '@/hooks/modal/useModal';
import {
  useCreateFeedback,
  useDeleteFeedback,
  useToggleLike,
  useUpdateFeedback,
} from '@/hooks/queries/submissions/mutations';
import {
  useFeedbacks,
  useSubmission,
} from '@/hooks/queries/submissions/queries';

import SubmissionDetail from '@/components/submissions/SubmissionDetail';
import LoadingDisplay from '@/components/ui/LoadingDisplay';
import ModalConfirm from '@/components/ui/Modal/ModalConfirm';

export default function AdminSubmissionDetailPage({ params }) {
  // Next.js 15+ 에서 params는 Promise이므로 use()로 값을 꺼낸다
  const { id } = use(params);

  const { user: authRes } = useAuth();
  // 백엔드 공통 응답이 { success, data } 형태라 data를 한 겹 벗긴다
  const currentUser = authRes?.data ?? null;

  const { openModal, closeModal } = useModal();

  const { data: submissionRes, isLoading, isError, error } = useSubmission(id);
  const { data: feedbackRes, fetchNextPage, hasNextPage } = useFeedbacks(id);

  const createFeedback = useCreateFeedback(id);
  const updateFeedback = useUpdateFeedback(id);
  const deleteFeedback = useDeleteFeedback(id);
  const toggleLike = useToggleLike(id);

  if (isLoading) {
    return <LoadingDisplay className="min-h-screen" />;
  }

  if (isError) {
    return (
      <p className="py-20 text-center text-14-regular text-gray-500">
        {error?.message ?? '작업물을 불러오지 못했습니다.'}
      </p>
    );
  }

  const submission = submissionRes.data;

  // useInfiniteQuery는 페이지 배열로 쌓이므로 하나로 펼친다
  const feedbacks =
    feedbackRes?.pages.flatMap((page) => page.data.feedbacks) ?? [];

  // 피드백 관련 요청 중 실패한 사유를 화면에 노출한다
  const feedbackErrorMessage =
    createFeedback.error?.message ??
    updateFeedback.error?.message ??
    deleteFeedback.error?.message ??
    null;

  // 피드백 삭제: 되돌릴 수 없으므로 확인 모달을 거친다
  const handleDeleteFeedback = (feedback) => {
    openModal(
      <ModalConfirm
        message="정말 삭제하시겠어요?"
        cancelButtonText="아니오"
        confirmButtonText="네"
        onConfirm={() => {
          deleteFeedback.mutate(feedback.id);
          closeModal();
        }}
      />,
    );
  };

  return (
    <SubmissionDetail
      submission={submission}
      currentUser={currentUser}
      feedbacks={feedbacks}
      hasNext={!!hasNextPage}
      isSubmitting={createFeedback.isPending}
      feedbackErrorMessage={feedbackErrorMessage}
      onToggleLike={(isLiked) => toggleLike.mutate(isLiked)}
      onEdit={(s) => console.log('작업물 수정:', s)}
      onDelete={(s) => console.log('작업물 삭제:', s)}
      onFeedbackSubmit={(content) => createFeedback.mutate(content)}
      onFeedbackLoadMore={() => fetchNextPage()}
      onFeedbackEdit={(feedback, content) =>
        updateFeedback.mutate({ feedbackId: feedback.id, content })
      }
      onFeedbackDelete={handleDeleteFeedback}
    />
  );
}
