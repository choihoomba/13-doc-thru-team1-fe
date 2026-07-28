// TODO: 예시 코드입니다.
export const challengeKeys = {
  all: ['challenges'],
  lists: () => [...challengeKeys.all, 'list'],
  detail: (id) => [...challengeKeys.all, 'detail', id],
  participations: (tab, params) => [
    ...challengeKeys.all,
    'participations',
    tab,
    params,
  ],
  myOwned: () => [...challengeKeys.all, 'myOwned'],
};
