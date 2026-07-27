'use client';

import { useState } from 'react';

import {
  HEADER_EXAMPLE_MEMBER,
  HEADER_EXAMPLE_NOTIFICATIONS,
} from '@/app/example/_data/headerNotifications';

import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';
import InputBase from '@/components/ui/Form/InputBase';
import InputCalendar from '@/components/ui/Form/InputCalendar';
import Select from '@/components/ui/Form/Select';
import Textarea from '@/components/ui/Form/Textarea';
import Header from '@/components/ui/Header/Header';

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
  '* 마감일은 현재일 기준 7일 뒤부터 선택 가능합니다.';

/*
@ Header + Form 결합 예제 레이아웃

- Header는 fixed이며 599px 이하에서 56px, 600px 이상에서 60px입니다.
- main의 padding-top에 Header 높이와 콘텐츠 여백을 함께 반영합니다.
- mobile 콘텐츠 여백은 20px, standard 콘텐츠 여백은 36px입니다.
  따라서 제목의 절대 Y 좌표는 mobile 76px(56 + 20),
  iPad mini/desktop 96px(60 + 36)으로 Figma와 일치합니다.
- 좌우 16px은 375px 화면에서 Form 너비 343px(375 - 32)을 만듭니다.
*/
const FORM_EXAMPLE_PAGE_STYLE = [
  'min-h-screen',
  'bg-white',
  'px-[16px]',
  'pt-[76px]',
  'pb-[37px]',
  'min-[600px]:pt-[96px]',
].join(' ');

/*
@ 초대형 데스크톱용 Figma 기준 캔버스

- Figma 데스크톱 프레임의 기준 너비인 1920px까지만 예시 페이지를 확장합니다.
- 1920px보다 큰 모니터에서도 Header와 Form이 서로 다른 기준으로 벌어지지 않습니다.
- 컴포넌트 자체 크기를 축소하지 않으므로 mobile/iPad mini/desktop 규격은 유지됩니다.
- globals.css를 수정하지 않고 이 예시 페이지에만 적용합니다.
*/
const FORM_EXAMPLE_CANVAS_STYLE = [
  'mx-auto',
  'min-h-screen',
  'w-full',
  'max-w-[1920px]',
  'bg-white',
].join(' ');

/*
@ Form 본문 너비

- w-full: 부모 너비가 590px보다 작으면 좌우 여백 안에서 자연스럽게 축소
- max-w-[590px]: iPad mini와 desktop의 Figma Form 고정 너비
- mx-auto: 남는 공간을 좌우로 동일하게 나눠 가운데 정렬
*/
const FORM_EXAMPLE_CONTENT_STYLE = ['mx-auto', 'w-full', 'max-w-[590px]'].join(
  ' ',
);

/*
@ Form 필드 세로 배치

제목과 첫 입력 사이 28px, 각 공통 Form 컴포넌트 사이는 24px입니다.
각 Input 내부 치수는 Form/formStyles.js에서 별도로 관리합니다.
*/
const FORM_EXAMPLE_FIELDS_STYLE = [
  'mt-[28px]',
  'flex',
  'flex-col',
  'gap-[24px]',
].join(' ');

/*
@ 날짜 비교용 하루 시작 시각

시간까지 비교하면 같은 날짜라도 현재 시각보다 빠르다는 이유로
잘못된 오류가 발생할 수 있어 시, 분, 초를 제거하고 날짜만 비교합니다.

@param {Date} date - 시간 값을 제거할 Date
@returns {Date} 같은 연·월·일의 로컬 자정 Date
*/
function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/*
@ 기준 날짜에 일수 더하기

오늘 날짜에 7일을 더해 신규 챌린지에서 선택 가능한 최소 마감일을 계산합니다.
Date 객체가 월말과 연말 변경을 자동으로 처리합니다.

@param {Date} date - 기준 날짜
@param {number} amount - 더할 일수
@returns {Date} 일수를 더한 새 Date
*/
function addDays(date, amount) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

