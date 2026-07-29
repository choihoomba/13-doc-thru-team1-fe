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

/*
@ Select 전체 frame

Figma에서 Select frame에 확인된 값:
display: flex;
height: 56px;
flex-direction: column;
align-items: flex-start;
align-self: stretch;

커스텀 Select는 trigger와 dropdown을 함께 관리해야 하므로
이 값은 trigger 자체가 아니라 trigger를 감싸는 relative frame에 적용합니다.

trigger에 flex-direction: column을 직접 적용하면
텍스트와 화살표가 세로로 쌓이기 때문에 Figma 화면과 달라집니다.
따라서 frame은 column 구조로 맞추고,
실제 trigger 내부는 텍스트와 아이콘을 가로로 배치합니다.
*/
const SELECT_FRAME_STYLE = [
  'relative',
  'flex',
  'h-[56px]',
  'w-full',
  'flex-col',
  'items-start',
  'self-stretch',
].join(' ');

/*
@ Select trigger

Figma에서 전달된 radius 값은 4px 계열이지만,
닫힌 상태에서 아래쪽 radius를 0으로 적용하면 입력창이 미완성된 사각형처럼 보였습니다.

최종 적용값:
height: 56px;
border-radius: 4px;
border: 1px solid #E5E5E5;
background: #FFF;

- 닫힘/열림 상태 모두 네 모서리에 4px radius를 유지합니다.
- dropdown은 trigger 아래에 별도 popup으로 표시되므로
  trigger의 아래쪽 radius를 제거할 필요가 없습니다.
- FORM_CONTROL_STYLE에도 border가 있지만,
  Select의 네 방향 1px border를 코드에서 명확하게 확인할 수 있도록
  border-[1px]과 border-solid를 이 스타일에도 명시했습니다.
*/
const SELECT_TRIGGER_STYLE = [
  'flex',
  'h-[56px]',
  'w-full',
  'cursor-pointer',
  'items-center',
  'justify-between',
  'gap-[10px]',
  'px-[20px]',
  'pr-[54px]',
  'text-left',

  // 닫힘/열림 상태 모두 네 모서리에 4px radius를 유지합니다.
  'rounded-[4px]',

  // 위, 오른쪽, 아래, 왼쪽에 1px solid border를 확실하게 적용합니다.
  'border-[1px]',
  'border-solid',
  'border-gray-200',

  'bg-white',
  'disabled:cursor-not-allowed',
].join(' ');

/*
@ Dropdown list container

- position: absolute를 사용해 form의 세로 레이아웃을 밀지 않고 trigger 아래에 표시합니다.
- z-dropdown은 globals.css의 --z-index-dropdown: 70 토큰을 사용합니다.
- max-h-[320px]보다 옵션이 많으면 내부에서 스크롤됩니다.
- 스크롤 기능은 유지하되 스크롤바만 숨겨, 스크롤바 너비 때문에 UI가 깨지지 않도록 합니다.
*/
const SELECT_MENU_STYLE = [
  'absolute',
  'top-[calc(100%+8px)]',
  'left-0',
  'z-dropdown',
  'w-full',
  'max-h-[320px]',
  'overflow-y-auto',
  'overscroll-contain',
  'rounded-[8px]',

  // Firefox
  '[scrollbar-width:none]',

  // 이전 Microsoft 브라우저 계열
  '[-ms-overflow-style:none]',

  // Chrome, Edge, Safari
  '[&::-webkit-scrollbar]:hidden',
].join(' ');

/*
@ Dropdown option

Figma 기준:
display: flex;
padding: 12px 0;
justify-content: center;
align-items: center;
gap: 10px;
border: 1px solid #D4D4D4;
background: #FFF;

- 각 option에 좌우와 아래 구분선을 적용합니다.
- 첫 번째 option에는 위쪽 border를 추가합니다.
- 첫 번째와 마지막 option의 radius는 map 내부의 조건부 클래스에서 처리합니다.
*/
const SELECT_OPTION_STYLE = [
  'flex',
  'w-full',
  'shrink-0',
  'cursor-pointer',
  'items-center',
  'justify-center',
  'gap-[10px]',
  'border-x',
  'border-b',
  'border-gray-300',
  'bg-white',
  'py-[12px]',
  'text-center',
  'text-16-regular',
  'text-gray-500',
  'hover:bg-gray-50',
  'focus:bg-gray-50',
  'focus:outline-none',
].join(' ');

