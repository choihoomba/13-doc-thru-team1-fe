'use client';

/*
목록 렌더링 자체는 정적이지만, Figma 스크롤 막대를 실제 스크롤 위치와
동기화하기 위해 useRef/useEffect와 ResizeObserver를 사용합니다.
따라서 이 파일도 Header의 Client Component 경계 안에서 실행합니다.
*/
import { useCallback, useEffect, useRef } from 'react';

import Image from 'next/image';

import IcOut from '@/app/assets/icons/icon_out.svg';

import { cn } from '@/utils/cn';

import {
  NOTIFICATION_CLOSE_BUTTON_STYLE,
  NOTIFICATION_ITEM_STYLE,
  NOTIFICATION_LIST_STYLE,
  NOTIFICATION_PANEL_STYLE,
  NOTIFICATION_TITLE_TEXT_STYLE,
  NOTIFICATION_TITLE_STYLE,
} from './headerStyles';

/**
 * 알림 날짜를 Figma 표기인 YYYY.MM.DD 형식으로 변환합니다.
 *
 * 프로젝트 공용 formatDate는 YY/MM/DD 형식을 사용하는 다른 화면이 있으므로
 * 기존 공용 유틸을 변경하지 않고 Header 내부에서 필요한 표현만 처리합니다.
 *
 * @param {Date | string | number} date
 * @returns {string}
 */
function formatNotificationDate(date) {
  if (!date) return '';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '';

  const year = String(parsedDate.getFullYear());
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}

/**
 * 로딩·오류·빈 목록 메시지의 공통 배치입니다.
 *
 * 세 상태가 같은 중앙 정렬과 타이포그래피를 사용하므로 반복 JSX를 분리했습니다.
 * children에는 상태별 안내 문장만 전달합니다.
 *
 * @param {React.ReactNode} children - 사용자에게 보여줄 상태 안내
 */
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
 * - compact(599px 이하): Figma의 모바일처럼 전체 화면으로 표시합니다.
 * - standard(600px 이상): Header 오른쪽에 343×465 드롭다운으로 표시합니다.
 * - 첫 알림은 긴 안내 문장을 위해 343×100, 이후 알림은 343×75 규격입니다.
 * - 마지막 알림은 아래 구분선을 제거해 Figma 목록 끝과 동일하게 표시합니다.
 *
 * @param {string} id - Header 알림 버튼의 aria-controls와 연결되는 패널 id
 * @param {Array<object>} notifications - CHALLENGE 유형으로 정리된 알림 목록
 * @param {boolean} isLoading - Notification API 요청 중 상태
 * @param {boolean} isError - Notification API 실패 상태
 * @param {() => void} onClose - 모바일 X, 외부 클릭, Escape에서 호출할 닫기 함수
 * @param {(notification: object) => void} onSelect - 알림 선택/이동 처리 함수
 */
