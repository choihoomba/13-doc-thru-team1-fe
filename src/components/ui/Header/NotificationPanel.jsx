import Image from 'next/image';

import IcOut from '@/app/assets/icons/icon_out.svg';

import { cn } from '@/utils/cn';

import { formatNotificationDate } from './headerUtils';

function NotificationState({ children }) {
  return (
    <div
      className={cn(
        'flex flex-1 items-center justify-center',
        'px-[24px] text-center text-14-regular text-gray-500',
      )}
    >
      {children}
    </div>
  );
}

/**
 * 알림 패널
 *
 * - 모바일: Figma의 375×812 화면을 따라 전체 화면으로 표시합니다.
 * - iPad mini/데스크톱: Header 오른쪽에 343×465 드롭다운으로 표시합니다.
 * - 알림 한 행은 Figma에서 확인한 343×76, padding 12×16 규격입니다.
 */
export default function NotificationPanel({
  id,
  notifications,
  isLoading,
  isError,
  onClose,
  onSelect,
}) {
  return (
    <section
      id={id}
      aria-label="챌린지 알림"
      className={cn(
        // globals.css의 dropdown 기준값 70을 실제 생성되는 arbitrary 값으로 사용합니다.
        'fixed inset-0 z-[70] flex h-dvh w-full flex-col bg-white',
        'tablet:absolute tablet:inset-auto',
        'tablet:right-0 tablet:top-[calc(100%+14px)]',
        'tablet:h-[465px] tablet:w-[343px]',
        'tablet:overflow-hidden tablet:rounded-[4px]',
        'tablet:border-t tablet:border-gray-200',
        'tablet:shadow-[0_4px_12px_rgba(0,0,0,0.08)]',
      )}
    >
      <div
        className={cn(
          'flex h-[56px] shrink-0 items-center justify-between',
          'border-x-2 border-b border-gray-200 px-[16px]',
          'tablet:h-[48px]',
        )}
      >
        <h2 className="text-14-bold text-gray-800">알림</h2>

        <button
          type="button"
          aria-label="알림 닫기"
          onClick={onClose}
          className="flex size-[24px] items-center justify-center tablet:hidden"
        >
          <Image src={IcOut} width={24} height={24} alt="" />
        </button>
      </div>

      {isLoading && (
        <NotificationState>알림을 불러오는 중입니다.</NotificationState>
      )}

      {isError && (
        <NotificationState>
          알림을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </NotificationState>
      )}

      {!isLoading && !isError && notifications.length === 0 && (
        <NotificationState>새로운 챌린지 알림이 없습니다.</NotificationState>
      )}

      {!isLoading && !isError && notifications.length > 0 && (
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <button
                type="button"
                onClick={() => onSelect(notification)}
                className={cn(
                  'flex h-[76px] w-full flex-col justify-between',
                  'border-x-2 border-b border-gray-200',
                  'bg-white px-[16px] py-[12px] text-left',
                  'transition-colors hover:bg-gray-50',
                  'focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
                  'focus-visible:outline-brand-yellow',
                )}
              >
                <span
                  className={cn(
                    'line-clamp-2 text-12-regular text-gray-800',
                    !notification.isRead && 'font-medium',
                  )}
                >
                  {notification.message}
                </span>
                <span className="text-12-regular text-gray-400">
                  {formatNotificationDate(notification.createdAt)}
                </span>
                {!notification.isRead && (
                  <span className="sr-only">읽지 않은 알림</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
