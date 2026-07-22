'use client';

import Link from 'next/link';

import { cn } from '@/utils/cn';

import { BUTTON_BASE_STYLE, BUTTON_DISABLED_STYLE } from './buttonStyles';

/**
 * variant + color 조합별 스타일
 * - primary: 배경 채움, 보더 없음
 * - secondary: 배경 없음(흰색), 보더 있음
 * - tertiary: 배경 없음(흰색), 보더 없음, 피드백 취소 버튼만 사용
 */
const VARIANT_COLOR_STYLES = {
  primary: {
    black: 'bg-brand-black text-white',
    red: 'bg-[#FFE7E7] text-red-error',
  },
  secondary: {
    black: 'border border-solid border-brand-black text-brand-black bg-white',
  },
  tertiary: {
    black: 'bg-brand-black text-brand-light', // 임시 스타일
    white: 'bg-white text-gray-500',
  },
};

/**
 * size별 반응형 스타일
 * - 브레이크포인트: 기본 mobile, tablet 이상 반응형 처리
 * - sm 사이즈는 tertiary만 사용
 */
const SIZE_STYLES = {
  sm: 'h-[32px] min-w-[64px] py-[7px] px-[19px] text-14-semibold',
  md: 'h-[32px] min-w-[80px] py-[10px] px-[17px] rounded-[10px] text-14-semibold tablet:h-[40px] tablet:min-w-[90px] tablet:rounded-[12px] tablet:text-16-semibold',
  lg: 'h-[40px] min-w-[120px] py-[10px] px-[17px] rounded-[12px] text-16-semibold tablet:min-w-[153px] tablet:h-[48px]',
};

/** 버튼 스타일 기본 (반응형) */
export default function ButtonSecondary({
  className = '',
  as, // button, Link
  href,
  variant = 'primary', // primary(보더 X), secondary(보더 O)
  color = 'black', // black, red, white
  size = 'md', // sm, md, lg
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
