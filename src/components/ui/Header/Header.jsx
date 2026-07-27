'use client';

/*
Next.js App Router는 기본적으로 컴포넌트를 Server Component로 처리합니다.
Header는 아래 브라우저·React 기능이 필요하므로 Client Component여야 합니다.

- useState/useEffect/useRef: 드롭다운 열림 상태와 모바일 body 스크롤 제어
- useAuth: Context API에 저장된 로그인 사용자 확인
- useRouter/usePathname: 알림 상세 이동과 관리자 현재 메뉴 판별
- document/window: 바깥 클릭·Escape·화면 너비 확인

단순히 화면만 그리는 Logo/ProfilePanel은 작은 함수·파일로 분리하고,
상태와 API 연결은 이 Header 경계에서 관리합니다.
*/
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import IcBell from '@/app/assets/icons/ic_bell.svg';
import ImgLogo from '@/app/assets/images/img_logo.svg';
import ImgProfileAdmin from '@/app/assets/images/img_profile_admin.svg';
import ImgProfileMember from '@/app/assets/images/img_profile_member.svg';

import { useAuth } from '@/lib/providers/AuthProvider';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';
import { useMarkNotificationAsRead } from '@/hooks/queries/notifications/mutations';
import { useChallengeNotifications } from '@/hooks/queries/notifications/queries';

import { cn } from '@/utils/cn';

import ButtonSecondary from '@/components/ui/Button/ButtonSecondary';

import {
  HEADER_ADMIN_CONTENT_STYLE,
  HEADER_ADMIN_NAV_ITEM_STYLE,
  HEADER_ADMIN_NAV_STYLE,
  HEADER_CONTAINER_STYLE,
  HEADER_ICON_BUTTON_STYLE,
  HEADER_LOGIN_BUTTON_STYLE,
  HEADER_LOGO_STYLE,
  HEADER_MEMBER_ACTIONS_STYLE,
  HEADER_PROFILE_AREA_STYLE,
  HEADER_PROFILE_BUTTON_STYLE,
  HEADER_STYLE,
} from './headerStyles';
import NotificationPanel from './NotificationPanel';
import ProfilePanel from './ProfilePanel';

/*
Header가 compact 디자인으로 전환되는 최대 너비입니다.
headerStyles.js의 min-[600px] standard 전환점과 한 쌍으로 관리합니다.
*/
const COMPACT_HEADER_MAX_WIDTH = 599;

/*
관리자 메뉴 설정입니다.

- key: activeAdminNav prop과 비교하는 상태 식별자
- label: 사용자에게 표시되는 메뉴 이름
- href: Next.js Link가 이동할 App Router 경로

메뉴를 JSX로 반복 작성하지 않아 링크와 활성 상태 처리 방식을 동일하게 유지합니다.
*/
const ADMIN_NAV_ITEMS = [
  {
    key: 'manage',
    label: '챌린지 관리',
    href: '/admin/manage',
  },
  {
    key: 'list',
    label: '챌린지 목록',
    href: '/admin/challenges',
  },
];

/**
 * 현재 App Router 경로를 관리자 메뉴 key로 변환합니다.
 *
 * activeAdminNav prop을 전달한 경우:
 * - 예제나 특수 페이지가 선택 상태를 직접 제어하도록 그 값을 우선합니다.
 * - null을 명시하면 두 메뉴를 모두 비활성 색상으로 표시할 수도 있습니다.
 *
 * prop을 생략한 경우:
 * - 현재 pathname이 href와 같거나 하위 경로이면 해당 메뉴를 선택합니다.
 * - 예: /admin/challenges/12 → list
 *
 * @param {'manage' | 'list' | null | undefined} activeAdminNav
 * @param {string} pathname - usePathname이 반환한 현재 URL 경로
 * @returns {'manage' | 'list' | null}
 */
function getActiveAdminNav(activeAdminNav, pathname) {
  if (activeAdminNav !== undefined) return activeAdminNav;

  const matchedItem = ADMIN_NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return matchedItem?.key ?? null;
}

