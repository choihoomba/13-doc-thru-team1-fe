import Image from 'next/image';
import Link from 'next/link';

import IcArrowRight from '@/app/assets/icons/icon_arrow_right.svg';
import IcDocument from '@/app/assets/icons/icon_document.svg';

import { cn } from '@/utils/cn';

import { BUTTON_BASE_STYLE } from '@/components/ui/Button/buttonStyles';

/** 도전 계속하기 / 내 작업물 보기 버튼 */
export default function ButtonChallenge({
  className = '',
  variant = 'challenge', // challenge(도전 계속하기), submission(내 작업물 보기)
  href,
  ...props
}) {
  const icon = { challenge: IcArrowRight, submission: IcDocument }[variant];

  return (
    <Link
      className={cn(
        BUTTON_BASE_STYLE,
        'gap-[6px] w-[132px] h-[33px] rounded-[30.5px] text-14-bold text-gray-800',

        {
          'border border-gray-800 bg-white': variant === 'challenge',
          'bg-gray-50': variant === 'submission',
        },

        className,
      )}
      href={href}
      {...props}
    >
      {variant === 'challenge' ? '도전 계속하기' : '내 작업물 보기'}
      <Image src={icon} alt="" width={24} height={24} unoptimized />
    </Link>
  );
}
