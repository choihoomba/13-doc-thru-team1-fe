import Image from 'next/image';

import IcOut from '@/app/assets/icons/icon_out.svg';

import NotificationItem from './NotificationItem';
import NotificationState from './NotificationState';

/**
 * 모바일에서는 전체 화면, 600px 이상에서는 343×465px 드롭다운으로 표시합니다.
 *
 * 패널 높이는 Figma 규격으로 고정하고 목록만 overflow-y-auto로 스크롤합니다.
 * 스크롤 막대는 숨기지만 휠·트랙패드·터치 동작은 유지하며,
 * overscroll-contain으로 목록 끝에서 배경 페이지로 스크롤이 전달되지 않게 합니다.
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
        min-[600px]:absolute min-[600px]:inset-auto min-[600px]:right-0
        min-[600px]:top-[calc(100%+14px)] min-[600px]:h-[465px]
        min-[600px]:w-[343px] min-[600px]:rounded-[8px]
        min-[600px]:border-2 min-[600px]:border-gray-200
      "
    >
      <div
        className="
          flex h-[56px] shrink-0 items-center justify-between
          border-x-2 border-gray-200 px-[16px]
          min-[600px]:h-[48px] min-[600px]:border-x-0
        "
      >
        <h2 className="text-16-semibold text-gray-800 min-[600px]:text-14-bold">
          알림
        </h2>

        <button
          type="button"
          aria-label="알림 닫기"
          onClick={onClose}
          className="flex size-[24px] cursor-pointer items-center justify-center min-[600px]:hidden"
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
          className="
            min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain
            [scrollbar-width:none] [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {notifications.map((notification, index) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              isFirst={index === 0}
              isLast={index === notifications.length - 1}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
