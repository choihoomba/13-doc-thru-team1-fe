'use client';

import { useId, useRef, useState } from 'react';

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
  'cursor-pointer',
  'text-left',
].join(' ');

const NATIVE_DATE_INPUT_STYLE = [
  'absolute',
  'top-0',
  'right-0',
  'h-full',
  'w-[56px]',
  'pointer-events-none',
  'opacity-0',
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
  labelClassName = '',
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
  const triggerId = `${inputId}-trigger`;
  const errorId = error ? `${inputId}-error` : undefined;
  const dateInputRef = useRef(null);

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

  /*
  @ 달력 열기
  - 실제 date input을 아이콘이 있는 우측 영역에 배치해 팝업 기준점도 우측으로 맞춥니다.
  - 버튼 클릭 시 showPicker를 호출하므로 Figma 캘린더 아이콘 자체를 눌러도 열립니다.
  */
  const handleOpenCalendar = () => {
    const dateInput = dateInputRef.current;

    if (!dateInput || disabled) return;

    if (typeof dateInput.showPicker === 'function') {
      dateInput.showPicker();
      return;
    }

    // showPicker를 지원하지 않는 브라우저에서는 기본 input 클릭으로 대체합니다.
    dateInput.click();
  };

  return (
    <div className={cn(FORM_GROUP_STYLE, className)}>
      {label && (
        <Label
          htmlFor={triggerId}
          required={required}
          className={labelClassName}
        >
          {label}
        </Label>
      )}

      <div className="relative">
        <button
          id={triggerId}
          type="button"
          onClick={handleOpenCalendar}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-controls={inputId}
          aria-describedby={errorId}
          className={cn(
            FORM_CONTROL_STYLE,
            CALENDAR_CONTROL_STYLE,
            disabled && DISABLED_CALENDAR_STYLE,
            error && FORM_ERROR_STYLE,
            inputClassName,
          )}
        >
          {/* 선택값 또는 Figma의 YY/MM/DD 안내 문구를 버튼 안에 표시합니다. */}
          <span
            className={cn(
              'text-16-regular',
              dateValue ? 'text-gray-800' : 'text-gray-400',
            )}
          >
            {formattedDate || placeholder}
          </span>

          {/* Figma에서 박스를 포함해 내보낸 28px SVG를 클릭 버튼 안에 배치합니다. */}
          <Image
            className={FORM_END_ICON_STYLE}
            src={IcCalendar}
            alt=""
            width={28}
            height={28}
            unoptimized
          />
        </button>

        {/*
          form 전송과 브라우저 날짜 선택기는 기본 date input이 담당합니다.
          우측 56px에 배치해 showPicker 팝업이 아이콘 쪽을 기준으로 열리게 합니다.
        */}
        <input
          ref={dateInputRef}
          id={inputId}
          type="date"
          value={dateValue}
          required={required}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          onChange={handleChange}
          className={NATIVE_DATE_INPUT_STYLE}
          {...props}
        />
      </div>

      {/* 오류 메시지는 필요할 때만 렌더링하고 달력 버튼과 연결합니다. */}
      {error && (
        <p id={errorId} className={FORM_MESSAGE_STYLE}>
          {error}
        </p>
      )}
    </div>
  );
}
