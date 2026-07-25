'use client';

import { useState } from 'react';

import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';
import InputBase from '@/components/ui/Form/InputBase';
import InputCalendar from '@/components/ui/Form/InputCalendar';
import Select from '@/components/ui/Form/Select';
import Textarea from '@/components/ui/Form/Textarea';

/*
@ 신규 챌린지 페이지 전용 옵션

- 공통 Form 스타일 파일에 도메인 데이터를 섞지 않고 이 페이지에서만 관리합니다.
- label은 화면 표시 문구, value는 Prisma enum/API 요청 값입니다.
- 공통 Select에는 options만 전달하므로 다른 페이지의 Select 문구에는 영향을 주지 않습니다.
*/
const FIELD_OPTIONS = [
  { value: 'NEXTJS', label: 'Next.js' },
  { value: 'REACT', label: 'React' },
  { value: 'MODERNJS', label: 'Modern JS' },
  { value: 'TYPESCRIPT', label: 'TypeScript' },
  { value: 'API', label: 'API' },
  { value: 'WEB', label: 'Web' },
  { value: 'CAREER', label: 'Career' },
];

const DOCUMENT_TYPE_OPTIONS = [
  { value: 'OFFICIAL', label: '공식문서' },
  { value: 'BLOG', label: '블로그' },
  { value: 'BOOK', label: '도서' },
  { value: 'ETC', label: '기타' },
];

/*
@ 신규 챌린지 마감일 정책

기획 요구사항:
- 마감일은 현재 날짜를 기준으로 7일 뒤부터 선택 가능합니다.

이 값은 InputCalendar 공통 컴포넌트에 넣지 않습니다.
다른 페이지에서는 날짜 정책이 달라질 수 있으므로,
생성 페이지에서만 사용하는 도메인 규칙으로 관리합니다.
*/
const MINIMUM_DEADLINE_DAYS = 7;
const DEADLINE_ERROR_MESSAGE =
  '마감일은 현재일 기준 7일 뒤부터 선택 가능합니다.';

/*
@ 날짜 비교용 하루 시작 시각

시간까지 비교하면 같은 날짜라도 현재 시각보다 빠르다는 이유로
잘못된 오류가 발생할 수 있어 시, 분, 초를 제거하고 날짜만 비교합니다.
*/
function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/*
@ 기준 날짜에 일수 더하기

오늘 날짜에 7일을 더해 신규 챌린지에서 선택 가능한 최소 마감일을 계산합니다.
Date 객체가 월말과 연말 변경을 자동으로 처리합니다.
*/
function addDays(date, amount) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

