/*
@ Header 예제용 챌린지 알림

- 실제 페이지에서 Header의 notifications prop을 생략하면 Notification API를 사용합니다.
- example 경로에서는 백엔드 실행 여부와 관계없이 UI와 읽음 처리를 확인할 수 있도록
  동일한 목 데이터를 Header 예제와 Form 결합 예제에서 공유합니다.
*/
export const HEADER_EXAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    targetType: 'CHALLENGE',
    targetId: 12,
    message:
      "'신청한 챌린지 이름'/'챌린지 이름'에 도전한 작업물에/'챌린지 이름'의 작업물에 작성한 피드백이 수정/삭제되었어요",
    isRead: false,
    createdAt: '2024-04-01T09:05:00Z',
  },
  {
    id: 2,
    targetType: 'CHALLENGE',
    targetId: 14,
    message: "'신청한 챌린지 이름'이 승인/거절되었어요",
    isRead: true,
    createdAt: '2024-04-01T09:05:00Z',
  },
  {
    id: 3,
    targetType: 'CHALLENGE',
    targetId: 15,
    message: "'신청한 챌린지 이름'에 작업물이 추가되었어요",
    isRead: true,
    createdAt: '2024-04-01T09:05:00Z',
  },
  {
    id: 4,
    targetType: 'CHALLENGE',
    targetId: 6,
    message: "'챌린지 이름'에 도전한 작업물에 피드백이 추가되었어요",
    isRead: true,
    createdAt: '2024-04-01T09:05:00Z',
  },
  {
    id: 5,
    targetType: 'CHALLENGE',
    targetId: 9,
    message: "'신청한 챌린지 이름'이 마감되었어요",
    isRead: true,
    createdAt: '2024-04-01T09:05:00Z',
  },
  {
    id: 6,
    targetType: 'CHALLENGE',
    targetId: 10,
    message: "'챌린지 이름'에 새로운 작업물이 등록되었어요",
    isRead: true,
    createdAt: '2024-04-01T09:05:00Z',
  },
  {
    id: 7,
    targetType: 'CHALLENGE',
    targetId: 11,
    message: "'챌린지 이름'의 모집이 곧 마감돼요",
    isRead: true,
    createdAt: '2024-04-01T09:05:00Z',
  },
  {
    id: 8,
    targetType: 'CHALLENGE',
    targetId: 13,
    message: "'챌린지 이름'의 상태가 변경되었어요",
    isRead: true,
    createdAt: '2024-04-01T09:05:00Z',
  },
  {
    // Header가 CHALLENGE 이외의 알림을 제외하는지 확인합니다.
    id: 9,
    targetType: 'FEEDBACK',
    targetId: 40,
    message: '작업물에 새로운 피드백이 등록되었습니다.',
    isRead: false,
    createdAt: '2024-04-01T09:05:00Z',
  },
];

/*
프로필 패널을 백엔드 실행 없이 확인하기 위한 Auth API 응답 형태의 목 사용자입니다.
실제 페이지에서는 Header의 user prop을 생략하고 AuthProvider의 /auth/me
응답(nickname, grade, role)을 그대로 사용합니다.
*/
export const HEADER_EXAMPLE_MEMBER = {
  id: 1,
  nickname: '체다치즈',
  grade: 'EXPERT',
  role: 'USER',
};

export const HEADER_EXAMPLE_ADMIN = {
  id: 2,
  nickname: '체다치즈',
  grade: 'GENERAL',
  role: 'ADMIN',
};
