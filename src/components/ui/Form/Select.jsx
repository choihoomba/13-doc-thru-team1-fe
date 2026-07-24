'use client';

import { useId, useState } from 'react';

import Image from 'next/image';

import IcChevronDown from '@/app/assets/icons/icon_chevron_down.svg';

import { cn } from '@/utils/cn';

import {
  FORM_CONTROL_STYLE,
  FORM_END_ICON_STYLE,
  FORM_ERROR_STYLE,
  FORM_GROUP_STYLE,
  FORM_MESSAGE_STYLE,
} from './formStyles';
import Label from './Label';

const SELECT_CONTROL_STYLE = [
  'h-[56px]',
  'cursor-pointer',
  'appearance-none',
  'pr-[52px]',
  'disabled:cursor-not-allowed',
].join(' ');

/*
@ option 데이터 정리
- 문자열은 value와 화면 문구로 동일하게 사용합니다.
- 객체는 API에 보낼 value와 사용자에게 보여줄 label을 나눠 사용할 수 있습니다.
*/
function getOptionData(option) {
  if (typeof option === 'string') {
    return {
      optionValue: option,
      optionLabel: option,
    };
  }

  return {
    optionValue: option.value ?? option.label,
    optionLabel: option.label ?? option.value,
  };
}

/*
@ Select
- Figma의 닫힌 Select 규격인 56px 높이와 우측 화살표를 적용합니다.
- 기본 HTML select를 유지해 키보드 조작과 모바일의 기본 선택 UI를 사용합니다.
- options는 단순 문자열과 { value, label } 객체를 모두 받을 수 있습니다.
- 선택 전 안내 문구는 gray-400, 실제 선택값은 gray-800로 구분합니다.
*/
export default function Select({
  id,
  className = '',
  selectClassName = '',
  label,
  error,
  required = false,
  placeholder = '선택해 주세요',
  options = [],
  value,
  defaultValue = '',
  onChange,
  ...props
}) {
  // Label, 오류 메시지, select를 같은 id 기준으로 연결합니다.
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = error ? `${selectId}-error` : undefined;

  /*
  @ controlled / uncontrolled 분기
  - value가 있으면 부모 상태를 그대로 사용합니다.
  - value가 없으면 defaultValue를 초기값으로 내부 상태를 관리합니다.
  - 현재 값을 알아야 Figma의 placeholder 색상을 선택값과 구분할 수 있습니다.
  */
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = value ?? internalValue;

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
        <Label htmlFor={selectId} required={required}>
          {label}
        </Label>
      )}

      <div className="relative">
        <select
          id={selectId}
          value={selectedValue}
          onChange={handleChange}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            FORM_CONTROL_STYLE,
            SELECT_CONTROL_STYLE,
            selectedValue ? 'text-gray-800' : 'text-gray-400',
            error && FORM_ERROR_STYLE,
            selectClassName,
          )}
          {...props}
        >
          {/* 빈 값은 안내 문구로만 사용하며 실제 선택 항목에서는 비활성화합니다. */}
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((option) => {
            // 페이지에 따라 문자열 또는 value/label 객체를 사용할 수 있습니다.
            const { optionValue, optionLabel } = getOptionData(option);

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>

        {/*
          기본 화살표를 숨기고 Figma에서 박스를 포함해 내보낸 24px SVG를
          Next Image로 표시합니다.
        */}
        <Image
          className={FORM_END_ICON_STYLE}
          src={IcChevronDown}
          alt=""
          width={24}
          height={24}
          unoptimized
        />
      </div>

      {/* 오류 메시지는 필요할 때만 렌더링하고 select와 연결합니다. */}
      {error && (
        <p id={errorId} className={FORM_MESSAGE_STYLE}>
          {error}
        </p>
      )}
    </div>
  );
}
