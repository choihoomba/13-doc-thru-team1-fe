/**
 * Participation TanStack Query 전용
 * 브라우저(클라이언트)에서 호출
 */
import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

/** 작업 도전하기 (챌린지 참여 등록)
 * - POST /participations
 * - 참여 등록과 동시에 빈 제출물(Submission)이 함께 생성된다.
 * - 응답: { participation, submission }
 */
export async function createParticipation({ challengeId }) {
  const { data } = await clientFetch(ENDPOINTS.participations.list, {
    method: 'POST',
    body: JSON.stringify({ challengeId }),
  });

  return data;
}

/** 작업 도전 포기하기 (참여 취소)
 * - PATCH /participations/:id
 */
export async function cancelParticipation(participationId) {
  const { data } = await clientFetch(
    ENDPOINTS.participations.detail(participationId),
    {
      method: 'PATCH',
    },
  );

  return data;
}
