'use client';

import { useId, useState } from 'react';

import Image from 'next/image';

import IcVisibilityOff from '@/app/assets/icons/icon_visibility_off.svg';
import IcVisibilityOn from '@/app/assets/icons/icon_visibility_on.svg';

import { cn } from '@/utils/cn';

import {
  FORM_CONTROL_STYLE,
  FORM_END_ICON_STYLE,
  FORM_ERROR_STYLE,
  FORM_GROUP_STYLE,
  FORM_MESSAGE_STYLE,
} from './formStyles';
import Label from './Label';

const ICON_BUTTON_STYLE = [
  'absolute',
  'top-1/2',
  'right-[16px]',
  'flex',
  'size-[24px]',
  'cursor-pointer',
  '-translate-y-1/2',
  'items-center',
  'justify-center',
  'disabled:cursor-not-allowed',
].join(' ');

/*
@ InputBase
- text, url, number, password 등 기본 HTML input 타입을 props로 재사용합니다.
- label, error, required 상태를 한 컴포넌트에서 동일한 규격으로 제공합니다.
- password 타입은 Figma의 보기 아이콘을 버튼으로 사용하고, 그 외 endIcon은
  클릭 함수가 있을 때만 버튼으로 렌더링합니다.
*/
export default function InputBase({
  id,
  className = '',
  inputClassName = '',
  labelClassName = '',
  label,
  error,
  required = false,
  disabled = false,
  type = 'text',
  endIcon,
  endIconAlt = '',
  onEndIconClick,
  ...props
}) {
  // id가 없어도 Label과 input을 연결할 수 있는 고유 id를 만듭니다.
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  // password 타입일 때만 내부 상태로 표시/숨김을 전환합니다.
  const isPassword = type === 'password';
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  /*
  @ 우측 아이콘 클릭
  - password는 input type을 password와 text 사이에서 전환합니다.
  - 사용하는 페이지에서 별도 클릭 동작을 넘긴 경우 그 함수도 함께 실행합니다.
  */
  const handleIconClick = (event) => {
    if (isPassword) {
      setIsPasswordVisible((isVisible) => !isVisible);
    }

    onEndIconClick?.(event);
  };

  // 비밀번호가 보이는 상태에서는 Figma의 visibility_on 아이콘으로 전환합니다.
  const passwordIcon = isPasswordVisible ? IcVisibilityOn : IcVisibilityOff;
  const icon = isPassword ? passwordIcon : endIcon;
  const isIconButton = isPassword || Boolean(onEndIconClick);
  const inputType = isPassword && isPasswordVisible ? 'text' : type;
  let iconAriaLabel = endIconAlt;

  if (isPassword) {
    iconAriaLabel = isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기';
  }

  return (
    <div className={cn(FORM_GROUP_STYLE, className)}>
      {label && (
        <Label htmlFor={inputId} required={required} className={labelClassName}>
          {label}
        </Label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            FORM_CONTROL_STYLE,
            // 아이콘과 입력 텍스트가 겹치지 않도록 우측 공간을 확보합니다.
            icon && 'pr-[52px]',
            error && FORM_ERROR_STYLE,
            inputClassName,
          )}
          {...props}
        />

        {icon &&
          (isIconButton ? (
            <button
              type="button"
              className={ICON_BUTTON_STYLE}
              onClick={handleIconClick}
              aria-label={iconAriaLabel}
              disabled={disabled}
            >
              {/*
                Figma에서 받은 24px 아이콘 박스를 그대로 사용합니다.
                버튼 이름은 aria-label로 제공하므로 이미지 자체는 장식 처리합니다.
              */}
              <Image src={icon} alt="" width={24} height={24} unoptimized />
            </button>
          ) : (
            <Image
              className={FORM_END_ICON_STYLE}
              src={icon}
              alt={endIconAlt}
              width={24}
              height={24}
              unoptimized
            />
          ))}
      </div>

      {/* 오류가 있을 때만 메시지를 만들고 aria-describedby로 input과 연결합니다. */}
      {error && (
        <p id={errorId} className={FORM_MESSAGE_STYLE}>
          {error}
        </p>
      )}
    </div>
  );
}
