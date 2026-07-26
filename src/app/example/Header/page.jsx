'use client';

import { useState } from 'react';

import Header from '@/components/ui/Header';

const EXAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    targetType: 'CHALLENGE',
    targetId: 12,
    message: '신청한 챌린지가 승인되어 전달될 예정입니다.',
    isRead: false,
    createdAt: '2024-04-01T09:05:00Z',
  },
  {
    id: 2,
    targetType: 'CHALLENGE',
    targetId: 14,
    message: '신청한 챌린지가 승인되었습니다.',
    isRead: true,
    createdAt: '2024-04-01T09:05:00Z',
  },
  {
    id: 3,
    targetType: 'CHALLENGE',
    targetId: 15,
    message: '신청한 챌린지가 거절되었습니다.',
    isRead: true,
    createdAt: '2024-04-01T09:05:00Z',
  },
  {
    id: 4,
    targetType: 'CHALLENGE',
    targetId: 6,
    message: '챌린지의 도전한 작업물에 피드백이 추가되었습니다.',
    isRead: true,
    createdAt: '2024-04-01T09:05:00Z',
  },
  {
    id: 5,
    targetType: 'CHALLENGE',
    targetId: 9,
    message: '신청한 챌린지가 마감되었습니다.',
    isRead: true,
    createdAt: '2024-04-01T09:05:00Z',
  },
  {
    // Header에서 CHALLENGE가 아닌 알림을 제외하는지 확인하는 예시입니다.
    id: 6,
    targetType: 'FEEDBACK',
    targetId: 40,
    message: '작업물에 새로운 피드백이 등록되었습니다.',
    isRead: false,
    createdAt: '2024-04-01T09:05:00Z',
  },
];

function ExampleSection({ title, description, children }) {
  return (
    <section className="overflow-visible rounded-[12px] border border-gray-200">
      <div className="bg-gray-50 px-[20px] py-[16px]">
        <h2 className="text-18-bold text-gray-800">{title}</h2>
        <p className="mt-[6px] text-14-regular text-gray-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function HeaderExamplePage() {
  const [notifications, setNotifications] = useState(EXAMPLE_NOTIFICATIONS);

  function handleNotificationRead(notificationId) {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-white px-[16px] py-[32px] tablet:px-[24px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[32px]">
        <div>
          <h1 className="text-24-bold text-gray-900">공통 Header 컴포넌트</h1>
          <p className="mt-[8px] text-14-regular text-gray-500">
            브라우저 너비를 모바일, iPad mini, 데스크톱으로 바꾸어 반응형 규격을
            확인할 수 있습니다.
          </p>
        </div>

        <ExampleSection
          title="Auth API 자동 판별 Header"
          description="variant를 전달하지 않아 현재 로그인 사용자의 USER/ADMIN 역할을 자동으로 반영합니다."
        >
          <Header />
        </ExampleSection>

        <ExampleSection
          title="비회원 Header"
          description="공통 ButtonSecondary의 로그인 버튼을 사용합니다."
        >
          <Header variant="guest" />
        </ExampleSection>

        <ExampleSection
          title="회원 Header"
          description="종 아이콘을 누르면 챌린지 알림 패널이 열립니다."
        >
          <Header
            variant="member"
            notifications={notifications}
            onNotificationRead={handleNotificationRead}
            className="z-[81]"
          />
        </ExampleSection>

        <ExampleSection
          title="관리자 Header"
          description="activeAdminNav로 현재 관리자 메뉴를 표시합니다."
        >
          <Header variant="admin" activeAdminNav="manage" />
        </ExampleSection>
      </div>
    </main>
  );
}
