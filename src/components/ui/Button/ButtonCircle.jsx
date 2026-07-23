import Image from 'next/image';

import IcArrowRight from '@/app/assets/icons/btn_circle_arrow_right.svg';
import IcArrowDown from '@/app/assets/icons/icon_circle_arrow_down.svg';
import IcArrowDownBlack from '@/app/assets/icons/icon_circle_arrow_down_black.svg';

import { cn } from '@/utils/cn';

import { BUTTON_BASE_STYLE } from '@/components/ui/Button/buttonStyles';

// variant별 기본 접근성 라벨
const DEFAULT_ARIA_LABEL = {
  primary: '아래로',
  secondary: '다음',
};

/** 원형 버튼 */
export default function ButtonCircle({
  className = '',
  variant = 'primary', // primary(아래쪽 화살표), secondary(오른쪽 화살표)
  onClick,
  disabled = false,
  'aria-label': ariaLabel,
  ...props
}) {
  return (
    <button
      className={cn(BUTTON_BASE_STYLE, disabled && 'cursor-default', className)}
      type="button"
      aria-label={ariaLabel ?? DEFAULT_ARIA_LABEL[variant]}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {variant === 'primary' ? (
        <Image
          className="w-[32px] tablet:w-[40px]"
          src={disabled ? IcArrowDown : IcArrowDownBlack}
          alt=""
          width={32}
          height={32}
          sizes="(max-width: 744px) 32px, 40px"
          unoptimized
        />
      ) : (
        <Image
          className="w-[24px] tablet:w-[40px]"
          src={IcArrowRight}
          alt=""
          width={24}
          height={24}
          sizes="(max-width: 744px) 24px, 40px"
          unoptimized
        />
      )}
    </button>
  );
}
