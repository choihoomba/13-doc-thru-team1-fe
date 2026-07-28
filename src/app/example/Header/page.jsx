'use client';

import { useState } from 'react';

import {
  HEADER_EXAMPLE_ADMIN,
  HEADER_EXAMPLE_MEMBER,
  HEADER_EXAMPLE_NOTIFICATIONS,
} from '@/app/example/_data/headerNotifications';

import { cn } from '@/utils/cn';

import Header from '@/components/ui/Header/Header';

/*
@ Header 예제 페이지 레이아웃

Header는 viewport 전체를 기준으로 좌표를 검수해야 하므로 main에 좌우 padding을 넣지 않습니다.
내부 최대 너비는 Header와 동일한 1248px(콘텐츠 1200px + 좌우 padding 24px)입니다.
- desktop 1920px: 실제 Header 콘텐츠 좌우 360px
- iPad mini 744px: 전체 744px
- mobile 375px: 전체 375px
규격으로 각 Header를 확인할 수 있습니다.
*/
const HEADER_EXAMPLE_PAGE_STYLE = [
  'min-h-screen',
  'bg-white',
  'py-[32px]',
].join(' ');

const HEADER_EXAMPLE_CONTENT_STYLE = [
  'mx-auto',
  'flex',
  'w-full',
  'max-w-[1248px]',
  'flex-col',
  'gap-[32px]',
].join(' ');

const HEADER_EXAMPLE_INTRO_STYLE = ['px-[16px]', 'tablet:px-[24px]'].join(' ');

/*
실제 Header는 fixed가 기본값입니다.
예제 페이지에서는 여러 권한 상태를 한 화면에서 비교해야 하므로
각 예제 인스턴스만 relative로 덮어써 문서 흐름 안에 배치합니다.
*/
const PREVIEW_HEADER_CLASS_NAME = 'relative';

/**
 * Header 상태 하나와 설명을 묶는 예제 카드입니다.
 *
 * children에는 guest/member/admin Header를 전달합니다.
 * 카드 자체는 max-width를 줄이지 않아 Header 좌표 검수를 방해하지 않습니다.
 * border 대신 ring을 사용해 카드 선 1px이 Header의 실제 콘텐츠 너비를 줄이지 않게 합니다.
 */
function ExampleSection({ title, description, children, className = '' }) {
  return (
    <section
      className={cn(
        'overflow-visible rounded-[12px] ring-1 ring-gray-200',
        className,
      )}
    >
      <div className="bg-gray-50 px-[20px] py-[16px]">
        <h2 className="text-18-bold text-gray-800">{title}</h2>
        <p className="mt-[6px] text-14-regular text-gray-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function HeaderExamplePage() {
  const [notifications, setNotifications] = useState(
    HEADER_EXAMPLE_NOTIFICATIONS,
  );

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
    <main className={HEADER_EXAMPLE_PAGE_STYLE}>
      <div className={HEADER_EXAMPLE_CONTENT_STYLE}>
        <div className={HEADER_EXAMPLE_INTRO_STYLE}>
          <h1 className="text-24-bold text-gray-900">공통 Header 컴포넌트</h1>
          <p className="mt-[8px] text-14-regular text-gray-500">
            브라우저 너비를 모바일, iPad mini, 데스크톱으로 바꾸어 반응형 규격을
            확인할 수 있습니다.
          </p>
        </div>

        <ExampleSection
          title="Auth API 자동 판별 Header"
          description="user를 전달하지 않아 현재 로그인 사용자의 USER/ADMIN 역할을 자동으로 반영합니다."
        >
          <Header className={PREVIEW_HEADER_CLASS_NAME} />
        </ExampleSection>

        <ExampleSection
          title="비회원 Header"
          description="공통 ButtonSecondary의 로그인 버튼을 사용합니다."
        >
          <Header user={null} className={PREVIEW_HEADER_CLASS_NAME} />
        </ExampleSection>

        <ExampleSection
          title="회원 Header"
          description="종 아이콘을 누르면 챌린지 알림 패널이 열립니다."
          /*
           * 예제에는 같은 z-header 값을 가진 Header가 여러 개 있습니다.
           * 동일한 z-index에서는 뒤에 렌더링된 관리자 Header가 위에 그려지므로,
           * 알림 검수용 회원 카드 전체를 별도 stacking context로 올립니다.
           * 공통 Header와 실제 서비스 페이지의 z-index는 변경하지 않습니다.
           */
          className="relative z-[200]"
        >
          <Header
            user={HEADER_EXAMPLE_MEMBER}
            notifications={notifications}
            onNotificationRead={handleNotificationRead}
            onLogout={() => undefined}
            className={PREVIEW_HEADER_CLASS_NAME}
          />
        </ExampleSection>

        <ExampleSection
          title="관리자 Header - 챌린지 관리 선택"
          description="activeAdminNav='manage'이므로 챌린지 관리는 검은색, 목록은 회색입니다."
        >
          <Header
            user={HEADER_EXAMPLE_ADMIN}
            activeAdminNav="manage"
            onLogout={() => undefined}
            className={PREVIEW_HEADER_CLASS_NAME}
          />
        </ExampleSection>

        <ExampleSection
          title="관리자 Header - 챌린지 목록 선택"
          description="activeAdminNav='list'이므로 챌린지 목록은 검은색, 관리는 회색입니다."
        >
          <Header
            user={HEADER_EXAMPLE_ADMIN}
            activeAdminNav="list"
            onLogout={() => undefined}
            className={PREVIEW_HEADER_CLASS_NAME}
          />
        </ExampleSection>
      </div>
    </main>
  );
}
