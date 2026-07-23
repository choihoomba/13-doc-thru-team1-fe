import Image from 'next/image';

import IcQuit from '@/app/assets/icons/icon_quit.svg';
import IcQuitGray from '@/app/assets/icons/icon_quit_gray.svg';

import { cn } from '@/utils/cn';

import { BUTTON_BASE_STYLE, BUTTON_DISABLED_STYLE } from './buttonStyles';

/** 포기 버튼 */
export default function ButtonQuit({
  className = '',
  onClick,
  disabled = false,
  ...props
}) {
  return (
    <button
      className={cn(
        BUTTON_BASE_STYLE,
        'h-[32px] gap-[5px] py-[8px] px-[10px] rounded-[10px] bg-[#FFE7E7] text-16-semibold text-[#F24744] tablet:h-[40px] tablet:px-[12px]',
        disabled && BUTTON_DISABLED_STYLE,
        className,
      )}
      type="button"
      aria-label="포기"
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <span className={cn('hidden tablet:block')}>포기</span>
      <Image
        className="w-[16px] tablet:w-[24px]"
        src={disabled ? IcQuitGray : IcQuit}
        alt=""
        width={16}
        height={16}
        sizes="(max-width: 744px) 16px, 24px"
        unoptimized
      />
    </button>
  );
}
