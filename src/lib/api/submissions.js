import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

/* TODO: 챌린지로 이동... originalUrl */
export async function getChallenge(challengeId) {
  const { data } = await clientFetch(ENDPOINTS.challenges.detail(challengeId));
  return data;
}

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

/* 임시저장 버튼 클릭시: */
export async function saveDraft(id, { title, content }) {
  const { data } = await clientFetch(ENDPOINTS.drafts.detail(id), {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
  });
  return data;
}

/* 포기하기 버튼 클릭시: */
/* 1. GET participationId -> getSubmission 사용 */
/* 2. 포기하기로 상태 변경 */
export async function cancelParticipation(participationId) {
  const { data } = await clientFetch(
    ENDPOINTS.participations.detail(participationId),
    {
      method: 'PATCH',
    },
  );
  return data;
}

/* 제출하기 버튼 클릭시: */
/* 1. 작업물 최종 제출, submission.content로 들어감 */
export async function updateSubmission(id, content) {
  const { data } = await clientFetch(ENDPOINTS.submissions.detail(id), {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  });
  return data;
}
/* 2. 임시저장 삭제 */
export async function deleteDraft(id) {
  const { data } = await clientFetch(ENDPOINTS.drafts.detail(id), {
    method: 'DELETE',
  });
  return data;
}
