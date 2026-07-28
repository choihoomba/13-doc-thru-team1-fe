export const submissionKeys = {
  all: ['submissions'],
  detail: (submissionId) => [...submissionKeys.all, 'detail', submissionId],
  feedbacks: (submissionId) => [
    ...submissionKeys.all,
    'feedbacks',
    submissionId,
  ],
};