/**
 * 외부에서 강제로 지정한 variant와 Auth API 결과를 하나의 Header 상태로 정리합니다.
 *
 * 우선순위:
 * 1. variant가 있으면 예제/테스트에서 요청한 상태를 그대로 사용
 * 2. Auth 확인 중이면 잘못된 UI가 잠깐 보이지 않도록 null
 * 3. user가 없으면 guest
 * 4. role이 ADMIN이면 admin
 * 5. 나머지 로그인 사용자는 member
 *
 * @param {'guest' | 'member' | 'admin' | undefined} variant
 * @param {object | null} user - AuthProvider가 제공한 현재 사용자
 * @param {boolean} isAuthLoading - /auth/me 확인 진행 여부
 * @returns {'guest' | 'member' | 'admin' | null}
 */
function getHeaderVariant({ variant, user, isAuthLoading }) {
  if (variant) return variant;
  if (isAuthLoading) return null;
  if (!user) return 'guest';
  if (user.role === 'ADMIN') return 'admin';

  return 'member';
}

/**
 * 모든 Header 상태가 공통으로 사용하는 Docthru 홈 링크입니다.
 *
 * next/image를 사용해 SVG 크기를 명시하고 레이아웃 이동을 방지합니다.
 * 실제 표시 크기는 HEADER_LOGO_STYLE이 mobile 80×18, standard 120×27로 처리합니다.
 *
 * @param {string} href - 로고 클릭 시 이동할 경로
 */
function HeaderLogo({ href }) {
  return (
    <Link
      href={href}
      aria-label="독스루 홈"
      className="flex shrink-0 items-center"
    >
      <Image
        src={ImgLogo}
        width={120}
        height={27}
        priority
        alt="Docthru"
        className={HEADER_LOGO_STYLE}
      />
    </Link>
  );
}

/**
 * 회원과 관리자 상태가 공유하는 32×32 프로필 메뉴 버튼입니다.
 *
 * 기존에는 아이콘 클릭 즉시 페이지를 이동했지만 Figma에는 사용자 정보와
 * 메뉴를 담은 드롭다운이 있으므로 button으로 열고 닫도록 변경했습니다.
 *
 * @param {'member' | 'admin'} variant - 사용할 프로필 이미지 종류
 * @param {string} controlsId - aria-controls로 연결할 프로필 패널 id
 * @param {boolean} isOpen - 패널 열림 상태
 * @param {() => void} onClick - 패널 토글 함수
 */
function ProfileButton({ variant, controlsId, isOpen, onClick }) {
  const isAdmin = variant === 'admin';

  return (
    <button
      type="button"
      aria-label={isAdmin ? '관리자 계정 메뉴' : '회원 계정 메뉴'}
      aria-expanded={isOpen}
      aria-controls={controlsId}
      onClick={onClick}
      className={HEADER_PROFILE_BUTTON_STYLE}
    >
      <Image
        src={isAdmin ? ImgProfileAdmin : ImgProfileMember}
        width={32}
        height={32}
        alt=""
      />
    </button>
  );
}

/**
 * 관리자 전용 메뉴를 렌더링합니다.
 *
 * activeAdminNav와 일치한 항목은 검은색, 나머지는 회색으로 표시합니다.
 * aria-current="page"도 함께 제공해 색상에 의존하지 않고 현재 메뉴를 알 수 있습니다.
 *
 * @param {'manage' | 'list' | null} activeAdminNav - 현재 선택된 관리자 메뉴
 */
