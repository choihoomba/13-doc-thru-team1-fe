'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import IcBell from '@/app/assets/icons/ic_bell.svg';

import { signoutAction } from '@/lib/actions/auth';
import { useAuth } from '@/lib/providers/AuthProvider';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';
import { useMarkNotificationAsRead } from '@/hooks/queries/notifications/mutations';
import { useChallengeNotifications } from '@/hooks/queries/notifications/queries';

import { cn } from '@/utils/cn';

import ButtonSecondary from '@/components/ui/Button/ButtonSecondary';

import AdminNavigation, { getActiveAdminNav } from './AdminNavigation';
import HeaderLogo from './HeaderLogo';
import NotificationPanel from './NotificationPanel';
import ProfileButton from './ProfileButton';
import ProfilePanel from './ProfilePanel';

const COMPACT_HEADER_MAX_WIDTH = 599;

function getHeaderVariant(user) {
  if (!user) return 'guest';
  if (user.role === 'ADMIN') return 'admin';

  return 'member';
}

/**
 * 비회원·회원·관리자가 공통으로 사용하는 고정 Header입니다.
 *
 * 실제 페이지에서는 user를 생략하면 AuthProvider의 현재 사용자를 사용합니다.
 * 예제에서는 user에 null 또는 목 사용자를 전달해 API와 무관하게 권한별 UI를 검수합니다.
 * 고정 Header 아래 본문에는 56px, 600px 이상에서는 60px의 상단 여백이 필요합니다.
 */
export default function Header({
  user: providedUser,
  activeAdminNav,
  notifications: providedNotifications,
  onNotificationRead,
  onLogout,
  className = '',
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user: authUser } = useAuth();

  // undefined는 실제 Auth 사용자 사용, null은 예제의 비회원 상태를 의미합니다.
  const user = providedUser === undefined ? authUser : providedUser;
  const headerVariant = getHeaderVariant(user);
  const isMember = headerVariant === 'member';
  const isAdmin = headerVariant === 'admin';

  const headerId = useId();
  const notificationPanelId = `${headerId}-challenge-notifications`;
  const profilePanelId = `${headerId}-profile-menu`;
  const actionAreaRef = useRef(null);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutPending, setIsLogoutPending] = useState(false);

  const activeAdminMenu = getActiveAdminNav(activeAdminNav, pathname);
  const shouldRequestNotifications =
    isMember && providedNotifications === undefined;

  // Hook 호출 순서는 유지하고 enabled로 회원의 실제 요청만 실행합니다.
  const {
    data: requestedNotifications = [],
    isLoading,
    isError,
  } = useChallengeNotifications({
    enabled: shouldRequestNotifications,
  });
  const { mutateAsync: markAsRead } = useMarkNotificationAsRead();

  const challengeNotifications = (
    providedNotifications ?? requestedNotifications
  ).filter((notification) => notification.targetType === 'CHALLENGE');
  const hasUnreadNotifications = challengeNotifications.some(
    (notification) => !notification.isRead,
  );

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

  /**
   * 모바일 알림은 viewport 전체를 사용하므로 html과 body의 스크롤을 함께 잠급니다.
   * 패널 내부 목록에는 overscroll-contain을 적용해 목록 끝에서도 배경으로 전달되지 않습니다.
   */
  useEffect(() => {
    const isCompact = window.matchMedia(
      `(max-width: ${COMPACT_HEADER_MAX_WIDTH}px)`,
    ).matches;

    if (!isNotificationOpen || !isCompact) return undefined;

    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [isNotificationOpen]);

  async function handleNotificationSelect(notification) {
    if (!notification.isRead) {
      if (providedNotifications === undefined) {
        try {
          await markAsRead(notification.id);
        } catch {
          // 읽음 처리 실패가 사용자의 챌린지 상세 이동까지 막지는 않습니다.
        }
      } else {
        onNotificationRead?.(notification.id);
      }
    }

    closeNotificationPanel();
    router.push(`/challenges/${notification.targetId}`);
  }

  async function handleLogout() {
    if (isLogoutPending) return;

    setIsLogoutPending(true);

    try {
      if (onLogout) {
        await onLogout();
        closeActionPanels();
        return;
      }

      await signoutAction();
    } finally {
      setIsLogoutPending(false);
    }
  }

  function toggleNotificationPanel() {
    setIsProfileOpen(false);
    setIsNotificationOpen((isOpen) => !isOpen);
  }

  function toggleProfilePanel() {
    setIsNotificationOpen(false);
    setIsProfileOpen((isOpen) => !isOpen);
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-header h-[56px] w-full border-b border-gray-100 bg-white',
        'min-[600px]:h-[60px]',
        className,
      )}
    >
      <div
        className="
          mx-auto flex h-full w-full max-w-[1200px] items-center
          justify-between px-[16px] min-[600px]:px-[24px]
          min-[1248px]:px-0
        "
      >
        {isAdmin ? (
          <div className="flex min-w-0 items-center gap-[13px] min-[600px]:gap-[24px]">
            <HeaderLogo />
            <AdminNavigation activeAdminNav={activeAdminMenu} />
          </div>
        ) : (
          <HeaderLogo />
        )}

        {headerVariant === 'guest' && (
          <ButtonSecondary
            href="/signin"
            variant="secondary"
            color="black"
            size="md"
            className="
              cursor-pointer min-[600px]:h-[40px]
              min-[600px]:min-w-[90px] min-[600px]:rounded-[12px]
              min-[600px]:text-16-semibold
            "
          >
            로그인
          </ButtonSecondary>
        )}

        {isMember && (
          <div
            ref={actionAreaRef}
            className="relative flex items-center gap-[16px]"
          >
            <button
              type="button"
              aria-label={
                hasUnreadNotifications
                  ? '읽지 않은 챌린지 알림 있음'
                  : '챌린지 알림'
              }
              aria-expanded={isNotificationOpen}
              aria-controls={notificationPanelId}
              onClick={toggleNotificationPanel}
              className="relative flex size-[24px] cursor-pointer items-center justify-center"
            >
              <Image src={IcBell} width={24} height={24} alt="" />

              {hasUnreadNotifications && (
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute right-[1px] top-[1px]
                    size-[6px] rounded-[6px] bg-brand-yellow
                  "
                />
              )}
            </button>

            <ProfileButton
              isAdmin={false}
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
                user={user}
                onLogout={handleLogout}
                isLogoutPending={isLogoutPending}
              />
            )}
          </div>
        )}

        {isAdmin && (
          <div ref={actionAreaRef} className="relative flex items-center">
            <ProfileButton
              isAdmin
              controlsId={profilePanelId}
              isOpen={isProfileOpen}
              onClick={toggleProfilePanel}
            />

            {isProfileOpen && (
              <ProfilePanel
                id={profilePanelId}
                user={user}
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
