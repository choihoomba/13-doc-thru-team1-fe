export const submissionKeys = {
  all: ['submissions'],
  detail: (submissionId) => [...submissionKeys.all, 'detail', submissionId],
  lists: () => [...submissionKeys.all, 'list'],
  list: (challengeId, page, limit) => [
    ...submissionKeys.lists(),
    challengeId,
    page,
    limit,
  ],
  feedbacks: (submissionId) => [
    ...submissionKeys.all,
    'feedbacks',
    submissionId,
  ],
  topLiked: (challengeId) => [...submissionKeys.all, 'topLiked', challengeId],
};
