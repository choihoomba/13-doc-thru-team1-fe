'use client';

import Link from 'next/link';

import { cn } from '@/utils/cn';

/**
 * variant + color 조합별 스타일
 * - primary: 배경 채움, 보더 없음
 * - secondary: 배경 없음(흰색), 보더 있음
 */
const VARIANT_COLOR_STYLES = {
  primary: {
    black: 'bg-brand-black text-white',
    red: 'bg-[#FFE7E7] text-red-error',
  },
  secondary: {
    black: 'border border-solid border-brand-black text-brand-black bg-white',
  },
};

/**
 * size별 반응형 스타일
 * - 브레이크포인트: 기본 mobile, tablet 이상 반응형 처리
 */
const SIZE_STYLES = {
  sm: 'h-[32px] min-w-[80px] py-[10px] px-[17px] rounded-[10px] text-14-semibold tablet:h-[40px] tablet:min-w-[90px] tablet:rounded-[12px] tablet:text-16-semibold',
  md: 'h-[40px] min-w-[120px] py-[10px] px-[17px] rounded-[12px] text-16-semibold tablet:min-w-[153px] tablet:h-[48px]',
};

export default function ButtonSecondary({
  className = '',
  as, // button, Link
  href,
  variant = 'primary', // primary(보더 X), secondary(보더 O)
  color = 'black', // black, red
  size = 'sm', // sm, md
  width = 'auto', // auto, 320px(직접 입력)
  type = 'button', // button, submit
  disabled = false,
  onClick,
  children,
  ...props
}) {
  /** as를 명시하지 않았다면: href가 있으면 Link, 없으면 button */
  const Component = as || (href ? Link : 'button');
  const isNativeButton = Component === 'button';

  /** 버튼 클릭 이벤트 핸들러
   * - Link/a 태그일 때 disabled 처리: 클릭 막고 aria-disabled로 접근성 표시
   */
  const handleClick = (e) => {
    if (disabled && !isNativeButton) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <Component
      {...(href ? { href } : {})}
      {...(isNativeButton
        ? { type, disabled }
        : { 'aria-disabled': disabled, tabIndex: disabled ? -1 : undefined })}
      onClick={handleClick}
      className={cn(
        'flex justify-center items-center cursor-pointer disabled:cursor-default disabled:bg-gray-200 disabled:text-gray-500 text-nowrap',

        // variant + color 조합 스타일
        VARIANT_COLOR_STYLES[variant]?.[color],

        /**
         * - Link/a는 disabled 속성이 없어서 CSS의 disabled를 조건부 클래스로 직접 처리
         * - variant/color 클래스 뒤에 와야 twMerge에서 우선 적용됨
         */
        !isNativeButton &&
          disabled &&
          'bg-gray-200 text-gray-500 cursor-default pointer-events-none',

        // size 스타일 (반응형 포함)
        SIZE_STYLES[size],

        className,
      )}
      style={{
        // 타입을 강제할 수 없어서 추가한 방어코드
        width: typeof width === 'number' ? `${width}px` : width,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
