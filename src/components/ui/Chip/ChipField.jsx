import { cn } from '@/utils/cn';

import { CHIP_BASE_STYLE } from './chipStyles';

//분야별 배경 색상

const FIELD_STYLES = {
  NEXTJS: 'bg-[#79E16A]',
  API: 'bg-[#FF905E]',
  CAREER: 'bg-[#7EB2EE]',
  MODERNJS: 'bg-[#F66E6B]',
  WEB: 'bg-[#F7EA5D]',
};

const FIELD_LABELS = {
  NEXTJS: 'Next.js',
  API: 'API',
  CAREER: 'Career',
  MODERNJS: 'Modern JS',
  WEB: 'Web',
};

//챌린지 분야를 표시하는 Chip입니다.

//사용 예시:
// <ChipField variant="NEXTJS" />
//<ChipField variant="API" />

export default function ChipField({
  className = '',
  variant = 'NEXTJS',
  children,
  ...props
}) {
  const label = children ?? FIELD_LABELS[variant] ?? variant;
  const fieldStyle = FIELD_STYLES[variant] ?? 'bg-gray-200';

  return (
    <span
      className={cn(
        CHIP_BASE_STYLE,
        'h-[26px] rounded-[8px] px-[12px]',
        'text-14-bold text-gray-600',
        fieldStyle,
        className,
      )}
      {...props}
    >
      {label}
    </span>
  );
}
