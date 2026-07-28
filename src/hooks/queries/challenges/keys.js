export const challengeKeys = {
  // 챌린지 Query의 최상위 Key
  all: ['challenges'],

  // 모든 챌린지 목록의 공통 Key
  lists: () => [...challengeKeys.all, 'list'],
  detail: (id) => [...challengeKeys.all, 'detail', id],
  participations: (tab, params) => [
    ...challengeKeys.all,
    'participations',
    tab,
    params,
  ],
  myOwned: () => [...challengeKeys.all, 'myOwned'],

  // 검색어, 필터, 페이지가 포함된 개별 목록 Key
  list: (params) => [...challengeKeys.lists(), params],
};
