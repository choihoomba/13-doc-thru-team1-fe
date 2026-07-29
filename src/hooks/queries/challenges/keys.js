export const challengeKeys = {
  all: ['challenges'],
  lists: (params) => [...challengeKeys.all, 'list', params],
  detail: (id) => [...challengeKeys.all, 'detail', id],
  participations: () => [...challengeKeys.all, 'participations'],
  myOwned: () => [...challengeKeys.all, 'myOwned'],
};
