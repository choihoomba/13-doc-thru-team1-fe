import { cn } from '@/utils/cn';

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
 * Header의 첫 번째 알림은 긴 메시지를 위해 100px, 이후 알림은 75px을 사용합니다.
 * 날짜 형식은 공용 formatDate의 다른 사용처에 영향을 주지 않도록 이 컴포넌트에서 변환합니다.
 */
export default function NotificationItem({ notification, isLast, onSelect }) {
  return (
    <li>
      <button
        type="button"
        aria-label={`${notification.isRead ? '읽은 알림' : '읽지 않은 알림'}: ${notification.message}`}
        onClick={() => onSelect(notification)}
        className={cn(
          'flex min-h-[75px] w-full cursor-pointer flex-col items-start justify-between gap-[8px]',
          'border-b border-gray-200',
          'bg-white px-[16px] py-[12px] text-left transition-colors hover:bg-gray-50',
          'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-yellow',
          isLast && 'border-b-0',
        )}
      >
        <span
          className={cn(
            'line-clamp-3 text-14-regular transition-colors',
            notification.isRead ? 'text-gray-400' : 'text-gray-800',
          )}
        >
          {notification.message}
        </span>

        <span className="shrink-0 text-14-regular text-gray-400">
          {formatNotificationDate(notification.createdAt)}
        </span>
      </button>
    </li>
  );
}
