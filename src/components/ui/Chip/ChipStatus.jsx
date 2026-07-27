import { cn } from '@/utils/cn';

import { CHIP_BASE_STYLE } from './chipStyles';

const STATUS_STYLES = {
  PENDING: 'bg-[#FFFDE7] text-[#F2BC00]',
  REJECTED: 'bg-[#FFF0F0] text-[#E54946]',
  APPROVED: 'bg-[#DFF0FF] text-[#4095DE]',
  DELETED: 'bg-gray-200 text-gray-500',
};

const STATUS_LABELS = {
  PENDING: '승인 대기',
  REJECTED: '신청 거절',
  APPROVED: '신청 승인',
  DELETED: '챌린지 삭제',
};

//챌린지 신청 상태를 표시하는 Chip입니다.

//사용 예시:
//<ChipStatus status="PENDING" />
//<ChipStatus status="REJECTED" />

export default function ChipStatus({
  className = '',
  status = 'PENDING',
  children,
  ...props
}) {
  const label = children ?? STATUS_LABELS[status] ?? status;
  const statusStyle = STATUS_STYLES[status] ?? 'bg-gray-200 text-gray-500';

  return (
    <span
      className={cn(
        CHIP_BASE_STYLE,
        'h-[24px] rounded-[4px] px-[8px]',
        'text-13-semibold text-gray-800',
        statusStyle,
        className,
      )}
      {...props}
    >
      {label}
    </span>
  );
}
