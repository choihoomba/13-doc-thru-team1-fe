'use client';

import { useId, useMemo, useRef, useState } from 'react';

import Image from 'next/image';

import IcCalendar from '@/app/assets/icons/icon_calendar.svg';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';

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

/*
@ Calendar trigger

Figma CSS:
display: flex;
height: 48px;
align-items: center;
gap: 10px;
border-radius: 12px;
border: 1px solid #E5E5E5;
background: #FFF;

- 일반 input 대신 button을 사용하는 이유는 클릭 시 커스텀 캘린더를 열기 위해서입니다.
- 우측에 28px 캘린더 아이콘이 있으므로 텍스트와 겹치지 않도록 pr-[58px]을 사용합니다.
  계산: 우측 여백 20px + 아이콘 28px + 텍스트와 아이콘 간격 10px
*/
const CALENDAR_TRIGGER_STYLE = [
  'relative',
  'flex',
  'h-[48px]',
  'cursor-pointer',
  'items-center',
  'gap-[10px]',
  'px-[20px]',
  'pr-[58px]',
  'text-left',
  'rounded-[12px]',
  'border-gray-200',
].join(' ');

/*
@ Calendar popup

- absolute로 배치해 form의 다음 요소 위치를 밀지 않습니다.
- right-0, left-auto를 사용해 부모 입력 영역의 오른쪽 끝에 맞춥니다.
  결과적으로 캘린더 너비만큼 왼쪽 방향으로 펼쳐집니다.
- max-w-[calc(100vw-32px)]로 모바일 화면에서 좌우 16px 여백을 남깁니다.
- z-dropdown은 globals.css의 dropdown z-index 토큰을 사용합니다.
*/
const CALENDAR_POPOVER_STYLE = [
  'absolute',
  'top-[calc(100%+8px)]',
  'right-0',
  'left-auto',
  'z-dropdown',
  'w-[320px]',
  'max-w-[calc(100vw-32px)]',
  'rounded-[12px]',
  'border',
  'border-gray-200',
  'bg-white',
  'p-[16px]',
  'shadow-lg',
].join(' ');

/*
@ 요일 목록

JavaScript Date의 getDay()가 일요일을 0으로 반환하므로
일요일부터 토요일 순서로 작성합니다.
*/
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

/*
@ 날짜 비교를 위한 하루 시작 시각

시간, 분, 초를 제거해 날짜만 비교합니다.
같은 날짜 안에서 현재 시각보다 빠르다는 이유로
오늘 날짜가 잘못 비활성화되지 않도록 합니다.
*/
function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/*
@ 해당 월의 첫날

캘린더 월 이동과 6주 그리드 계산의 기준으로 사용합니다.
*/
function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/*
@ 월 이동

Date 생성자가 연도 변경을 자동 처리합니다.
예를 들어 12월에서 1개월을 더하면 다음 해 1월이 됩니다.
*/
function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

