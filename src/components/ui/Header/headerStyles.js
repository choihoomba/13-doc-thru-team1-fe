/*
@ 공통 Header 스타일 모음

- Header와 알림 패널에서 반복되는 Tailwind 클래스를 한곳에서 관리합니다.
- 색상과 반응형 기준은 globals.css의 Tailwind v4 토큰을 사용합니다.
- Figma에서 확인한 고정 치수만 arbitrary value로 작성합니다.
  예) Header 56/60px, 콘텐츠 최대 너비 1200px, 알림 패널 343×465px

Header 전용 반응형 전환점:
- globals.css의 tablet은 정확히 iPad mini 기준인 744px입니다.
- 744px 바로 아래에서 모든 Header 요소가 한 번에 작아지는 현상을 피하기 위해
  Header 안에서만 600px을 compact/standard 전환점으로 사용합니다.
- 600px 이상은 iPad mini와 같은 standard 규격을 유지하고,
  실제 모바일 너비(599px 이하)에서만 compact 규격으로 변경됩니다.
- 600px은 관리자 로고, 두 메뉴, 프로필이 겹치지 않고 배치되는 최소 안전 너비입니다.
*/

/*
@ Header 바깥 영역

- 모바일 높이: 56px
- iPad mini/데스크톱 높이: 60px
- z-index 80은 globals.css에 정의된 Header 기준값입니다.
*/
export const HEADER_STYLE = [
  'relative',
  'z-header',
  'h-[56px]',
  'border-b',
  'border-gray-100',
  'bg-white',
  'min-[600px]:h-[60px]',
].join(' ');

/*
@ Header 내부 정렬 영역

- 데스크톱 콘텐츠 최대 너비는 Figma의 1200px입니다.
- 모바일은 좌우 16px, iPad mini는 좌우 24px 여백을 사용합니다.
- 1248px(1200 + 좌우 24)부터는 max-width가 여백을 담당하므로 padding을 제거합니다.

좌표 검증:
- 1920px: (1920 - 1200) / 2 = 좌우 360px
- 744px: 좌우 24px
- 375px: 좌우 16px
*/
export const HEADER_CONTAINER_STYLE = [
  'mx-auto',
  'flex',
  'h-full',
  'w-full',
  'max-w-[1200px]',
  'items-center',
  'justify-between',
  'px-[16px]',
  'min-[600px]:px-[24px]',
  'min-[1248px]:px-0',
].join(' ');

/*
@ Docthru 로고

원본 SVG는 디자이너가 지정한 로고 박스를 포함한 채로 next/image가 렌더링합니다.
- mobile: 80×18px
- standard(iPad mini/desktop): 120×27px
*/
export const HEADER_LOGO_STYLE = [
  'h-[18px]',
  'w-[80px]',
  'min-[600px]:h-[27px]',
  'min-[600px]:w-[120px]',
].join(' ');

/*
@ 관리자 왼쪽 그룹: 로고 + 관리자 메뉴

- mobile의 13px 간격은 Figma 좌표(로고 우측 96px → 메뉴 좌측 109px) 기준입니다.
- standard의 24px 간격은 iPad mini 좌표(144px → 168px) 기준입니다.
*/
export const HEADER_ADMIN_CONTENT_STYLE = [
  'flex',
  'min-w-0',
  'items-center',
  'gap-[13px]',
  'min-[600px]:gap-[24px]',
].join(' ');

/*
@ 관리자 메뉴 묶음

Figma 좌표를 보면 두 메뉴 사이의 별도 gap이 아니라
동일한 너비의 선택 영역 두 개가 바로 이어지는 구조입니다.
*/
export const HEADER_ADMIN_NAV_STYLE = ['flex', 'items-center'].join(' ');

/*
@ 관리자 메뉴 공통 글꼴

- mobile: globals.css의 text-13-bold
- standard: Figma의 15px/18px/bold
- mobile 선택 영역: 76px
- standard 선택 영역: 103px

15px 토큰은 기초 세팅에 없으므로 Header에서만 Figma 값을 직접 사용합니다.
600px 전환점을 사용해 743px에서 갑자기 13px로 축소되지 않도록 했습니다.

좌표 검증:
- desktop: 504→607, 607→710
- iPad mini: 168→271, 271→374
- mobile: 109→185, 185→261
*/
export const HEADER_ADMIN_NAV_ITEM_STYLE = [
  'flex',
  'w-[76px]',
  'items-center',
  'justify-center',
  'text-13-bold',
  'text-center',
  'whitespace-nowrap',
  'min-[600px]:w-[103px]',
  'min-[600px]:text-[15px]',
  'min-[600px]:leading-[18px]',
  'min-[600px]:font-bold',
].join(' ');

