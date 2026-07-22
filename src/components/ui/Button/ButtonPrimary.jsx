'use client';

import Link from 'next/link';

import { cn } from '@/utils/cn';

import { BUTTON_BASE_STYLE, BUTTON_DISABLED_STYLE } from './buttonStyles';

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

/** 기본 스타일 버튼 */
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
  const Component = as || (href && !disabled ? Link : href ? 'a' : 'button');
  const isNativeButton = Component === 'button';

  /** 버튼 클릭 이벤트 핸들러
   * - Link/a 태그일 때 disabled 처리: 클릭 막고 aria-disabled로 접근성 표시
   */
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <Component
      {...(href && !disabled ? { href } : {})}
      {...(isNativeButton
        ? { type, disabled }
        : {
            role: 'link', // href 없는 커스텀 as 컴포넌트에도 link 역할 명시
            'aria-disabled': disabled, // 스크린 리더에 비활성 상태 전달
            tabIndex: disabled ? -1 : undefined, // disabled면 Tab 포커스 제외
          })}
      onClick={handleClick}
      className={cn(
        BUTTON_BASE_STYLE,

        // variant + color 조합 스타일
        // 활성화 상태일 때만 컬러 스타일 적용 (클래스 충돌 방지)
        !disabled && VARIANT_COLOR_STYLES[variant]?.[color],

        // 공통 disabled 스타일 적용
        disabled && BUTTON_DISABLED_STYLE,

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
