import { cn } from '@/utils/cn';

import { CHIP_BASE_STYLE } from './chipStyles';

const DOCTYPE_LABELS = {
  OFFICIAL: '공식문서',
  BLOG: '블로그',
  BOOK: '도서',
  ETC: '기타',
};
//문서 카테고리를 표시하는 Chip입니다.

//사용 예시:
//<ChipCategory variant="OFFICIAL" />
//<ChipCategory variant="BLOG" />

export default function ChipCategory({
  className = '',
  variant = 'ETC',
  ...props
}) {
  const label = DOCTYPE_LABELS[variant] ?? DOCTYPE_LABELS['ETC'];

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
      {label}
    </span>
  );
}
