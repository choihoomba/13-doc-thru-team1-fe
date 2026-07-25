'use client';

import { useId, useRef, useState } from 'react';

import Image from 'next/image';

import IcChevronDown from '@/app/assets/icons/icon_chevron_down.svg';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';

import { cn } from '@/utils/cn';

import {
  FORM_CONTROL_STYLE,
  FORM_END_ICON_STYLE,
  FORM_ERROR_STYLE,
  FORM_GROUP_STYLE,
  FORM_MESSAGE_STYLE,
} from './formStyles';
import Label from './Label';

const SELECT_TRIGGER_STYLE = [
  'h-[56px]',
  'cursor-pointer',
  'pr-[52px]',
  'text-left',
  'disabled:cursor-not-allowed',
].join(' ');

const SELECT_MENU_STYLE = [
  'absolute',
  'top-[calc(100%+8px)]',
  'left-0',
  'z-[70]',
  'w-full',
  'overflow-hidden',
  'rounded-[12px]',
  'border',
  'border-gray-200',
  'bg-white',
  'py-[4px]',
].join(' ');

const SELECT_OPTION_STYLE = [
  'flex',
  'h-[48px]',
  'w-full',
  'cursor-pointer',
  'items-center',
  'px-[16px]',
  'text-left',
  'text-16-regular',
  'text-gray-800',
  'hover:bg-gray-50',
  'focus:bg-gray-50',
  'focus:outline-none',
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
- 브라우저 기본 팝업은 간격과 라운드를 제어할 수 없어 Figma 규격의 목록을 직접 렌더링합니다.
- options는 단순 문자열과 { value, label } 객체를 모두 받을 수 있습니다.
- 선택 전 안내 문구는 trigger에만 표시하고 실제 선택 목록에는 포함하지 않습니다.
- 실제 form 전송은 숨긴 native select가 담당해 기존 name/value 사용 방식을 유지합니다.
*/
export default function Select({
  id,
  className = '',
  selectClassName = '',
  labelClassName = '',
  label,
  error,
  required = false,
  placeholder = '선택해 주세요',
  options = [],
  value,
  defaultValue = '',
  name,
  disabled = false,
  onChange,
  ...props
}) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const listboxId = `${selectId}-listbox`;
  const nativeSelectId = `${selectId}-native`;
  const errorId = error ? `${selectId}-error` : undefined;

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);

  const selectedValue = value ?? internalValue;
  const normalizedOptions = options.map(getOptionData);
  const selectedOption = normalizedOptions.find(
    ({ optionValue }) => String(optionValue) === String(selectedValue),
  );

  useOutsideClick(containerRef, () => setIsOpen(false), {
    enabled: isOpen,
    detectFocus: true,
    closeOnEscape: true,
  });

  /*
  @ option 선택
  - uncontrolled 사용 시 내부 값을 변경하고 controlled 사용 시 부모의 값을 기다립니다.
  - 기존 native select와 같은 형태로 target.value와 target.name을 onChange에 전달합니다.
  */
  const handleSelectOption = (nextValue) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    setIsOpen(false);
    triggerRef.current?.focus();

    onChange?.({
      target: {
        name,
        value: nextValue,
      },
      currentTarget: {
        name,
        value: nextValue,
      },
    });
  };

  const focusOption = (index) => {
    optionRefs.current[index]?.focus();
  };

  const handleTriggerKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

    event.preventDefault();
    setIsOpen(true);

    requestAnimationFrame(() => {
      const firstIndex =
        event.key === 'ArrowDown' ? 0 : normalizedOptions.length - 1;
      focusOption(firstIndex);
    });
  };

  const handleOptionKeyDown = (event, index, optionValue) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelectOption(optionValue);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusOption(Math.min(index + 1, normalizedOptions.length - 1));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusOption(Math.max(index - 1, 0));
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      focusOption(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      focusOption(normalizedOptions.length - 1);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div className={cn(FORM_GROUP_STYLE, className)}>
      {label && (
        <Label
          htmlFor={selectId}
          required={required}
          className={labelClassName}
        >
          {label}
        </Label>
      )}

      <div ref={containerRef} className="relative">
        <button
          ref={triggerRef}
          id={selectId}
          type="button"
          role="combobox"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          onClick={() => setIsOpen((previous) => !previous)}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            FORM_CONTROL_STYLE,
            SELECT_TRIGGER_STYLE,
            selectedOption ? 'text-gray-800' : 'text-gray-400',
            error && FORM_ERROR_STYLE,
            selectClassName,
          )}
          {...props}
        >
          <span>{selectedOption?.optionLabel ?? placeholder}</span>

          <Image
            className={cn(
              FORM_END_ICON_STYLE,
              'transition-transform',
              isOpen && 'rotate-180',
            )}
            src={IcChevronDown}
            alt=""
            width={24}
            height={24}
            unoptimized
          />
        </button>

        {isOpen && (
          <div
            id={listboxId}
            role="listbox"
            aria-labelledby={selectId}
            className={SELECT_MENU_STYLE}
          >
            {normalizedOptions.map(({ optionValue, optionLabel }, index) => {
              const isSelected = String(optionValue) === String(selectedValue);

              return (
                <button
                  key={optionValue}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectOption(optionValue)}
                  onKeyDown={(event) =>
                    handleOptionKeyDown(event, index, optionValue)
                  }
                  className={cn(
                    SELECT_OPTION_STYLE,
                    isSelected && 'bg-gray-50',
                  )}
                >
                  {optionLabel}
                </button>
              );
            })}
          </div>
        )}

        {/*
          커스텀 목록을 사용해도 form submit과 required 검증이 동작하도록
          같은 값을 가진 native select를 화면 밖에 유지합니다.
        */}
        <select
          id={nativeSelectId}
          name={name}
          value={selectedValue}
          required={required}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          onChange={() => {}}
          className="sr-only"
        >
          <option value="" />
          {normalizedOptions.map(({ optionValue, optionLabel }) => (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p id={errorId} className={FORM_MESSAGE_STYLE}>
          {error}
        </p>
      )}
    </div>
  );
}
