import clientFetch from '@/lib/api/clientFetch';

/**
 * 신규 챌린지를 신청합니다.
 *
 * 팀 공통 clientFetch와 상대 경로를 사용해 Next.js 프록시를 거칩니다.
 * userId, status, currentParticipants는 서버 관리 값이므로 payload에 포함하지 않습니다.
 */
export function createChallenge(payload) {
  return clientFetch('/api/challenges', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
