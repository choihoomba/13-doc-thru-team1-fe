import { cn } from '@/utils/cn';

import { BUTTON_BASE_STYLE } from './buttonStyles';

/** 더보기 버튼 */
export default function ButtonLoadMore({ className = '', onClick, ...props }) {
  return (
    <button
      className={cn(
        BUTTON_BASE_STYLE,
        'w-[180px] h-[48px] rounded-[12px] bg-gray-100 text-16-medium text-gray-500',
        className,
      )}
      type="button"
      onClick={onClick}
      {...props}
    >
      더보기
    </button>
  );
}
