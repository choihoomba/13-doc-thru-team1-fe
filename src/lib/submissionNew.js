/**
 * '/submissions/new' 페이지 전용 임시 API 연동 함수
 *
 * lib/api, hooks/queries/submissions 쪽 공용 인프라(clientFetch 등)가
 * 아직 빈 스캐폴딩 상태라, 다른 작업과 충돌 없이 이 페이지만 우선
 * 동작시키기 위해 임시로 분리한 파일. 공용 인프라가 채워지면 그쪽으로
 * 이관하고 이 파일은 지워도 됨.
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
 * 단건 조회(GET /submissions/:id)는 draft.content를 select 하지 않아서
 * 목록 조회(GET /submissions?include=draft)를 대신 쓴다.
 * (이쪽 select엔 이미 content가 포함돼 있음 - submission.repository.js의
 * buildListSelect 참고) 응답 배열에서 id가 일치하는 항목만 찾아서 반환.
 *
 * TODO: 이 목록 API는 challengeId로 필터링해도 로그인 사용자 기준
 * 필터가 없어서, 사실 남의 draft.content까지 다 같이 내려온다.
 * 지금은 그중 내 id만 골라 쓰는 거라 이 페이지 동작엔 문제없지만,
 * 백엔드에 userId 필터 추가되는 게 맞음 (별도로 이미 전달함).
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