/*
@ form 문자열을 Date 객체로 변환

API와 native date input은 YYYY-MM-DD 형식을 사용합니다.
시간대 변환으로 날짜가 하루 밀리는 문제를 피하기 위해
new Date('YYYY-MM-DD') 대신 연, 월, 일을 나눠 로컬 Date를 만듭니다.
*/
function parseDateValue(value) {
  if (!value) return null;

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

/*
@ Date 객체를 form 문자열로 변환

선택한 날짜를 API 요청과 native date input에서 사용할 수 있는
YYYY-MM-DD 형식으로 변환합니다.
*/
function toDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/*
@ 오늘과 min 중 더 늦은 날짜 선택

공통 캘린더의 기본 제한은 오늘입니다.

- min prop이 없으면 오늘부터 선택할 수 있습니다.
- min prop이 전달되면 오늘과 min 중 더 늦은 날짜부터 선택할 수 있습니다.
- 신규 챌린지 예제 페이지에서는 오늘 + 7일을 min으로 막지 않고,
  오늘부터 선택하게 한 뒤 페이지의 error 검증으로 안내합니다.

min prop은 다른 페이지에서 더 강한 선택 제한이 필요한 경우를 위해 유지합니다.
*/
function getLaterDate(firstDate, secondDate) {
  return firstDate.getTime() >= secondDate.getTime() ? firstDate : secondDate;
}

/*
@ 달력 6주 그리드 생성

일반적인 월간 달력은 앞달과 다음 달 날짜를 포함한 7열 x 6행 구조입니다.

처리 순서:
1. 현재 보고 있는 월의 1일 요일을 구합니다.
2. 해당 주의 일요일까지 시작 날짜를 이동합니다.
3. 시작 날짜부터 42일을 만들어 6주 그리드를 구성합니다.
4. 각 날짜의 실제 Date 객체와 YYYY-MM-DD 값을 저장합니다.

현재 월인지 여부로 색상을 나누지 않으므로,
선택 가능한 다음 달 날짜도 현재 달 날짜와 동일한 색상으로 표시합니다.

useMemo에서 호출해 viewDate가 변경될 때만 다시 계산합니다.
*/
function createCalendarDays(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const gridStart = new Date(year, month, 1 - firstDayIndex);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    );

    return {
      date,
      value: toDateValue(date),
    };
  });
}

