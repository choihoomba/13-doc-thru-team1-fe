/**
 * '/submissions/new' 임시 API
 * TODO: 옮길거 lib/api/submissions.js 옮기고 지우기
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

/* clientFetch.js 역할 임시로 만듦 */
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      body?.message ?? `요청에 실패했습니다 (${response.status})`,
    );
  }
  return body?.data;
}

/* originalUrl */
export function getChallenge(challengeId) {
  return request(`/challenges/${challengeId}`);
}

/**
 * 임시저장 불러오기:
 *
 * 단건 조회(GET /submissions/:id) -> TODO: 지금은 userId를 안받아서 불완전하기 떄문에 쓸수없음;;
 * 목록 조회(GET /submissions?include=draft) -> 이걸 일단 씀
 */
export async function getSubmission(id) {
  const submissions = await request('/submissions?include=draft');
  return submissions?.find((submission) => submission.id === Number(id));
}

/* 임시저장 버튼 클릭시: */
export function saveDraft(id, { title, content }) {
  return request(`/draft/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
  });
}

/* 포기하기 버튼 클릭시: */
/* 1. GET participationId */
export function getSubmissionDetail(id) {
  return request(`/submissions/${id}`);
}
/* 2. 포기하기로 상태 변경 */
export function cancelParticipation(participationId) {
  return request(`/participations/${participationId}`, { method: 'PATCH' });
}

/* 제출하기 버튼 클릭시: */
/* 1. 작업물 최종 제출, submission.content로 들어감 */
export function updateSubmission(id, content) {
  return request(`/submissions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  });
}
/* 2. 임시저장 삭제 */
export function deleteDraft(id) {
  return request(`/draft/${id}`, { method: 'DELETE' });
}
