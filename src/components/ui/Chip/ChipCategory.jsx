import { cn } from '@/utils/cn';

import { CHIP_BASE_STYLE } from './chipStyles';

//문서 카테고리를 표시하는 Chip입니다.

//사용 예시:
//<ChipCategory>공식 문서</ChipCategory>
//<ChipCategory>블로그</ChipCategory>

export default function ChipCategory({ className = '', children, ...props }) {
  return (
    <span
      className={cn(
        CHIP_BASE_STYLE,
        'h-[26px] rounded-[8px] border border-gray-300 bg-white px-[7px]',
        'text-13-medium text-gray-600',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