/*
@ InputCalendar

브라우저 기본 date picker를 사용하지 않는 이유:
- 브라우저마다 모양과 펼침 위치가 다릅니다.
- popup을 부모 오른쪽 기준으로 왼쪽에 펼치는 동작을 확실하게 제어하기 어렵습니다.
- 현재 월과 앞뒤 월 날짜의 표시 및 선택 동작을 Figma에 맞게 제어하기 어렵습니다.

최종 날짜 선택 규칙:
1. 오늘 이전 날짜
   - 회색 표시
   - 선택 불가

2. 오늘부터 미래 날짜
   - 선택 가능

3. 현재 달력 화면에 함께 표시되는 앞달 또는 다음 달 날짜
   - 오늘 이전이면 회색 표시 및 선택 불가
   - 오늘 이후라면 현재 달 날짜와 동일한 검은색 표시
   - 미래 날짜라면 현재 월 여부와 관계없이 선택 가능
   - 예: 8월 달력 마지막 줄에 표시된 9월 1일도 검은색으로 표시되고 바로 선택 가능

4. 신규 챌린지의 "현재일 기준 7일 뒤부터 허용" 정책
   - 캘린더 자체에서 선택을 막지 않습니다.
   - 페이지에서 value, onChange, error를 전달해 안내 문구와 오류 border를 표시합니다.
   - 잘못된 날짜가 선택되어 있어도 사용자가 선택한 값은 input에서 확인할 수 있습니다.
   - Form 제출 시 페이지 검증에서 진행을 차단합니다.

이렇게 기본적인 과거 날짜 제한은 공통 캘린더가 담당하고,
서비스의 업무 규칙은 사용하는 페이지가 담당하도록 분리했습니다.
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
  min,
  name,
  onChange,
  ...props
}) {
  /*
  @ id 연결

  - triggerId: 화면에 보이는 달력 열기 button
  - inputId: form submit용 native date input
  - errorId: 오류 메시지
  */
  const generatedId = useId();
  const inputId = id || generatedId;
  const triggerId = `${inputId}-trigger`;
  const errorId = error ? `${inputId}-error` : undefined;

  /*
  @ DOM과 상태

  - containerRef: 외부 클릭 범위
  - isOpen: 캘린더 popup 열림 여부
  - internalValue: uncontrolled 방식에서 선택한 날짜
  */
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);

  /*
  @ controlled / uncontrolled 지원

  value가 전달되면 부모가 날짜를 관리하고,
  value가 없으면 내부 state로 관리합니다.

  신규 챌린지 페이지에서는 선택값 검증과 오류 표시가 필요하므로
  value, onChange, error를 전달하는 controlled 방식으로 사용합니다.
  */
  const selectedValue = value ?? internalValue;
  const selectedDate = parseDateValue(selectedValue);

  /*
  @ 실제 최소 선택 날짜

  기본값은 오늘입니다.
  min prop이 전달되면 오늘과 min 중 더 늦은 값을 사용합니다.

  신규 챌린지 예제 페이지에서는 min을 전달하지 않으므로
  오늘부터 모든 미래 날짜를 선택할 수 있습니다.
  */
  const today = startOfDay(new Date());
  const minDateFromProps = parseDateValue(min);

  const minimumDate = minDateFromProps
    ? getLaterDate(today, startOfDay(minDateFromProps))
    : today;

  /*
  @ 현재 화면에 표시할 월

  선택된 날짜가 있으면 해당 월을 보여주고,
  선택값이 없으면 최소 선택 날짜가 포함된 월을 보여줍니다.
  */
  const [viewDate, setViewDate] = useState(() =>
    startOfMonth(selectedDate || minimumDate),
  );

  /*
  viewDate가 변경될 때만 42개의 달력 날짜를 다시 계산합니다.
  */
  const calendarDays = useMemo(() => createCalendarDays(viewDate), [viewDate]);

  /*
  @ 외부 클릭과 Escape 처리

  캘린더가 열려 있을 때만 이벤트를 활성화합니다.
  */
  useOutsideClick(containerRef, () => setIsOpen(false), {
    enabled: isOpen,
    detectFocus: true,
    closeOnEscape: true,
  });

  /*
  @ 날짜 변경 전달

  - uncontrolled 방식이면 내부 값을 변경합니다.
  - native input의 onChange와 비슷하게 target.name, target.value 형태로 전달합니다.
  - 실제 값은 YYYY-MM-DD 형식입니다.
  - 페이지는 전달받은 값을 기준으로 업무 규칙 검증을 수행할 수 있습니다.
  */
  const emitChange = (nextValue) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

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

  /*
  @ 캘린더 열기

  - disabled 상태에서는 열리지 않습니다.
  - 선택된 날짜가 있으면 해당 월을 보여줍니다.
  - 선택값이 없으면 현재 월을 보여줍니다.
  */
  const handleOpenCalendar = () => {
    if (disabled) return;

    setViewDate(startOfMonth(selectedDate || minimumDate));
    setIsOpen((previous) => !previous);
  };

  /*
  @ 날짜 선택

  - 오늘 또는 min보다 이전 날짜는 함수에서도 다시 차단합니다.
  - 현재 달력 화면의 다음 달 날짜라도 미래 날짜이면 선택할 수 있습니다.
  - 선택한 날짜는 YYYY-MM-DD 형식으로 전달하고 popup을 닫습니다.
  */
  const handleSelectDate = (date) => {
    if (startOfDay(date).getTime() < minimumDate.getTime()) return;

    emitChange(toDateValue(date));
    setIsOpen(false);
  };

  /*
  화면에는 프로젝트 formatDate 유틸을 사용해 날짜 형식을 변환하고,
  실제 form 값은 YYYY-MM-DD 형식을 유지합니다.
  */
  const formattedDate = selectedValue
    ? formatDate(`${selectedValue}T00:00:00`)
    : '';

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

      {/*
        trigger와 popup을 같은 relative 부모 안에 배치합니다.
        popup은 absolute이므로 다음 Form 항목을 밀지 않습니다.
      */}
      <div ref={containerRef} className="relative">
        <button
          id={triggerId}
          type="button"
          onClick={handleOpenCalendar}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={`${inputId}-calendar`}
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          className={cn(
            FORM_CONTROL_STYLE,
            CALENDAR_TRIGGER_STYLE,
            disabled && 'cursor-not-allowed bg-gray-50 text-gray-400',

            // 페이지에서 error를 전달하면 입력창 border를 오류 색상으로 변경합니다.
            error && FORM_ERROR_STYLE,

            inputClassName,
          )}
        >
          <span
            className={cn(
              'text-16-regular',
              selectedValue ? 'text-gray-800' : 'text-gray-400',
            )}
          >
            {formattedDate || placeholder}
          </span>

          <Image
            className={FORM_END_ICON_STYLE}
            src={IcCalendar}
            alt=""
            width={28}
            height={28}
            unoptimized
          />
        </button>

        {isOpen && (
          <div
            id={`${inputId}-calendar`}
            role="dialog"
            aria-label="날짜 선택"
            className={CALENDAR_POPOVER_STYLE}
          >
            {/*
              월 이동은 제한하지 않습니다.
              과거 월도 확인할 수 있지만 minimumDate 이전 날짜는 선택할 수 없습니다.
            */}
            <div className="mb-[16px] flex items-center justify-between">
              <strong className="text-18-semibold text-gray-900">
                {viewDate.getFullYear()}년{' '}
                {String(viewDate.getMonth() + 1).padStart(2, '0')}월
              </strong>

              <div className="flex items-center gap-[8px]">
                <button
                  type="button"
                  aria-label="이전 달"
                  onClick={() => setViewDate(addMonths(viewDate, -1))}
                  className="flex size-[32px] items-center justify-center rounded-[6px] text-20-medium hover:bg-gray-50"
                >
                  ‹
                </button>

                <button
                  type="button"
                  aria-label="다음 달"
                  onClick={() => setViewDate(addMonths(viewDate, 1))}
                  className="flex size-[32px] items-center justify-center rounded-[6px] text-20-medium hover:bg-gray-50"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7">
              {WEEK_DAYS.map((day) => (
                <span
                  key={day}
                  className="flex h-[36px] items-center justify-center text-12-medium text-gray-600"
                >
                  {day}
                </span>
              ))}

              {calendarDays.map(({ date, value: dateValue }) => {
                /*
                선택 불가능 조건은 minimumDate보다 이전인지 여부만 확인합니다.

                현재 월인지, 달력 마지막 줄에 함께 표시된 다음 달인지와 관계없이
                오늘 이후의 선택 가능한 날짜는 모두 검은색으로 표시합니다.

                따라서 8월 달력에 함께 표시된 9월 날짜도
                현재 달 날짜와 동일하게 보이며 클릭하면 정상 적용됩니다.
                */
                const isBeforeMinimum =
                  startOfDay(date).getTime() < minimumDate.getTime();

                const isSelected =
                  !isBeforeMinimum && dateValue === selectedValue;

                return (
                  <button
                    key={dateValue}
                    type="button"
                    disabled={isBeforeMinimum}
                    onClick={() => handleSelectDate(date)}
                    aria-label={`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`}
                    aria-pressed={isSelected}
                    className={cn(
                      'flex h-[40px] items-center justify-center rounded-[8px] text-14-regular',

                      // 과거 날짜만 회색으로 표시하고 마우스·키보드 선택을 막습니다.
                      isBeforeMinimum && 'cursor-not-allowed text-gray-300',

                      // 오늘 이후 날짜는 현재 월 여부와 관계없이 동일한 검은색으로 표시합니다.
                      !isBeforeMinimum &&
                        'cursor-pointer text-gray-900 hover:bg-gray-50',

                      // 선택된 날짜는 검은 배경과 흰색 글자로 강조합니다.
                      isSelected && 'bg-gray-800 text-white',
                    )}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/*
          form submit용 native date input

          화면에는 커스텀 캘린더를 사용하지만,
          name, value, required, min과 같은 HTML form 기능은 native input에 유지합니다.

          min에는 오늘 또는 전달된 min을 넣어 과거 날짜가 유효한 값으로 제출되지 않도록 합니다.
          현재일 + 7일 정책은 min이 아니라 페이지의 error 검증으로 처리합니다.
        */}
        <input
          id={inputId}
          type="date"
          name={name}
          value={selectedValue}
          min={toDateValue(minimumDate)}
          required={required}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          onChange={(event) => emitChange(event.target.value)}
          className="sr-only"
          {...props}
        />
      </div>

      {/*
        페이지의 검증 결과가 error 문자열로 전달되면
        마감일 입력창 아래에 안내 메시지를 표시합니다.
      */}
      {error && (
        <p id={errorId} className={FORM_MESSAGE_STYLE}>
          {error}
        </p>
      )}
    </div>
  );
}
