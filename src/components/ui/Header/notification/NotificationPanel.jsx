import Image from 'next/image';

import IcOut from '@/app/assets/icons/icon_out.svg';

import { cn } from '@/utils/cn';

import NotificationItem from './NotificationItem';
import NotificationState from './NotificationState';

/**
 * Header 알림은 모바일에서 전체 화면, tablet 이상에서는 343×465px 드롭다운으로 표시합니다.
 *
 * 패널 높이는 Figma 규격으로 고정하고 목록만 overflow-y-auto로 스크롤합니다.
 * 스크롤 막대는 5px 너비로 표시하고 overscroll-contain으로 목록 끝에서
 * 배경 페이지로 스크롤이 전달되지 않게 합니다.
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
      className="
        fixed inset-0 z-dropdown flex h-dvh w-full flex-col overflow-hidden bg-white
        tablet:absolute tablet:inset-auto tablet:right-[48px]
        tablet:top-[36px] tablet:h-[465px]
        tablet:w-[343px] tablet:rounded-[8px]
        tablet:border-2 tablet:border-gray-200
      "
    >
      <div
        className="
          flex h-[56px] shrink-0 items-center justify-between
          border-x-2 border-gray-200 px-[16px]
          tablet:h-[48px] tablet:border-x-0
        "
      >
        <h2 className="text-16-semibold text-gray-800 tablet:text-14-bold">
          알림
        </h2>

        <button
          type="button"
          aria-label="알림 닫기"
          onClick={onClose}
          className="flex size-[24px] cursor-pointer items-center justify-center tablet:hidden"
        >
          <Image src={IcOut} width={24} height={24} alt="" />
        </button>
      </div>

      {isLoading && <NotificationState text="알림을 불러오는 중입니다." />}

      {isError && (
        <NotificationState text="알림을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." />
      )}

      {!isLoading && !isError && notifications.length === 0 && (
        <NotificationState text="새로운 챌린지 알림이 없습니다." />
      )}

      {!isLoading && !isError && notifications.length > 0 && (
        <ul
          className={cn(
            'min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain',
            '[&::-webkit-scrollbar]:w-[5px]',
            '[&::-webkit-scrollbar-thumb]:rounded-[7.5px] [&::-webkit-scrollbar-thumb]:bg-gray-200',
            '[&::-webkit-scrollbar-track]:bg-transparent',
            'border-r-[8px] border-white',
          )}
        >
          {notifications.map((notification, index) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              isLast={index === notifications.length - 1}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
