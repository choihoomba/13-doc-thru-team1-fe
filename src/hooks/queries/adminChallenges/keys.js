export const adminChallengeKeys = {
  all: ['admin-challenges'],
  lists: () => [...adminChallengeKeys.all, 'list'],
  list: (params) => [...adminChallengeKeys.lists(), params],
  details: () => [...adminChallengeKeys.all, 'detail'],
  detail: (challengeId) => [...adminChallengeKeys.details(), challengeId],
};
