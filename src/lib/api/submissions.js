/**
 * Submission TanStack Query 전용
 * 브라우저(클라이언트)에서 호출
 */
import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

/** 작업물 상세 조회 */
export async function getSubmission(submissionId) {
  return clientFetch(ENDPOINTS.submissions.detail(submissionId));
}

/** 작업물 삭제 (본인: content 초기화 / 어드민: soft delete) */
export async function deleteSubmission(submissionId) {
  return clientFetch(ENDPOINTS.submissions.detail(submissionId), {
    method: 'DELETE',
  });
}

/** 피드백 목록 조회 (커서 페이지네이션) */
export async function getFeedbacks(submissionId, { cursor, take } = {}) {
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  if (take) params.set('take', take);

  const query = params.toString();
  const url = ENDPOINTS.submissions.feedbacks(submissionId);

  return clientFetch(query ? `${url}?${query}` : url);
}

/** 피드백 작성 */
export async function createFeedback(submissionId, content) {
  return clientFetch(ENDPOINTS.submissions.feedbacks(submissionId), {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

/** 피드백 수정 */
export async function updateFeedback(feedbackId, content) {
  return clientFetch(ENDPOINTS.feedbacks.detail(feedbackId), {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  });
}

/** 피드백 삭제 */
export async function deleteFeedback(feedbackId) {
  return clientFetch(ENDPOINTS.feedbacks.detail(feedbackId), {
    method: 'DELETE',
  });
}

/** 좋아요 등록 */
export async function createLike(submissionId) {
  return clientFetch(ENDPOINTS.submissions.likes(submissionId), {
    method: 'POST',
  });
}

/** 좋아요 취소 */
export async function deleteLike(submissionId) {
  return clientFetch(ENDPOINTS.submissions.likes(submissionId), {
    method: 'DELETE',
  });
}
