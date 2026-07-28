export const ENDPOINTS = {
  // clientFetch용 - 프록시(/api/*)를 거쳐서 호출
  auth: {
    me: '/api/auth/me',
    refresh: '/api/auth/refresh',
  },

  notifications: '/api/notifications',

  submissions: {
    detail: (submissionId) => `/api/submissions/${submissionId}`,
    feedbacks: (submissionId) => `/api/submissions/${submissionId}/feedbacks`,
    likes: (submissionId) => `/api/submissions/${submissionId}/likes`,
  },
  feedbacks: {
    detail: (feedbackId) => `/api/feedbacks/${feedbackId}`,
  },
  drafts: {
    detail: (id) => `/api/drafts/${id}`,
  },
  participations: {
    detail: (id) => `/api/participations/${id}`,
  },
  challenges: {
    list: '/api/challenges',
    detail: (id) => `/api/challenges/${id}`,
  },
};