/*
@ option 데이터 형태 통일

Select는 다음 두 형태를 모두 받을 수 있습니다.

1. 문자열
   options={['Next.js', 'React']}

2. value와 label이 분리된 객체
   options={[{ value: 'NEXTJS', label: 'Next.js' }]}

백엔드 Prisma enum과 화면 문구가 다를 수 있으므로,
신규 챌린지 페이지에서는 객체 형태를 사용하는 것이 적절합니다.
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

브라우저 기본 select를 사용하지 않는 이유:
- 기본 select popup은 option padding, 구분선, radius, 스크롤바 디자인을 세밀하게 제어하기 어렵습니다.
- Figma 디자인을 맞추기 위해 trigger와 listbox를 직접 렌더링합니다.

form submit은 화면 밖의 native select가 담당합니다.
*/
export default function Select({
  id,
  className = '',
  selectClassName = '',
  labelClassName = '',
  label,
  error,
  required = false,
  showRequired = required,
  placeholder = '선택해 주세요',
  options = [],
  value,
  defaultValue = '',
  name,
  disabled = false,
  onChange,
  ...props
}) {
  /*
  @ id 연결

  - trigger, listbox, native select, 오류 메시지에 서로 다른 id를 부여합니다.
  - aria-controls와 aria-describedby로 관련 요소를 연결합니다.
  */
  const generatedId = useId();
  const selectId = id || generatedId;
  const listboxId = `${selectId}-listbox`;
  const nativeSelectId = `${selectId}-native`;
  const errorId = error ? `${selectId}-error` : undefined;

  /*
  @ DOM 참조

  - containerRef: 외부 클릭 감지 범위
  - triggerRef: option 선택 후 trigger로 focus 복귀
  - optionRefs: 키보드 방향키로 option 간 focus 이동
  */
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);

  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);

  /*
  @ controlled / uncontrolled 지원

  - value가 전달되면 부모가 값을 관리하는 controlled 방식입니다.
  - value가 없으면 internalValue로 컴포넌트 내부에서 관리합니다.
  */
  const selectedValue = value ?? internalValue;
  const normalizedOptions = options.map(getOptionData);

  const selectedOption = normalizedOptions.find(
    ({ optionValue }) => String(optionValue) === String(selectedValue),
  );

  /*
  @ 외부 클릭과 Escape 처리

  메뉴가 열려 있을 때만 이벤트를 활성화해 불필요한 전역 이벤트 처리를 줄입니다.
  */
  useOutsideClick(containerRef, () => setIsOpen(false), {
    enabled: isOpen,
    detectFocus: true,
    closeOnEscape: true,
  });

  /*
  @ option 선택

  - uncontrolled 방식이면 내부 값을 변경합니다.
  - 메뉴를 닫고 trigger에 focus를 돌려줍니다.
  - native input과 비슷하게 target.name, target.value 형태로 onChange를 전달합니다.
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

  /*
  @ trigger 키보드 조작

  ArrowDown 또는 ArrowUp으로 메뉴를 열고
  첫 번째 또는 마지막 option에 focus를 이동합니다.
  */
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

  /*
  @ option 키보드 조작

  - Enter, Space: 현재 option 선택
  - ArrowDown, ArrowUp: 다음 또는 이전 option 이동
  - Home, End: 첫 번째 또는 마지막 option 이동
  - Escape: 메뉴 닫기
  */
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
          required={showRequired}
          className={labelClassName}
        >
          {label}
        </Label>
      )}

      {/*
        Figma의 56px column frame과 dropdown의 absolute 기준을 동시에 담당합니다.
      */}
      <div ref={containerRef} className={SELECT_FRAME_STYLE}>
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

            // 열린 상태에서도 4px radius는 유지하고 border 색상만 진하게 표시합니다.
            isOpen && 'border-gray-700',

            // 값이 없으면 placeholder 색상, 선택값이 있으면 본문 색상을 사용합니다.
            error && FORM_ERROR_STYLE,
            selectClassName,
          )}
          {...props}
        >
          <span
            className={cn(
              'truncate',
              selectedOption ? 'text-gray-800' : 'text-gray-500',
            )}
          >
            {selectedOption?.optionLabel ?? placeholder}
          </span>

          {/*
            메뉴 상태를 시각적으로 알 수 있도록 열렸을 때 화살표를 180도 회전합니다.
            장식용 이미지이므로 alt는 비워 둡니다.
          */}
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
              const isFirst = index === 0;
              const isLast = index === normalizedOptions.length - 1;
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

                    // Figma dropdown 첫 항목의 radius: 8px 8px 0 0
                    isFirst && 'rounded-t-[8px] border-t',

                    // 메뉴 전체 아래 모서리가 끊기지 않도록 마지막 항목에 하단 radius를 적용합니다.
                    isLast && 'rounded-b-[8px]',
                  )}
                >
                  {optionLabel}
                </button>
              );
            })}
          </div>
        )}

        {/*
          화면에는 커스텀 listbox를 보여주지만,
          form submit과 required 검증은 native select가 담당합니다.
          sr-only로 시각적으로 숨기되 DOM에는 유지합니다.
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
