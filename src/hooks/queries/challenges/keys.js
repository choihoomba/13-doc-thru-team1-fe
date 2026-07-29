export const challengeKeys = {
  all: ['challenges'],
  // ✅ 파라미터(검색어, 페이지)에 따라 캐시가 분리되도록 수정
  lists: (params) => [...challengeKeys.all, 'list', params],
  detail: (id) => [...challengeKeys.all, 'detail', id],
  participations: () => [...challengeKeys.all, 'participations'],
  myOwned: () => [...challengeKeys.all, 'myOwned'],
};
