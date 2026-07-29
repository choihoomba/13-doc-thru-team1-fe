export const challengeKeys = {
  all: ['challenges'],
  lists: (params) => [...challengeKeys.all, 'list', params],
  detail: (id) => [...challengeKeys.all, 'detail', id],
  participations: (tab, params) => [
    ...challengeKeys.all,
    'participations',
    tab,
    params,
  ],
  myOwned: () => [...challengeKeys.all, 'myOwned'],
};
