export const submissionKeys = {
  /** 작업물 Query의 최상위 Key */
  all: ['submissions'],

  /** 작업물 한 건(상세) Key */
  detail: (submissionId) => [...submissionKeys.all, 'detail', submissionId],

  /** 챌린지별 작업물 목록의 공통 Key */
  lists: () => [...submissionKeys.all, 'list'],

  /** 챌린지 + 페이지/limit이 포함된 개별 목록 Key
   * - 참여 현황 목록이 사용
   * - 최다 추천 작업물은 이 목록의 1페이지를 재사용하지만
   * 반환 형태가 달라 캐시 충돌을 피하려고 topLiked를 별도 키로 둔다
   */
  list: ({ challengeId, page, limit }) => [
    ...submissionKeys.lists(),
    challengeId,
    page,
    limit,
  ],

  /** 작업물 하나에 달린 피드백 목록 Key */
  feedbacks: (submissionId) => [
    ...submissionKeys.all,
    'feedbacks',
    submissionId,
  ],

  /** 챌린지의 최다 추천 작업물 Key */
  topLiked: (challengeId) => [...submissionKeys.all, 'topLiked', challengeId],
};
