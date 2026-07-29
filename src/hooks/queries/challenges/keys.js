export const challengeKeys = {
  /** 챌린지 Query의 최상위 Key */
  all: ['challenges'],

  /** 모든 챌린지 목록의 공통 Key */
  lists: () => [...challengeKeys.all, 'list'],
  detail: (id) => [...challengeKeys.all, 'detail', id],

  /** 검색어, 필터, 페이지가 포함된 개별 목록 Key
   * - 일반 목록, 관리자 신청 관리, 나의 챌린지 탭이 모두 이 키를 공유
   * getChallenges에 전달하는 params가 다를 뿐 같은 목록 리소스이기 때문
   */
  list: (params) => [...challengeKeys.lists(), params],
};
