'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

import NotificationPanel from './NotificationPanel';

const NOTIFICATION_PANEL_ID = 'header-challenge-notifications';

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

function getHeaderVariant({ variant, user, isAuthLoading }) {
  if (variant) return variant;
  if (isAuthLoading) return null;
  if (!user) return 'guest';
  if (user.role === 'ADMIN') return 'admin';

  return 'member';
}

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
        className={cn('h-[18px] w-[80px]', 'tablet:h-[27px] tablet:w-[120px]')}
      />
    </Link>
  );
}

function ProfileLink({ href, variant }) {
  const isAdmin = variant === 'admin';

  return (
    <Link
      href={href}
      aria-label={isAdmin ? '관리자 페이지' : '나의 챌린지'}
      className="flex size-[32px] shrink-0 items-center justify-center"
    >
      <Image
        src={isAdmin ? ImgProfileAdmin : ImgProfileMember}
        width={32}
        height={32}
        alt=""
      />
    </Link>
  );
}

function AdminNavigation({ activeAdminNav }) {
  return (
    <nav
      aria-label="관리자 메뉴"
      className={cn('flex items-center gap-[16px]', 'tablet:gap-[24px]')}
    >
      {ADMIN_NAV_ITEMS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          aria-current={activeAdminNav === item.key ? 'page' : undefined}
          className={cn(
            // Figma의 모바일 13px은 globals.css의 text-13-bold를 재사용합니다.
            'text-13-bold whitespace-nowrap',
            // 데스크톱 15px 토큰은 기초 세팅에 없어 Figma 값만 직접 추가합니다.
            'tablet:text-[15px] tablet:leading-[18px] tablet:font-bold',
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
 */
export default function Header({
  variant,
  activeAdminNav = 'manage',
  logoHref = '/',
  loginHref = '/signin',
  memberProfileHref = '/challenges/mine',
  adminProfileHref = '/admin/manage',
  notifications: providedNotifications,
  onNotificationRead,
  className = '',
}) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const notificationAreaRef = useRef(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Auth 확인 중에는 잘못된 로그인 버튼이 잠깐 보이지 않도록 액션 영역을 비웁니다.
  const resolvedVariant = getHeaderVariant({
    variant,
    user,
    isAuthLoading,
  });

  const shouldRequestNotifications =
    resolvedVariant === 'member' && providedNotifications === undefined;

  const {
    data: requestedNotifications = [],
    isLoading,
    isError,
  } = useChallengeNotifications({
    enabled: shouldRequestNotifications,
  });

  const { mutateAsync: markAsRead } = useMarkNotificationAsRead();

  // API 응답에는 다른 도메인 알림도 있으므로 prop을 사용할 때도 한 번 더 방어합니다.
  const challengeNotifications = (
    providedNotifications ?? requestedNotifications
  ).filter((notification) => notification.targetType === 'CHALLENGE');

  useOutsideClick(notificationAreaRef, () => setIsNotificationOpen(false), {
    enabled: isNotificationOpen,
    detectFocus: true,
    closeOnEscape: true,
  });

  // 모바일 전체 화면 알림이 열린 동안 배경 페이지만 스크롤되지 않게 합니다.
  useEffect(() => {
    if (
      !isNotificationOpen ||
      !window.matchMedia('(max-width: 743px)').matches
    ) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isNotificationOpen]);

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

    setIsNotificationOpen(false);
    router.push(`/challenges/${notification.targetId}`);
  }

  return (
    <header
      className={cn(
        // 현재 Tailwind 빌드에서 globals.css의 z-header 유틸리티가 생성되지 않아
        // 기초 세팅에 정의된 Header 값 80을 그대로 명시합니다.
        'relative z-[80] h-[56px] border-b border-gray-100 bg-white',
        'tablet:h-[60px]',
        className,
      )}
      aria-busy={variant === undefined && isAuthLoading}
    >
      <div
        className={cn(
          'mx-auto flex h-full w-full max-w-[1200px]',
          'items-center justify-between px-[16px]',
          'tablet:px-[24px] min-[1248px]:px-0',
        )}
      >
        {resolvedVariant === 'admin' ? (
          <div
            className={cn(
              'flex min-w-0 items-center gap-[16px]',
              'tablet:gap-[24px]',
            )}
          >
            <HeaderLogo href={logoHref} />
            <AdminNavigation activeAdminNav={activeAdminNav} />
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
          >
            로그인
          </ButtonSecondary>
        )}

        {resolvedVariant === 'member' && (
          <div
            ref={notificationAreaRef}
            className="relative flex items-center gap-[16px]"
          >
            <button
              type="button"
              aria-label="챌린지 알림"
              aria-expanded={isNotificationOpen}
              aria-controls={NOTIFICATION_PANEL_ID}
              onClick={() => setIsNotificationOpen((isOpen) => !isOpen)}
              className="flex size-[24px] items-center justify-center"
            >
              <Image src={IcBell} width={24} height={24} alt="" />
            </button>

            <ProfileLink href={memberProfileHref} variant="member" />

            {isNotificationOpen && (
              <NotificationPanel
                id={NOTIFICATION_PANEL_ID}
                notifications={challengeNotifications}
                isLoading={shouldRequestNotifications ? isLoading : false}
                isError={shouldRequestNotifications ? isError : false}
                onClose={() => setIsNotificationOpen(false)}
                onSelect={handleNotificationSelect}
              />
            )}
          </div>
        )}

        {resolvedVariant === 'admin' && (
          <ProfileLink href={adminProfileHref} variant="admin" />
        )}
      </div>
    </header>
  );
}
