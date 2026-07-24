'use client';

import { useId, useState } from 'react';

import Image from 'next/image';

import IcCalendar from '@/app/assets/icons/icon_calendar.svg';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import {
  FORM_CONTROL_STYLE,
  FORM_END_ICON_STYLE,
  FORM_ERROR_STYLE,
  FORM_GROUP_STYLE,
  FORM_MESSAGE_STYLE,
} from './formStyles';
import Label from './Label';

const CALENDAR_CONTROL_STYLE = [
  'relative',
  'flex',
  'items-center',
  'pr-[56px]',
  'focus-within:border-gray-700',
].join(' ');

const NATIVE_DATE_INPUT_STYLE = [
  'absolute',
  'inset-0',
  'z-10',
  'h-full',
  'w-full',
  'cursor-pointer',
  'opacity-0',
  'disabled:cursor-not-allowed',
].join(' ');

const DISABLED_CALENDAR_STYLE = [
  'cursor-not-allowed',
  'bg-gray-50',
  'text-gray-400',
].join(' ');

/*
@ InputCalendar
- 브라우저 기본 date input을 사용해 별도 날짜 라이브러리를 추가하지 않습니다.
- 화면에는 Figma 형식인 YY/MM/DD로 표시하고 실제 form 값은 YYYY-MM-DD를
  유지하므로 API 요청에 바로 사용할 수 있습니다.
- 날짜 표시는 기초 세팅의 formatDate 유틸을 재사용합니다.
*/
export default function InputCalendar({
  id,
  className = '',
  inputClassName = '',
  label,
  error,
  required = false,
  placeholder = 'YY/MM/DD',
  value,
  defaultValue = '',
  disabled = false,
  onChange,
  ...props
}) {
  // Label, 오류 메시지, date input을 같은 id 기준으로 연결합니다.
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  /*
  @ controlled / uncontrolled 분기
  - value가 있으면 부모 상태를 그대로 사용합니다.
  - value가 없으면 defaultValue를 초기값으로 내부 상태를 관리합니다.
  */
  const [internalValue, setInternalValue] = useState(defaultValue);
  const dateValue = value ?? internalValue;
  const formattedDate = dateValue ? formatDate(`${dateValue}T00:00:00`) : '';

  const handleChange = (event) => {
    // 부모가 value를 관리하지 않을 때만 컴포넌트 내부 값을 변경합니다.
    if (value === undefined) {
      setInternalValue(event.target.value);
    }

    // 부모가 전달한 onChange도 실행해 페이지 상태나 form 로직을 연결합니다.
    onChange?.(event);
  };

  return (
    <div className={cn(FORM_GROUP_STYLE, className)}>
      {label && (
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
      )}

      <div
        className={cn(
          FORM_CONTROL_STYLE,
          CALENDAR_CONTROL_STYLE,
          disabled && DISABLED_CALENDAR_STYLE,
          error && FORM_ERROR_STYLE,
          inputClassName,
        )}
      >
        {/*
          투명한 기본 date input을 영역 전체에 올립니다.
          사용자는 커스텀 UI 어느 곳을 눌러도 브라우저 날짜 선택기를 열 수 있습니다.
        */}
        <input
          id={inputId}
          type="date"
          value={dateValue}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          onChange={handleChange}
          className={NATIVE_DATE_INPUT_STYLE}
          {...props}
        />

        {/* 실제 input은 투명하므로 선택값 또는 placeholder를 별도로 보여줍니다. */}
        <span
          className={cn(
            'text-16-regular',
            dateValue ? 'text-gray-800' : 'text-gray-400',
          )}
          aria-hidden="true"
        >
          {formattedDate || placeholder}
        </span>

        {/* Figma에서 박스를 포함해 내보낸 28px SVG를 Next Image로 표시합니다. */}
        <Image
          className={FORM_END_ICON_STYLE}
          src={IcCalendar}
          alt=""
          width={28}
          height={28}
          unoptimized
        />
      </div>

      {/* 오류 메시지는 필요할 때만 렌더링하고 date input과 연결합니다. */}
      {error && (
        <p id={errorId} className={FORM_MESSAGE_STYLE}>
          {error}
        </p>
      )}
    </div>
  );
}
