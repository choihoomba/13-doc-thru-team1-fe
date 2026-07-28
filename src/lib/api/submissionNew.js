/**
 * '/submissions/new' 임시 API
 * TODO: 옮길거 lib/api/submissions.js 옮기고 지우기
 */
import clientFetch from '@/lib/api/clientFetch';

/* originalUrl */
export async function getChallenge(challengeId) {
  const { data } = await clientFetch(`/api/challenges/${challengeId}`);
  return data;
}

/**
 * 임시저장 불러오기:
 * GET /submissions/:id
 */
export async function getSubmission(id) {
  const { data } = await clientFetch(`/api/submissions/${id}`);
  return data;
}

/* 임시저장 버튼 클릭시: */
export async function saveDraft(id, { title, content }) {
  const { data } = await clientFetch(`/api/draft/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
  });
  return data;
}

/* 포기하기 버튼 클릭시: */
/* 1. GET participationId -> getSubmission 사용 */
/* 2. 포기하기로 상태 변경 */
export async function cancelParticipation(participationId) {
  const { data } = await clientFetch(`/api/participations/${participationId}`, {
    method: 'PATCH',
  });
  return data;
}

/* 제출하기 버튼 클릭시: */
/* 1. 작업물 최종 제출, submission.content로 들어감 */
export async function updateSubmission(id, content) {
  const { data } = await clientFetch(`/api/submissions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  });
  return data;
}
/* 2. 임시저장 삭제 */
export async function deleteDraft(id) {
  const { data } = await clientFetch(`/api/draft/${id}`, {
    method: 'DELETE',
  });
  return data;
}