/*
@ InputCalendar의 YYYY-MM-DD 값을 로컬 Date로 변환

new Date('YYYY-MM-DD')를 바로 사용하면 환경의 시간대에 따라
날짜가 하루 달라질 수 있어 연, 월, 일을 나눠 Date를 생성합니다.
*/
function parseDateValue(value) {
  if (!value) return null;

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

/*
@ 마감일 검증

- 아직 날짜를 선택하지 않은 경우에는 날짜 범위 오류를 표시하지 않습니다.
- 선택한 날짜가 오늘 + 7일보다 빠르면 안내 문구를 반환합니다.
- 정상 날짜이면 빈 문자열을 반환해 InputCalendar의 error를 제거합니다.

필수 입력 여부는 추후 생성 페이지의 전체 Form 검증 정책과 함께 연결할 수 있습니다.
*/
function validateDeadline(value) {
  const selectedDate = parseDateValue(value);

  if (!selectedDate) return '';

  const minimumDeadline = addDays(
    startOfDay(new Date()),
    MINIMUM_DEADLINE_DAYS,
  );

  return startOfDay(selectedDate).getTime() < minimumDeadline.getTime()
    ? DEADLINE_ERROR_MESSAGE
    : '';
}

export default function FormsExPage() {
  /*
  @ 마감일 controlled 상태

  공통 InputCalendar는 모든 날짜를 선택할 수 있게 열어두고,
  이 페이지가 value와 onChange를 전달해 생성 페이지 정책을 검증합니다.
  */
  const [deadline, setDeadline] = useState('');
  const [deadlineError, setDeadlineError] = useState('');

  /*
  @ 마감일 선택 처리

  사용자가 날짜를 선택하면:
  1. 실제 YYYY-MM-DD 값을 상태에 저장합니다.
  2. 현재일 + 7일 정책을 바로 검증합니다.
  3. 잘못된 날짜면 InputCalendar의 error prop으로 안내합니다.

  날짜 선택 자체를 막지 않기 때문에 사용자는 자신이 선택한 값을 확인할 수 있고,
  왜 제출할 수 없는지도 입력창 아래 메시지로 알 수 있습니다.
  */
  const handleDeadlineChange = (event) => {
    const nextDeadline = event.target.value;

    setDeadline(nextDeadline);
    setDeadlineError(validateDeadline(nextDeadline));
  };

  /*
  @ 예제 Form 제출 처리

  현재 예제 페이지에는 실제 API 요청이 연결되어 있지 않으므로 기본 submit만 막습니다.
  제출 시에도 같은 검증을 다시 실행해, 화면 검증을 우회한 잘못된 값이
  이후 API 요청 단계로 넘어가지 않도록 구성했습니다.

  실제 생성 페이지에서는 nextError가 없을 때 API 요청 로직을 이어서 작성하면 됩니다.
  */
  const handleSubmit = (event) => {
    event.preventDefault();

    const nextError = validateDeadline(deadline);

    setDeadlineError(nextError);

    if (nextError) return;

    // 실제 신규 챌린지 생성 API 요청은 생성 페이지 작업에서 연결합니다.
  };

  return (
    <main className="min-h-screen bg-white px-[16px] pt-[96px] pb-[37px]">
      <form className="mx-auto w-full max-w-[590px]" onSubmit={handleSubmit}>
        <h1 className="text-20-semibold text-gray-800">신규 챌린지 신청</h1>

        <div className="mt-[28px] flex flex-col gap-[24px]">
          {/*
            제목과 원문 링크는 Figma의 기본 InputBase radius 12px을 사용합니다.
            InputBase의 borderRadius 기본값이 12이므로 별도 prop이 필요하지 않습니다.
          */}
          <InputBase
            label="제목"
            name="title"
            placeholder="제목을 입력해주세요"
          />

          <InputBase
            label="원문 링크"
            name="originalUrl"
            type="url"
            placeholder="원문 링크를 입력해주세요"
          />

          <Select
            label="분야"
            name="field"
            placeholder="카테고리"
            options={FIELD_OPTIONS}
          />

          <Select
            label="문서 타입"
            name="docType"
            placeholder="카테고리"
            options={DOCUMENT_TYPE_OPTIONS}
          />

          {/*
            InputCalendar는 오늘 이전 날짜만 선택할 수 없게 막습니다.

            오늘부터 미래 날짜는 모두 선택할 수 있고,
            현재 달력에 회색으로 표시된 다음 달 날짜도 미래라면 선택 가능합니다.

            이 페이지는 value, onChange, error를 전달해
            "현재일 기준 7일 뒤부터 선택 가능" 정책을 검증합니다.

            오늘부터 6일 뒤까지의 날짜를 선택하면:
            - 선택한 날짜는 입력창에 표시
            - 입력창 border는 오류 색상으로 변경
            - 입력창 아래에 안내 메시지 표시
            - submit 시 생성 로직 진행 차단
          */}
          <InputCalendar
            label="마감일"
            name="deadline"
            value={deadline}
            onChange={handleDeadlineChange}
            error={deadlineError}
          />

          {/*
            최대 인원 Input은 같은 InputBase를 사용하지만
            Figma에서 radius만 8px로 확인되어 borderRadius={8}을 전달합니다.

            높이 48px, padding 11px 20px, gray-200 border는
            제목과 원문 링크 InputBase와 동일하게 유지됩니다.
          */}
          <InputBase
            label="최대 인원"
            name="maxParticipants"
            type="number"
            min="1"
            borderRadius={8}
            placeholder="인원을 입력해주세요"
          />

          <Textarea
            className="mt-[25px]"
            label="내용"
            name="content"
            placeholder="내용을 입력해주세요"
          />

          <ButtonPrimary type="submit" size="xl" width="100%">
            신청하기
          </ButtonPrimary>
        </div>
      </form>
    </main>
  );
}
