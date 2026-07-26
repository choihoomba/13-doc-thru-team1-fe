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
  FORM_INPUT_BASE_STYLE,
  FORM_INPUT_RADIUS_STYLE,
  FORM_MESSAGE_STYLE,
} from './formStyles';
import Label from './Label';

/*
@ 클릭 가능한 우측 아이콘 버튼

- 비밀번호 보기/숨기기 아이콘처럼 실제 클릭 동작이 필요한 경우에 사용합니다.
- InputBase의 우측 padding 20px과 맞추기 위해 right-[20px]을 사용합니다.
- size-[24px]은 Figma에서 제공된 아이콘 박스 크기입니다.
*/
const ICON_BUTTON_STYLE = [
  'absolute',
  'top-1/2',
  'right-[20px]',
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

사용 범위:
- 제목
- 원문 링크
- 최대 인원
- 이메일
- 비밀번호
- 일반 text, url, number 입력

공통 컴포넌트 안에는 페이지별 문구나 필드명을 고정하지 않습니다.
label과 placeholder는 사용하는 페이지에서 props로 전달하므로,
신규 챌린지 페이지와 로그인/회원가입 페이지가 같은 컴포넌트를 사용해도
각 페이지에서 전달한 텍스트만 표시됩니다.

Figma에서 제목/원문 링크와 최대 인원의 radius가 다르게 확인되어
borderRadius prop으로 12px 또는 8px을 선택할 수 있도록 확장했습니다.
기본값은 기존 사용처에 영향을 주지 않도록 12px입니다.
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
  borderRadius = 12,
  endIcon,
  endIconAlt = '',
  onEndIconClick,
  ...props
}) {
  /*
  @ id 생성

  - 사용하는 쪽에서 id를 전달하면 해당 값을 사용합니다.
  - id가 없으면 React의 useId로 고유 id를 생성합니다.
  - Label의 htmlFor와 input의 id를 연결해 라벨을 클릭해도 input에 focus가 이동합니다.
  */
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  /*
  @ InputBase radius 결정

  - borderRadius={12}: 제목, 원문 링크 등 기본 InputBase
  - borderRadius={8}: 신규 챌린지의 최대 인원 InputBase

  지원하지 않는 값이 들어오면 기본 12px을 사용해 스타일 누락을 방지합니다.
  */
  const radiusStyle =
    FORM_INPUT_RADIUS_STYLE[borderRadius] ?? FORM_INPUT_RADIUS_STYLE[12];

  /*
  @ 비밀번호 표시 상태

  - type="password"일 때만 내부 state를 사용합니다.
  - 일반 text, url, number input에는 영향을 주지 않습니다.
  */
  const isPassword = type === 'password';
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  /*
  @ 우측 아이콘 클릭 처리

  - 비밀번호 input이면 password와 text를 전환합니다.
  - 페이지에서 별도 onEndIconClick을 전달한 경우 해당 함수도 함께 실행합니다.
  */
  const handleIconClick = (event) => {
    if (isPassword) {
      setIsPasswordVisible((isVisible) => !isVisible);
    }

    onEndIconClick?.(event);
  };

  /*
  @ 표시할 아이콘과 input type 결정

  - 비밀번호가 보이는 상태면 visibility_on 아이콘을 사용합니다.
  - 비밀번호가 숨겨진 상태면 visibility_off 아이콘을 사용합니다.
  - 일반 input은 전달받은 endIcon을 사용합니다.
  */
  const passwordIcon = isPasswordVisible ? IcVisibilityOn : IcVisibilityOff;
  const icon = isPassword ? passwordIcon : endIcon;
  const isIconButton = isPassword || Boolean(onEndIconClick);
  const inputType = isPassword && isPasswordVisible ? 'text' : type;

  /*
  @ 접근성용 아이콘 이름

  이미지 자체의 alt는 비워 장식 요소로 처리하고,
  클릭 가능한 버튼에는 aria-label로 기능을 설명합니다.
  */
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

      {/*
        input과 우측 아이콘을 겹쳐 배치하기 위해 relative 부모를 사용합니다.
        아이콘은 absolute로 input 오른쪽 중앙에 배치됩니다.
      */}
      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            // 모든 Form 입력이 공유하는 border, 텍스트, focus, disabled 상태
            FORM_CONTROL_STYLE,

            // InputBase 전용 높이 48px, padding 11px 20px, gray-200 border
            FORM_INPUT_BASE_STYLE,

            // 사용하는 위치의 Figma에 맞춰 12px 또는 8px radius를 적용합니다.
            radiusStyle,

            // 24px 아이콘과 텍스트가 겹치지 않도록 우측 공간을 확보합니다.
            icon && 'pr-[54px]',

            // 오류가 있을 때 gray border 대신 error 색상을 적용합니다.
            error && FORM_ERROR_STYLE,

            // 특정 페이지에서 추가 스타일이 필요하면 마지막에 덮어쓸 수 있습니다.
            inputClassName,
          )}
          {...props}
        />

        {icon &&
          (isIconButton ? (
            /*
            클릭 동작이 있는 아이콘은 button으로 렌더링합니다.
            type="button"을 지정해 form submit이 발생하지 않도록 합니다.
            */
            <button
              type="button"
              className={ICON_BUTTON_STYLE}
              onClick={handleIconClick}
              aria-label={iconAriaLabel}
              disabled={disabled}
            >
              <Image src={icon} alt="" width={24} height={24} unoptimized />
            </button>
          ) : (
            /*
            클릭 동작이 없는 아이콘은 장식용 Image로 렌더링합니다.
            FORM_END_ICON_STYLE의 pointer-events-none으로 입력 조작을 방해하지 않습니다.
            */
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

      {/*
        오류 메시지가 있을 때만 렌더링합니다.
        aria-describedby로 input과 연결해 스크린 리더에서도 오류 내용을 확인할 수 있습니다.
      */}
      {error && (
        <p id={errorId} className={FORM_MESSAGE_STYLE}>
          {error}
        </p>
      )}
    </div>
  );
}
