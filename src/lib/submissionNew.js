/**
 * '/submissions/new' 임시 API
 * TODO: 옮길거 lib/api/submissions.js 옮기고 지우기
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

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

/**
 * 작업물 상세 조회 (draft 포함) - 임시저장 불러오기용
 *
 * 단건 조회(GET /submissions/:id) -> TODO: 지금은 userId를 안받아서 아직은 불완전, 나중에 다시 생각해보기
 * 목록 조회(GET /submissions?include=draft) -> 이걸 일단 씀
 */
export async function getSubmission(id) {
  const submissions = await request('/submissions?include=draft');
  return submissions?.find((submission) => submission.id === Number(id));
}

/** 임시저장 (upsert) */
export function saveDraft(id, { title, content }) {
  return request(`/draft/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
  });
}

/** 임시저장 삭제 */
export function deleteDraft(id) {
  return request(`/draft/${id}`, { method: 'DELETE' });
}

/** 챌린지 상세 조회 (원문 링크 originalUrl) */
export function getChallenge(challengeId) {
  return request(`/challenges/${challengeId}`);
}
