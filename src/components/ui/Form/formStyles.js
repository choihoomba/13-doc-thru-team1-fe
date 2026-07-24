/*
@ 공통 Form 스타일
- Figma에서 반복되는 크기, 색상, 타이포그래피를 한곳에서 관리합니다.
- Tailwind 클래스는 리뷰할 때 속성별로 읽을 수 있도록 한 줄씩 나눴습니다.
- 배열의 문자열은 모두 정적인 Tailwind 클래스이며, join은 className에 전달할
  하나의 문자열로 합치는 역할만 합니다.
*/

/*
@ 필드 그룹
- Label 17px + 간격 8px + 기본 입력창 48px로 총 73px 높이가 됩니다.
- Select와 Textarea는 각 컴포넌트에서 입력 영역 높이만 별도로 덮어씁니다.
*/
export const FORM_GROUP_STYLE = [
  'flex',
  'w-full',
  'flex-col',
  'gap-[8px]',
].join(' ');

/*
@ 기본 입력 영역
- globals.css에 정의된 gray 색상과 Pretendard 타이포 토큰을 재사용합니다.
- focus, disabled, placeholder 상태를 공통으로 지정해 사용하는 페이지가 달라도
  동일한 입력 경험을 유지합니다.
*/
export const FORM_CONTROL_STYLE = [
  // 크기와 배치
  'h-[48px]',
  'w-full',
  'px-[16px]',

  // Figma 기본 모양
  'rounded-[12px]',
  'border',
  'border-gray-200',
  'bg-white',

  // globals.css 타이포그래피와 색상 토큰
  'text-16-regular',
  'text-gray-800',
  'placeholder:text-gray-400',

  // 사용자 상태
  'outline-none',
  'transition-colors',
  'focus:border-gray-700',
  'disabled:cursor-not-allowed',
  'disabled:bg-gray-50',
  'disabled:text-gray-400',
].join(' ');

/*
@ 오류 상태
- cn 유틸리티가 기본 border 색상보다 뒤에 있는 오류 색상을 최종 적용합니다.
*/
export const FORM_ERROR_STYLE = [
  'border-red-error',
  'focus:border-red-error',
].join(' ');

/*
@ 오류 메시지
- 프로젝트의 가장 작은 본문 토큰과 error 색상 토큰을 사용합니다.
*/
export const FORM_MESSAGE_STYLE = ['text-12-regular', 'text-red-error'].join(
  ' ',
);

/*
@ 입력창 우측 아이콘
- Figma가 제공한 아이콘 박스 위치를 유지하고, 클릭이 필요 없는 아이콘은
  pointer-events를 막아 input/select 조작을 방해하지 않게 합니다.
*/
export const FORM_END_ICON_STYLE = [
  'pointer-events-none',
  'absolute',
  'top-1/2',
  'right-[16px]',
  '-translate-y-1/2',
].join(' ');