/*
@ 회원 오른쪽 그룹: 종 아이콘 + 프로필

24px 종 아이콘, 16px 간격, 32px 프로필이 합쳐져 총 72px입니다.
- desktop: 왼쪽 1488px, 오른쪽 360px
- iPad mini: 왼쪽 648px, 오른쪽 24px
- mobile: 왼쪽 287px, 오른쪽 16px
*/
export const HEADER_MEMBER_ACTIONS_STYLE = [
  'relative',
  'flex',
  'items-center',
  'gap-[16px]',
].join(' ');

/*
@ 24px 아이콘 버튼

SVG 자체를 임의로 자르거나 늘리지 않고 디자이너가 전달한 24×24 박스를 그대로 사용합니다.
*/
export const HEADER_ICON_BUTTON_STYLE = [
  'relative',
  'flex',
  'size-[24px]',
  'items-center',
  'justify-center',
].join(' ');

/*
@ 32px 회원/관리자 프로필 링크

Link 자체와 next/image를 같은 크기로 맞춰 클릭 영역과 Figma 아이콘 박스가 일치합니다.
*/
export const HEADER_PROFILE_BUTTON_STYLE = [
  'flex',
  'size-[32px]',
  'shrink-0',
  'items-center',
  'justify-center',
].join(' ');

/*
@ 프로필 버튼과 패널을 묶는 기준 영역

absolute 프로필 패널의 right: 0을 32px 프로필 버튼 오른쪽에 맞춥니다.
Header 위치와 상관없이 회원/관리자 패널의 우측선이 아이콘 우측선에 정렬됩니다.
*/
export const HEADER_PROFILE_AREA_STYLE = [
  'relative',
  'flex',
  'items-center',
].join(' ');

/*
@ 회원/관리자 공통 프로필 패널

- desktop, iPad mini, mobile 모두 width 152px
- Header 아래에서 시작하도록 32px 아이콘 하단 + 14px 위치를 사용
- Figma의 #F5F5F5 2px stroke와 흰 배경, 8px radius 적용
- globals.css의 gray-100은 #E8EBED로 값이 다르므로 이 테두리만 Figma 원본값을 직접 사용
- 높이는 ProfilePanel에서 member 137px / admin 105px로 나눔
*/
export const PROFILE_PANEL_STYLE = [
  'absolute',
  'right-0',
  // mobile: 아이콘 y=12~44 + 12 = Header 하단 56px
  'top-[calc(100%+12px)]',
  // standard: 아이콘 y=14~46 + 14 = Header 하단 60px
  'min-[600px]:top-[calc(100%+14px)]',
  'z-dropdown',
  'flex',
  'w-[152px]',
  'flex-col',
  'overflow-hidden',
  'rounded-[8px]',
  'border-2',
  'border-[#F5F5F5]',
  'bg-white',
].join(' ');

/*
@ 프로필 사용자 정보 행

패널 border 2px을 포함해 이미지의 실제 좌표가 상/좌 16px이 되도록
내부 padding-top/left를 14px로 설정합니다.
이미지 32px + 간격 8px 뒤에 이름/등급 텍스트가 시작합니다.
*/
export const PROFILE_USER_ROW_STYLE = [
  'flex',
  'h-[59px]',
  'shrink-0',
  'items-start',
  'gap-[8px]',
  'px-[14px]',
  'pt-[14px]',
].join(' ');

export const PROFILE_USER_NAME_STYLE = [
  'truncate',
  'text-14-medium',
  'text-gray-800',
].join(' ');

export const PROFILE_USER_GRADE_STYLE = [
  'mt-[1px]',
  'text-12-medium',
  'text-gray-500',
].join(' ');

/*
패널 border 안쪽에서 margin 14px을 주어 실제 화면 x=16px,
width=120px인 Figma 구분선을 만듭니다.
*/
export const PROFILE_DIVIDER_STYLE = [
  'mx-[14px]',
  'h-[2px]',
  'w-[120px]',
  'shrink-0',
  // globals.css에 #F5F5F5 토큰이 없어 프로필 패널 전용 Figma 값을 사용합니다.
  'bg-[#F5F5F5]',
].join(' ');

export const PROFILE_MEMBER_LINK_STYLE = [
  'flex',
  'h-[36px]',
  'shrink-0',
  'items-center',
  'px-[14px]',
  'text-16-medium',
  'text-gray-600',
  'hover:bg-gray-50',
  'focus-visible:outline-2',
  'focus-visible:outline-offset-[-2px]',
  'focus-visible:outline-brand-yellow',
].join(' ');

export const PROFILE_LOGOUT_STYLE = [
  'flex',
  'shrink-0',
  'items-center',
  'px-[14px]',
  'text-16-medium',
  'text-gray-400',
  'tracking-[0.289px]',
  'hover:bg-gray-50',
  'focus-visible:outline-2',
  'focus-visible:outline-offset-[-2px]',
  'focus-visible:outline-brand-yellow',
  'disabled:cursor-wait',
].join(' ');