export default function NotificationPanel({
  id,
  notifications,
  isLoading,
  isError,
  onClose,
  onSelect,
}) {
  const notificationListRef = useRef(null);
  const scrollbarThumbRef = useRef(null);

  /*
   * 운영체제의 '스크롤 막대 자동 숨김' 설정과 무관하게 Figma의 회색 막대를 표시합니다.
   *
   * 실제 스크롤은 ul이 담당하고, 이 함수는 ul의 현재 스크롤 비율을 읽어
   * 오른쪽 표시 막대의 높이와 위치만 동기화합니다.
   * 목록이 아직 넘치지 않을 때도 시안 확인을 위해 120px 막대를 유지합니다.
   */
  const syncScrollbarThumb = useCallback(() => {
    const list = notificationListRef.current;
    const thumb = scrollbarThumbRef.current;

    if (!list || !thumb) return;

    const trackHeight = Math.max(list.clientHeight - 24, 0);
    const hasOverflow = list.scrollHeight > list.clientHeight;
    const thumbHeight = hasOverflow
      ? Math.max(40, (list.clientHeight / list.scrollHeight) * trackHeight)
      : Math.min(120, trackHeight);
    const maximumThumbTop = Math.max(trackHeight - thumbHeight, 0);
    const maximumScrollTop = Math.max(list.scrollHeight - list.clientHeight, 0);
    const thumbTop =
      maximumScrollTop > 0
        ? (list.scrollTop / maximumScrollTop) * maximumThumbTop
        : 0;

    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translateY(${thumbTop}px)`;
  }, []);

  /*
   * 반응형 전환이나 알림 개수 변경으로 목록 높이가 달라질 때 막대 크기를 다시 계산합니다.
   * ResizeObserver는 Header 밖의 전역 CSS를 수정하지 않고 해당 목록만 관찰합니다.
   */
  useEffect(() => {
    syncScrollbarThumb();

    const list = notificationListRef.current;

    if (!list) return undefined;

    const resizeObserver = new ResizeObserver(syncScrollbarThumb);
    resizeObserver.observe(list);

    return () => resizeObserver.disconnect();
  }, [notifications, syncScrollbarThumb]);

  return (
    <section
      id={id}
      aria-label="챌린지 알림"
      className={NOTIFICATION_PANEL_STYLE}
    >
      <div className={NOTIFICATION_TITLE_STYLE}>
        <h2 className={NOTIFICATION_TITLE_TEXT_STYLE}>알림</h2>

        <button
          type="button"
          aria-label="알림 닫기"
          onClick={onClose}
          className={NOTIFICATION_CLOSE_BUTTON_STYLE}
        >
          {/* 디자이너가 지정한 24×24 아이콘 박스를 포함한 SVG를 그대로 렌더링합니다. */}
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
        <div className="relative min-h-0 flex-1">
          <ul
            ref={notificationListRef}
            className={NOTIFICATION_LIST_STYLE}
            onScroll={syncScrollbarThumb}
          >
            {notifications.map((notification, index) => (
              <li key={notification.id}>
                <button
                  type="button"
                  onClick={() => onSelect(notification)}
                  className={cn(
                    NOTIFICATION_ITEM_STYLE,
                    /*
                     * Figma 개발자 모드에서 확인한 첫 알림 내부 규격입니다.
                     * 14px 본문 3줄(51px) + 간격 8px + 14px 날짜(17px) = 76px이며,
                     * 상하 padding 12px을 더하면 첫 알림 전체 높이는 정확히 100px입니다.
                     * 이후 알림은 Figma 명세의 75px 높이와 17px 간격을 사용합니다.
                     */
                    index === 0 ? 'h-[100px] gap-[8px]' : 'h-[75px] gap-[17px]',
                    // 마지막 알림 아래에는 Figma에 없는 구분선을 만들지 않습니다.
                    index === notifications.length - 1 && 'border-b-0',
                  )}
                >
                  <span
                    className={cn(
                      'text-14-regular text-gray-800',
                      index === 0 ? 'line-clamp-3' : 'line-clamp-2',
                    )}
                  >
                    {notification.message}
                  </span>
                  <span className="text-14-regular text-gray-400">
                    {/* 공용 날짜 유틸을 바꾸지 않고 Header 전용 형식으로 표시합니다. */}
                    {formatNotificationDate(notification.createdAt)}
                  </span>
                  {!notification.isRead && (
                    // 시각적 굵기만으로 구별하기 어려운 사용자를 위한 읽음 상태입니다.
                    <span className="sr-only">읽지 않은 알림</span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/*
           * Windows와 macOS가 네이티브 스크롤 막대를 숨겨도 시안의 막대는 항상 보입니다.
           * pointer-events-none이므로 휠·터치·목록 버튼 클릭을 방해하지 않습니다.
           */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[12px] right-[4px] bottom-[12px] w-[4px]"
          >
            <span
              ref={scrollbarThumbRef}
              className="block w-full rounded-full bg-gray-200"
              /*
               * 초기 120px은 Figma의 기본 표시 크기입니다.
               * 이후 높이와 이동 위치는 목록 크기·스크롤 비율에 따라 매번 달라져
               * 고정 Tailwind 클래스 대신 syncScrollbarThumb가 inline style을 갱신합니다.
               */
              style={{ height: '120px' }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
