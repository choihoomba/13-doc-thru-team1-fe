'use client';

import Image from 'next/image';

import IcLikeActiveLg from '@/app/assets/icons/icon_like_active_lg.svg';
import IcLikeActiveSm from '@/app/assets/icons/icon_like_active_sm.svg';
import IcLikeInActiveLg from '@/app/assets/icons/icon_like_inactive_lg.svg';
import IcLikeInActiveSm from '@/app/assets/icons/icon_like_inactive_sm.svg';

import { cn } from '@/utils/cn';

const MAX_COUNT = 9999;

function formatCount(count) {
  if (count > MAX_COUNT) return `${MAX_COUNT.toLocaleString()}...`;
  return count.toLocaleString();
}

const LIKE_ICONS = {
  sm: {
    active: IcLikeActiveSm,
    inactive: IcLikeInActiveSm,
  },
  lg: {
    active: IcLikeActiveLg,
    inactive: IcLikeInActiveLg,
  },
};

export default function ButtonLike({
  size = 'sm',
  count = 0,
  status,
  onClick = () => {},
  disabled = false,
  className = '',
}) {
  const countColorClass = size === 'sm' ? 'text-gray-500' : 'text-gray-800';
  const imageSize = size === 'sm' ? 16 : 24;
  const imageSrc = LIKE_ICONS[size][status];
  const ariaLabel = status === 'active' ? '좋아요 취소' : '좋아요';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'flex items-center justify-center cursor-pointer gap-1 hover:brightness-90 transition-[filter]',
        disabled && 'cursor-default',
        className,
      )}
    >
      <Image
        src={imageSrc}
        alt=""
        width={imageSize}
        height={imageSize}
        unoptimized
      />
      <span className={cn('text-14-medium', countColorClass)}>
        {formatCount(count)}
      </span>
    </button>
  );
}
