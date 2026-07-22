'use client';

import Link from 'next/link';

import { cn } from '@/utils/cn';

/**
 * variant + color 조합별 스타일
 * - primary: 배경 채움, 보더 없음
 * - secondary: 배경 없음(흰색), 1px 보더
 * - tertiary: 배경 채움, 2px 보더
 */
const VARIANT_COLOR_STYLES = {
  primary: {
    black: 'bg-brand-black text-white',
    gray: 'bg-gray-200 text-black', // (임시 스타일) 실제 디자인 없음
    yellow: 'bg-brand-yellow text-black', // (임시 스타일) 실제 디자인 없음
  },
  secondary: {
    black: 'border border-solid border-brand-black text-brand-black bg-white',
    gray: 'border border-solid border-gray-200 text-black bg-white',
  },
  tertiary: {
    yellow:
      'border-2 border-solid border-brand-black text-brand-black bg-brand-yellow',
  },
};

/**
 * size별 스타일
 */
const SIZE_STYLES = {
  sm: 'h-[32px] min-w-[80px] py-[7px] px-[13.5px] rounded-[10px] text-14-semibold',
  md: 'h-[40px] min-w-[90px] py-[7px] px-[37px] rounded-[12px] text-14-bold',
  lg: 'h-[40px] min-w-[90px] px-[24px] rounded-[12px] text-16-semibold',
  xl: 'h-[48px] min-w-[90px] px-[24px] rounded-[8px] text-16-semibold',
  xxl: 'h-[48px] min-w-[90px] px-[24px] rounded-[12px] text-16-semibold',
  xxxl: 'h-[48px] min-w-[90px] px-[24px] rounded-[12px] text-16-regular',
};

export default function ButtonPrimary({
  className = '',
  as, // button, Link
  href,
  variant = 'primary', // primary(배경 O, 보더 X), secondary(배경 X, 보더 1px), tertiary(배경 O, 보더 2px)
  color = 'black', // black, gray, yellow
  size = 'xxl', // sm, md, lg, xl, xxl, xxxl
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

        // size 스타일
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