function AdminNavigation({ activeAdminNav }) {
  return (
    <nav aria-label="관리자 메뉴" className={HEADER_ADMIN_NAV_STYLE}>
      {ADMIN_NAV_ITEMS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          aria-current={activeAdminNav === item.key ? 'page' : undefined}
          className={cn(
            HEADER_ADMIN_NAV_ITEM_STYLE,
            // 현재 경로는 gray-800, 선택되지 않은 경로는 gray-500을 사용합니다.
            activeAdminNav === item.key ? 'text-gray-800' : 'text-gray-500',
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

/**
 * 공통 Header
 *
 * variant
 * - guest: 비회원 랜딩 페이지의 로그인 버튼
 * - member: 회원 페이지의 챌린지 알림과 프로필
 * - admin: 관리자 페이지의 메뉴와 관리자 프로필
 *
 * variant를 생략하면 Auth API의 user.role을 기준으로 상태를 자동 결정합니다.
 * variant prop은 예제처럼 특정 상태를 독립적으로 확인할 때만 사용합니다.
 *
 * notifications를 전달하지 않으면 실제 Notification API를 호출합니다.
 * 예제/스토리에서는 notifications prop으로 목 데이터를 주입할 수 있습니다.
 *
 * @param {'guest' | 'member' | 'admin'} [variant]
 *   생략하면 AuthProvider의 user.role로 자동 판별합니다.
 * @param {'manage' | 'list' | null} [activeAdminNav]
 *   admin 상태에서 검은색으로 표시할 메뉴입니다. 생략하면 현재 경로로 자동 판별합니다.
 * @param {string} [logoHref='/'] 로고 링크 경로입니다.
 * @param {string} [loginHref='/signin'] 비회원 로그인 링크 경로입니다.
 * @param {string} [memberProfileHref='/challenges/mine'] 회원 프로필 링크입니다.
 * @param {object} [profileUser]
 *   예제에서만 Auth 사용자 대신 표시할 사용자입니다. 실제 페이지는 생략합니다.
 * @param {Array<object>} [notifications]
 *   전달하면 API 대신 해당 데이터를 사용합니다. example UI 검수용입니다.
 * @param {(notificationId: number|string) => void} [onNotificationRead]
 *   목 알림을 사용한 예제에서 부모 state의 읽음 상태를 갱신합니다.
 * @param {() => Promise<void>|void} [onLogout]
 *   예제에서 실제 로그아웃 API 호출을 피하기 위한 선택적 대체 함수입니다.
 * @param {string} [className] 페이지별 z-index 등 안전한 추가 스타일을 합칩니다.
 */
export default function Header({
  variant,
  activeAdminNav,
  logoHref = '/',
  loginHref = '/signin',
  memberProfileHref = '/challenges/mine',
  profileUser,
  notifications: providedNotifications,
  onNotificationRead,
  onLogout,
  className = '',
}) {
  /*
  Next.js App Router의 router입니다.
  알림을 선택한 후 targetId에 해당하는 챌린지 상세 페이지로 이동할 때 사용합니다.
  */
  const router = useRouter();
  const pathname = usePathname();

  /*
  AuthProvider는 /auth/me 응답을 user에 저장합니다.
  variant를 생략한 실제 페이지에서 guest/member/admin을 자동으로 결정합니다.
  */
  const { user, isLoading: isAuthLoading, signout } = useAuth();

  /*
  React useId로 Header 인스턴스마다 다른 id를 만듭니다.
  예제처럼 한 화면에 Header가 여러 개 있어도 aria-controls가 다른 패널을
  가리키므로 고정 문자열 id가 중복되는 문제를 막습니다.
  */
  const headerId = useId();
  const notificationPanelId = `${headerId}-challenge-notifications`;
  const profilePanelId = `${headerId}-profile-menu`;

  /*
  알림 버튼과 패널을 하나의 영역으로 묶는 ref입니다.
  useOutsideClick이 이 영역 내부 클릭은 유지하고 외부 클릭만 닫도록 사용합니다.
  */
  const actionAreaRef = useRef(null);

  // 두 드롭다운의 열림 상태는 Header 내부에서만 관리합니다.
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutPending, setIsLogoutPending] = useState(false);

  /*
  Auth 확인 중에는 잘못된 로그인 버튼이 잠깐 보이지 않도록 액션 영역을 비웁니다.
  명시적 variant가 있는 example은 Auth 응답을 기다리지 않고 곧바로 해당 상태를 보여줍니다.
  */
  const resolvedVariant = getHeaderVariant({
    variant,
    user,
    isAuthLoading,
  });

  /*
  관리자 메뉴는 페이지에서 activeAdminNav를 지정하면 그 값을 사용하고,
  생략하면 pathname을 기준으로 현재 페이지를 자동 선택합니다.
  */
  const resolvedActiveAdminNav = getActiveAdminNav(activeAdminNav, pathname);

  const shouldRequestNotifications =
    resolvedVariant === 'member' && providedNotifications === undefined;

  /*
  Hook 호출 순서는 렌더마다 같아야 하므로 회원일 때만 Hook 자체를 호출하는 대신,
  enabled 옵션으로 실제 네트워크 요청만 제어합니다.

  example에서 notifications prop을 전달하면 API를 호출하지 않고 목 데이터로 UI를 검사합니다.
  */
  const {
    data: requestedNotifications = [],
    isLoading,
    isError,
  } = useChallengeNotifications({
    enabled: shouldRequestNotifications,
  });

  const { mutateAsync: markAsRead } = useMarkNotificationAsRead();

  /*
  API query의 select에서도 CHALLENGE 알림을 필터링하지만,
  props로 직접 받은 예제 데이터에는 다른 도메인이 섞일 수 있어 이 경계에서 한 번 더 거릅니다.
  Header는 요구사항대로 챌린지 관련 알림만 표시합니다.
  */
  const challengeNotifications = (
    providedNotifications ?? requestedNotifications
  ).filter((notification) => notification.targetType === 'CHALLENGE');

  /*
  서버에서 목록을 다시 받아 Header가 재마운트되거나,
  읽음 mutation이 React Query 캐시를 갱신하면 이 값도 자동으로 다시 계산됩니다.
  한 건이라도 isRead=false이면 종 아이콘 오른쪽 위에 Red Dot을 표시합니다.
  */
  const hasUnreadNotifications = challengeNotifications.some(
    (notification) => !notification.isRead,
  );

  /*
  useCallback으로 닫기 함수의 참조를 고정합니다.
  이렇게 해야 Header가 다시 렌더링될 때 useOutsideClick의 document 이벤트를
  불필요하게 제거하고 다시 등록하지 않습니다.
  */
  const closeNotificationPanel = useCallback(() => {
    setIsNotificationOpen(false);
  }, []);

  const closeActionPanels = useCallback(() => {
    setIsNotificationOpen(false);
    setIsProfileOpen(false);
  }, []);

  useOutsideClick(actionAreaRef, closeActionPanels, {
    enabled: isNotificationOpen || isProfileOpen,
    detectFocus: true,
    closeOnEscape: true,
  });

  /*
  compact 모바일 알림은 position: fixed로 viewport 전체를 덮습니다.
  패널 뒤의 Form까지 같이 스크롤되면 두 화면이 겹쳐 움직이므로 body 스크롤을 잠급니다.

  600px 이상은 작은 드롭다운이므로 배경 페이지 스크롤을 유지합니다.
  cleanup에서 원래 overflow를 복원해 페이지 이동 후에도 스크롤이 잠기지 않게 합니다.
  */
  useEffect(() => {
    if (
      !isNotificationOpen ||
      !window.matchMedia(`(max-width: ${COMPACT_HEADER_MAX_WIDTH}px)`).matches
    ) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isNotificationOpen]);

  /**
   * 알림 행을 선택했을 때 읽음 처리 후 챌린지 상세로 이동합니다.
   *
   * 실제 API 데이터:
   * - 읽지 않은 알림이면 PATCH 읽음 API 호출
   * - React Query mutation이 성공하면 목록 캐시도 같은 값으로 갱신
   *
   * example 목 데이터:
   * - API 대신 onNotificationRead를 호출해 부모의 목 state를 갱신
   *
   * 읽음 API가 실패해도 사용자가 알림 대상 페이지를 여는 동작은 막지 않습니다.
   */
  async function handleNotificationSelect(notification) {
    if (!notification.isRead) {
      if (providedNotifications === undefined) {
        try {
          await markAsRead(notification.id);
        } catch {
          // 읽음 API 실패가 챌린지 상세 이동까지 막지 않도록 이동은 계속합니다.
        }
      } else {
        onNotificationRead?.(notification.id);
      }
    }

    closeNotificationPanel();
    router.push(`/challenges/${notification.targetId}`);
  }

  /**
   * 프로필 메뉴의 로그아웃을 한 번만 실행합니다.
   *
   * 실제 페이지에서는 AuthProvider.signout을 사용해 Cookie 삭제 API 호출,
   * React Query 캐시 삭제, user 초기화를 함께 수행합니다.
   * example이 onLogout을 전달하면 네트워크 요청과 페이지 이동 없이 UI만 검수합니다.
   */
  async function handleLogout() {
    if (isLogoutPending) return;

    setIsLogoutPending(true);

    try {
      if (onLogout) {
        await onLogout();
      } else {
        await signout();
      }

      closeActionPanels();

      if (!onLogout) {
        router.replace('/');
        router.refresh();
      }
    } finally {
      setIsLogoutPending(false);
    }
  }

  function toggleNotificationPanel() {
    /*
    두 패널이 겹치지 않도록 알림을 열기 전에 프로필을 닫습니다.
    함수형 setState를 사용해 클릭 시점의 최신 열림 값을 반전합니다.
    */
    setIsProfileOpen(false);
    setIsNotificationOpen((isOpen) => !isOpen);
  }

  function toggleProfilePanel() {
    // 프로필을 열 때도 같은 원칙으로 알림 패널을 먼저 닫습니다.
    setIsNotificationOpen(false);
    setIsProfileOpen((isOpen) => !isOpen);
  }

  return (
    <header
      className={cn(HEADER_STYLE, className)}
      aria-busy={variant === undefined && isAuthLoading}
    >
      <div className={HEADER_CONTAINER_STYLE}>
        {resolvedVariant === 'admin' ? (
          <div className={HEADER_ADMIN_CONTENT_STYLE}>
            <HeaderLogo href={logoHref} />
            <AdminNavigation activeAdminNav={resolvedActiveAdminNav} />
          </div>
        ) : (
          <HeaderLogo href={logoHref} />
        )}

        {resolvedVariant === 'guest' && (
          <ButtonSecondary
            href={loginHref}
            variant="secondary"
            color="black"
            size="md"
            className={HEADER_LOGIN_BUTTON_STYLE}
          >
            로그인
          </ButtonSecondary>
        )}

        {resolvedVariant === 'member' && (
          <div ref={actionAreaRef} className={HEADER_MEMBER_ACTIONS_STYLE}>
            <button
              type="button"
              aria-label={
                hasUnreadNotifications
                  ? '읽지 않은 챌린지 알림 있음'
                  : '챌린지 알림'
              }
              aria-expanded={isNotificationOpen}
              aria-controls={notificationPanelId}
              // 같은 버튼으로 열기와 닫기를 모두 제공해 마우스/키보드 동작을 일치시킵니다.
              onClick={toggleNotificationPanel}
              className={HEADER_ICON_BUTTON_STYLE}
            >
              <Image src={IcBell} width={24} height={24} alt="" />
              {hasUnreadNotifications && (
                <span
                  aria-hidden="true"
                  className="absolute right-[-1px] top-[-1px] size-[6px] rounded-full bg-red-error ring-1 ring-white"
                />
              )}
            </button>

            <ProfileButton
              variant="member"
              controlsId={profilePanelId}
              isOpen={isProfileOpen}
              onClick={toggleProfilePanel}
            />

            {isNotificationOpen && (
              <NotificationPanel
                id={notificationPanelId}
                notifications={challengeNotifications}
                isLoading={shouldRequestNotifications ? isLoading : false}
                isError={shouldRequestNotifications ? isError : false}
                onClose={closeNotificationPanel}
                onSelect={handleNotificationSelect}
              />
            )}

            {isProfileOpen && (
              <ProfilePanel
                id={profilePanelId}
                variant="member"
                user={profileUser ?? user}
                memberProfileHref={memberProfileHref}
                onLogout={handleLogout}
                isLogoutPending={isLogoutPending}
              />
            )}
          </div>
        )}

        {resolvedVariant === 'admin' && (
          <div ref={actionAreaRef} className={HEADER_PROFILE_AREA_STYLE}>
            <ProfileButton
              variant="admin"
              controlsId={profilePanelId}
              isOpen={isProfileOpen}
              onClick={toggleProfilePanel}
            />

            {isProfileOpen && (
              <ProfilePanel
                id={profilePanelId}
                variant="admin"
                user={profileUser ?? user}
                onLogout={handleLogout}
                isLogoutPending={isLogoutPending}
              />
            )}
          </div>
        )}
      </div>
    </header>
  );
}