/*
@ 비회원 로그인 버튼의 Header 전용 standard 보정

ButtonSecondary의 공통 md 크기는 mobile 80×32, tablet 90×40입니다.
Header는 600px부터 standard 규격을 사용하므로 공통 버튼 구현을 수정하지 않고
className으로 같은 90×40 규격을 조금 먼저 적용합니다.
*/
export const HEADER_LOGIN_BUTTON_STYLE = [
  'min-[600px]:h-[40px]',
  'min-[600px]:min-w-[90px]',
  'min-[600px]:rounded-[12px]',
  'min-[600px]:text-16-semibold',
].join(' ');

/*
@ 알림 패널

- compact(599px 이하): viewport 전체를 덮는 알림 화면
- standard(600px 이상): Header 오른쪽 343×465px 드롭다운
- 요청된 Figma 외곽선: radius 8px, 2px gray-200, white background
*/
export const NOTIFICATION_PANEL_STYLE = [
  'fixed',
  'inset-0',
  'z-dropdown',
  'flex',
  'h-dvh',
  'w-full',
  'flex-col',
  'bg-white',

  'min-[600px]:absolute',
  'min-[600px]:inset-auto',
  'min-[600px]:right-0',
  'min-[600px]:top-[calc(100%+14px)]',
  'min-[600px]:h-[465px]',
  'min-[600px]:w-[343px]',
  'min-[600px]:overflow-hidden',
  'min-[600px]:rounded-[8px]',
  'min-[600px]:border-2',
  'min-[600px]:border-gray-200',
].join(' ');

/*
@ 알림 제목 행

- compact: 56px, 좌우 2px 선
- standard: 48px, 좌우 선은 패널의 2px 외곽선이 담당
- Figma에서 제목과 첫 알림은 하나의 흐름으로 이어져 구분선이 없으므로
  제목 아래 border를 넣지 않습니다.
*/
export const NOTIFICATION_TITLE_STYLE = [
  'flex',
  'h-[56px]',
  'shrink-0',
  'items-center',
  'justify-between',
  'border-x-2',
  'border-gray-200',
  'px-[16px]',

  'min-[600px]:h-[48px]',
  'min-[600px]:border-x-0',
].join(' ');

/*
@ 알림 목록 스크롤

Figma는 알림이 5개만 보이는 상태에서도 오른쪽에 스크롤 영역을 표시합니다.
실제 목록은 overflow-y-auto로 휠·터치 스크롤을 유지합니다.
운영체제가 네이티브 막대를 숨길 수 있으므로 시각적인 회색 막대는
NotificationPanel에서 실제 스크롤 위치와 동기화해 별도로 표시합니다.
*/
export const NOTIFICATION_LIST_STYLE = [
  'h-full',
  'overflow-y-auto',
  /*
   * 네이티브 막대는 운영체제마다 모양과 표시 여부가 다르므로 숨깁니다.
   * 실제 이동량과 동기화되는 Figma용 막대는 NotificationPanel에서 별도로 표시합니다.
   */
  '[scrollbar-width:none]',
  '[-ms-overflow-style:none]',
  '[&::-webkit-scrollbar]:hidden',
].join(' ');

/*
@ 알림 제목 글꼴

Figma에서 확인한 mobile 16px semibold와 standard 14px bold를 분리합니다.
*/
export const NOTIFICATION_TITLE_TEXT_STYLE = [
  'text-16-semibold',
  'text-gray-800',
  'min-[600px]:text-14-bold',
].join(' ');

/*
@ 모바일 알림 닫기 버튼

standard 드롭다운은 바깥 클릭과 Escape로 닫으므로 X 버튼을 숨깁니다.
*/
export const NOTIFICATION_CLOSE_BUTTON_STYLE = [
  'flex',
  'size-[24px]',
  'items-center',
  'justify-center',
  'min-[600px]:hidden',
].join(' ');

/*
@ 알림 한 행

- 첫 행 100px, 이후 행 75px은 NotificationPanel의 index 조건에서 적용
- 내부 여백 상하 12px, 좌우 16px
- 아래 1px 선은 행 사이 구분선입니다.
- 마지막 행은 NotificationPanel에서 조건부로 border-b-0을 합쳐
  목록 끝에 불필요한 선이 남지 않게 합니다.
*/
export const NOTIFICATION_ITEM_STYLE = [
  'flex',
  'w-full',
  'flex-col',
  'items-start',
  'border-x-2',
  'border-b',
  'border-gray-200',
  'bg-white',
  'px-[16px]',
  'py-[12px]',
  'text-left',
  'transition-colors',
  'hover:bg-gray-50',
  'focus-visible:outline-2',
  'focus-visible:outline-offset-[-2px]',
  'focus-visible:outline-brand-yellow',

  // standard에서는 패널의 2px 외곽선이 좌우 테두리를 담당합니다.
  'min-[600px]:border-x-0',
].join(' ');
