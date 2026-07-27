import Image from 'next/image';
import Link from 'next/link';

import ImgProfileAdmin from '@/app/assets/images/img_profile_admin.svg';
import ImgProfileMember from '@/app/assets/images/img_profile_member.svg';

import { cn } from '@/utils/cn';

import {
  PROFILE_DIVIDER_STYLE,
  PROFILE_LOGOUT_STYLE,
  PROFILE_MEMBER_LINK_STYLE,
  PROFILE_PANEL_STYLE,
  PROFILE_USER_GRADE_STYLE,
  PROFILE_USER_NAME_STYLE,
  PROFILE_USER_ROW_STYLE,
} from './headerStyles';

/*
백엔드는 사용자 등급을 GENERAL/EXPERT enum으로 반환합니다.
API 값은 그대로 비교하되 화면에는 Figma에서 사용하는 한글 명칭을 표시합니다.
관리자는 grade보다 role이 중요한 패널이므로 항상 "어드민"으로 표시합니다.
*/
const GRADE_LABELS = {
  GENERAL: '일반',
  EXPERT: '전문가',
};

/**
 * Auth API 사용자 정보에서 프로필 패널의 보조 문구를 만듭니다.
 *
 * @param {object|null} user - /auth/me가 반환한 사용자
 * @param {'member'|'admin'} variant - 표시할 프로필 패널 종류
 * @returns {string}
 */
function getGradeLabel(user, variant) {
  if (variant === 'admin' || user?.role === 'ADMIN') return '어드민';

  return GRADE_LABELS[user?.grade] ?? '일반';
}

/**
 * 회원/관리자 프로필 드롭다운
 *
 * 같은 152px 너비와 사용자 정보 영역을 공유하고, 역할에 따라 아래 메뉴만 나눕니다.
 * - member: 사용자 정보 + 나의 챌린지 + 로그아웃, 전체 137px
 * - admin: 사용자 정보 + 로그아웃, 전체 105px
 *
 * @param {string} id - 프로필 버튼의 aria-controls와 연결할 패널 id
 * @param {'member'|'admin'} variant - 회원/관리자 패널 구분
 * @param {object|null} user - Auth API의 nickname, grade, role
 * @param {string} memberProfileHref - 회원의 나의 챌린지 경로
 * @param {() => Promise<void>|void} onLogout - AuthProvider 로그아웃 처리
 * @param {boolean} isLogoutPending - 중복 로그아웃 요청 방지 상태
 */
export default function ProfilePanel({
  id,
  variant,
  user,
  memberProfileHref,
  onLogout,
  isLogoutPending,
}) {
  const isAdmin = variant === 'admin';
  const profileImage = isAdmin ? ImgProfileAdmin : ImgProfileMember;

  return (
    <section
      id={id}
      aria-label={isAdmin ? '관리자 계정 메뉴' : '회원 계정 메뉴'}
      className={cn(PROFILE_PANEL_STYLE, isAdmin ? 'h-[105px]' : 'h-[137px]')}
    >
      <div className={PROFILE_USER_ROW_STYLE}>
        {/*
          Header 아이콘과 같은 32×32 원본 SVG를 사용합니다.
          디자이너가 아이콘을 감싼 노란 원까지 포함해 내보낸 에셋이므로
          CSS로 이미지를 다시 자르거나 별도 배경을 추가하지 않습니다.
        */}
        <Image src={profileImage} width={32} height={32} alt="" />

        <div className="min-w-0">
          <p className={PROFILE_USER_NAME_STYLE}>
            {user?.nickname ?? '사용자'}
          </p>
          <p className={PROFILE_USER_GRADE_STYLE}>
            {getGradeLabel(user, variant)}
          </p>
        </div>
      </div>

      {/* Figma의 x=16, width=120, 2px gray100 구분선입니다. */}
      <div className={PROFILE_DIVIDER_STYLE} aria-hidden="true" />

      {!isAdmin && (
        <Link href={memberProfileHref} className={PROFILE_MEMBER_LINK_STYLE}>
          나의 챌린지
        </Link>
      )}

      <button
        type="button"
        onClick={onLogout}
        disabled={isLogoutPending}
        className={cn(
          PROFILE_LOGOUT_STYLE,
          /*
          관리자 Figma는 로그아웃 행 내부 상/하 여백이 6/7px인 32px 행이며
          패널 아래에 8px 여백이 남습니다. 회원 패널은 남은 36px을 모두 사용합니다.
          */
          isAdmin ? 'mb-[8px] h-[32px]' : 'h-[36px]',
        )}
      >
        {isLogoutPending ? '로그아웃 중' : '로그아웃'}
      </button>
    </section>
  );
}