/*
@ InputCalendar의 YYYY-MM-DD 값을 로컬 Date로 변환

new Date('YYYY-MM-DD')를 바로 사용하면 환경의 시간대에 따라
날짜가 하루 달라질 수 있어 연, 월, 일을 나눠 Date를 생성합니다.

@param {string} value - InputCalendar가 전달한 YYYY-MM-DD
@returns {Date | null} 로컬 Date 또는 값이 없거나 잘못됐을 때 null
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

@param {string} value - 검증할 YYYY-MM-DD
@returns {string} 오류 문구 또는 정상일 때 빈 문자열
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
  Header 예제용 알림 state입니다.

  공통 Header가 API 데이터와 props 데이터를 모두 지원하는지 검증하기 위해
  최초값은 공유 목 데이터로 시작하고 읽음 처리 시 새 배열로 갱신합니다.
  */
  const [notifications, setNotifications] = useState(
    HEADER_EXAMPLE_NOTIFICATIONS,
  );

  /*
  @ Header 예제 알림 읽음 처리

  실제 페이지에서는 notifications prop을 생략해 Notification API를 사용합니다.
  이 결합 예제는 백엔드를 실행하지 않아도 피그마 UI를 바로 확인할 수 있도록
  목 알림의 읽음 상태만 로컬 state로 변경합니다.
  */
  const handleNotificationRead = (notificationId) => {
    setNotifications((currentNotifications) =>
      // map으로 새 배열을 만들어 React가 state 변경을 감지할 수 있게 합니다.
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

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
    <div className={FORM_EXAMPLE_CANVAS_STYLE}>
      {/*
        신규 챌린지 신청은 회원 화면이므로 예제에서는 목 user를 전달해
        피그마의 종 아이콘/프로필 Header를 즉시 확인할 수 있게 합니다.
        실제 권한 페이지에서는 user를 생략하면 Auth API의 USER/ADMIN 역할을 사용합니다.
      */}
      <Header
        // Auth API 응답과 같은 목 사용자로 회원 프로필 패널의 이름/등급을 확인합니다.
        user={HEADER_EXAMPLE_MEMBER}
        // 목 데이터를 전달하면 Header 내부 Notification API query는 enabled=false가 됩니다.
        notifications={notifications}
        // 알림 선택 시 이 페이지의 목 state도 읽음 상태로 맞춥니다.
        onNotificationRead={handleNotificationRead}
        // 예제에서는 실제 로그아웃 API나 페이지 이동 없이 패널 동작만 확인합니다.
        onLogout={() => undefined}
      />

      <main className={FORM_EXAMPLE_PAGE_STYLE}>
        <form
          className={FORM_EXAMPLE_CONTENT_STYLE}
          // 브라우저 기본 새로고침을 막고 이 페이지의 마감일 정책을 먼저 검증합니다.
          onSubmit={handleSubmit}
        >
          <h1 className="text-20-semibold text-gray-800">신규 챌린지 신청</h1>

          <div className={FORM_EXAMPLE_FIELDS_STYLE}>
            {/*
              제목과 원문 링크는 Figma의 기본 InputBase radius 12px을 사용합니다.
              InputBase의 borderRadius 기본값이 12이므로 별도 prop이 필요하지 않습니다.

              label: 접근 가능한 label과 화면 문구
              name: 이후 FormData/API payload에서 사용할 필드 이름
              placeholder: 값이 비어 있을 때 보여줄 안내
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
              // 공통 Select 외형은 유지하고 이 페이지가 분야 데이터만 주입합니다.
              label="분야"
              name="field"
              placeholder="카테고리"
              options={FIELD_OPTIONS}
            />

            <Select
              // 같은 Select를 재사용하되 options가 달라 컴포넌트 내부 조건 분기가 없습니다.
              label="문서 타입"
              name="docType"
              placeholder="카테고리"
              options={DOCUMENT_TYPE_OPTIONS}
            />

            {/*
              InputCalendar는 오늘 이전 날짜만 선택할 수 없게 막습니다.

              오늘부터 미래 날짜는 모두 선택할 수 있고,
              현재 달력에 함께 표시되는 다음 달 날짜도 미래라면
              현재 달 날짜와 동일한 검은색으로 표시되고 선택 가능합니다.

              이 페이지는 value, onChange, error를 전달해
              "현재일 기준 7일 뒤부터 선택 가능" 정책을 검증합니다.

              오늘부터 6일 뒤까지의 날짜를 선택하면:
              - 선택한 날짜는 입력창에 표시
              - 입력창 border는 오류 색상으로 변경
              - 입력창 아래에 별표(*)가 포함된 안내 메시지 표시
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

              type="number"와 min="1"은 브라우저 단계에서도 음수 입력을 제한합니다.
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
              // Figma에서 내용 필드 위 간격만 25px 더 커 className으로 사용처가 보정합니다.
              className="mt-[25px]"
              label="내용"
              name="content"
              placeholder="내용을 입력해주세요"
            />

            <ButtonPrimary type="submit" size="xl" width="100%">
              {/* 팀 공통 Primary 버튼의 xl 높이와 전체 Form 너비를 그대로 사용합니다. */}
              신청하기
            </ButtonPrimary>
          </div>
        </form>
      </main>
    </div>
  );
}
