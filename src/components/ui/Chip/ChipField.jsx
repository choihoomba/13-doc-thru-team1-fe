import { cn } from '@/utils/cn';

import { CHIP_BASE_STYLE } from './chipStyles';

//분야별 배경 색상

const FIELD_STYLES = {
  NEXTJS: 'bg-[#79E16A]',
  REACT: 'bg-[#D271FF]',
  MODERNJS: 'bg-[#F66E6B]',
  TYPESCRIPT: 'bg-[#FF4288]',
  API: 'bg-[#FF905E]',
  WEB: 'bg-[#F7EA5D]',
  CAREER: 'bg-[#7EB2EE]',
};

const FIELD_LABELS = {
  NEXTJS: 'Next.js',
  REACT: 'React',
  MODERNJS: 'Modern JS',
  TYPESCRIPT: 'TypeScript',
  API: 'API',
  WEB: 'Web',
  CAREER: 'Career',
};

//챌린지 분야를 표시하는 Chip입니다.

export default function ChipField({
  className = '',
  variant = 'WEB',
  ...props
}) {
  const label = FIELD_LABELS[variant] ?? FIELD_LABELS['WEB'];
  const fieldStyle = FIELD_STYLES[variant] ?? FIELD_STYLES['WEB'];

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
