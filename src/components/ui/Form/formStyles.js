/*
@ 공통 Form 스타일 모음

- InputBase, Select, InputCalendar, Textarea에서 반복되는 Tailwind 클래스를 한곳에서 관리합니다.
- 컴포넌트마다 Figma의 높이, padding, border-radius가 다르기 때문에
  모든 값을 하나의 공통 스타일에 넣지 않고, 공통 상태와 컴포넌트별 외형을 분리했습니다.
- 색상과 타이포그래피는 globals.css의 Tailwind v4 theme 토큰을 사용합니다.
  예) border-gray-200, text-16-regular, text-red-error
*/

/*
@ 필드 그룹

구조:
Label
입력 영역
오류 메시지

- w-full: 부모 영역의 너비를 채워 모바일, 태블릿, 데스크톱에서 자연스럽게 줄어듭니다.
- flex-col: Label과 입력 영역을 세로로 배치합니다.
- gap-[8px]: Figma에서 확인한 Label과 입력 영역 사이 간격입니다.
*/
export const FORM_GROUP_STYLE = [
  'flex',
  'w-full',
  'flex-col',
  'gap-[8px]',
].join(' ');

/*
@ 모든 입력형 컴포넌트의 공통 상태

이 스타일에는 높이, padding, border-radius를 넣지 않습니다.
각 컴포넌트의 Figma 값이 서로 다르기 때문입니다.

공통으로 관리하는 항목:
- 너비
- 기본 1px border와 배경색
- 텍스트와 placeholder 색상
- focus, disabled 상태

Tailwind의 border 클래스는 border-width: 1px을 담당하고,
각 컴포넌트의 border-gray-200 또는 border-gray-300이 border 색상을 담당합니다.
*/
export const FORM_CONTROL_STYLE = [
  'w-full',
  'border',
  'bg-white',

  // globals.css에 정의된 Pretendard 타이포그래피와 색상 토큰
  'text-16-regular',
  'text-gray-800',
  'placeholder:text-gray-400',

  // 브라우저 기본 outline 대신 프로젝트 border 색상으로 focus를 표시합니다.
  'outline-none',
  'transition-colors',
  'focus:border-gray-700',

  // 비활성화 상태에서 입력할 수 없다는 점을 시각적으로 전달합니다.
  'disabled:cursor-not-allowed',
  'disabled:bg-gray-50',
  'disabled:text-gray-400',
].join(' ');

/*
@ Form/InputBase 공통 외형

Figma 공통 CSS:
display: flex;
height: 48px;
padding: 11px 20px;
align-items: center;
gap: 10px;
border: 1px solid #E5E5E5;
background: #FFF;

InputBase를 사용하는 위치마다 radius가 다르게 확인되어
높이와 padding은 공통으로 유지하고 radius만 별도 style map으로 분리했습니다.

- 제목, 원문 링크: 12px
- 최대 인원: 8px
*/
export const FORM_INPUT_BASE_STYLE = [
  'flex',
  'h-[48px]',
  'items-center',
  'gap-[10px]',
  'px-[20px]',
  'py-[11px]',
  'border-gray-200',
].join(' ');

/*
@ InputBase radius 선택값

InputBase 내부에 name === 'maxParticipants' 같은 페이지 전용 조건을 넣지 않습니다.
공통 컴포넌트가 특정 페이지의 필드명을 알게 되면 재사용성이 떨어지기 때문입니다.

대신 사용하는 페이지에서 borderRadius prop으로 Figma 값을 선택합니다.
지원하지 않는 값이 들어오면 InputBase에서 기본 12px을 사용합니다.
*/
export const FORM_INPUT_RADIUS_STYLE = {
  8: 'rounded-[8px]',
  12: 'rounded-[12px]',
};

/*
@ 오류 상태

- 기본 border보다 뒤에 합쳐져 error 색상이 최종 적용됩니다.
- focus 상태에서도 오류 표시가 사라지지 않도록 focus:border-red-error를 함께 사용합니다.
*/
export const FORM_ERROR_STYLE = [
  'border-red-error',
  'focus:border-red-error',
].join(' ');

/*
@ 오류 메시지

- 프로젝트에서 사용하는 가장 작은 본문 타이포그래피와 오류 색상 토큰을 사용합니다.
*/
export const FORM_MESSAGE_STYLE = ['text-12-regular', 'text-red-error'].join(
  ' ',
);

/*
@ 입력 영역 우측 아이콘 공통 위치

- InputBase의 일반 아이콘, Select 화살표, InputCalendar 아이콘에 사용합니다.
- right-[20px]은 각 입력 컴포넌트의 우측 padding 20px과 맞춘 값입니다.
- pointer-events-none은 장식용 이미지가 input 또는 button 클릭을 막지 않도록 합니다.
- 비밀번호 보기 버튼처럼 실제 클릭이 필요한 아이콘은 각 컴포넌트에서 별도 버튼 스타일을 사용합니다.
*/
export const FORM_END_ICON_STYLE = [
  'pointer-events-none',
  'absolute',
  'top-1/2',
  'right-[20px]',
  '-translate-y-1/2',
].join(' ');
