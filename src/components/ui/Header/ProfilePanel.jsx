import Image from 'next/image';
import Link from 'next/link';

import ImgProfileAdmin from '@/app/assets/images/img_profile_admin.svg';
import ImgProfileMember from '@/app/assets/images/img_profile_member.svg';

import { cn } from '@/utils/cn';

const GRADE_LABELS = {
  GENERAL: '일반',
  EXPERT: '전문가',
};

function getGradeLabel(user) {
  if (user?.role === 'ADMIN') return '어드민';

  return GRADE_LABELS[user?.grade] ?? '일반';
}

/**
 * user.role로 회원/관리자 패널을 파생해 별도 variant prop을 받지 않습니다.
 * 나의 챌린지 경로도 서비스에서 고정된 값이므로 컴포넌트 내부에서 관리합니다.
 */
export default function ProfilePanel({ id, user, onLogout, isLogoutPending }) {
  const isAdmin = user?.role === 'ADMIN';

  return (
    <section
      id={id}
      aria-label={isAdmin ? '관리자 계정 메뉴' : '회원 계정 메뉴'}
      className={cn(
        'absolute right-0 top-[calc(100%+12px)] z-dropdown flex w-[152px] flex-col',
        'overflow-hidden rounded-[8px] border-2 border-[#F5F5F5] bg-white',
        'min-[600px]:top-[calc(100%+14px)]',
        isAdmin ? 'h-[105px]' : 'h-[137px]',
      )}
    >
      <div className="flex h-[59px] shrink-0 items-start gap-[8px] px-[14px] pt-[14px]">
        <Image
          src={isAdmin ? ImgProfileAdmin : ImgProfileMember}
          width={32}
          height={32}
          alt=""
        />

        <div className="min-w-0">
          <p className="truncate text-14-medium text-gray-800">
            {user?.nickname ?? '사용자'}
          </p>
          <p className="mt-[1px] text-12-medium text-gray-500">
            {getGradeLabel(user)}
          </p>
        </div>
      </div>

      <div
        className="mx-[14px] h-[2px] w-[120px] shrink-0 bg-[#F5F5F5]"
        aria-hidden="true"
      />

      {!isAdmin && (
        <Link
          href="/challenges/mine"
          className="
            flex h-[36px] shrink-0 cursor-pointer items-center px-[14px]
            text-16-medium text-gray-600 hover:bg-gray-50
            focus-visible:outline-2 focus-visible:outline-offset-[-2px]
            focus-visible:outline-brand-yellow
          "
        >
          나의 챌린지
        </Link>
      )}

      <button
        type="button"
        onClick={onLogout}
        disabled={isLogoutPending}
        className={cn(
          'flex shrink-0 cursor-pointer items-center px-[14px] text-16-medium',
          'text-gray-400 tracking-[0.289px] hover:bg-gray-50',
          'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-yellow',
          'disabled:cursor-wait',
          isAdmin ? 'mb-[8px] h-[32px]' : 'h-[36px]',
        )}
      >
        {isLogoutPending ? '로그아웃 중' : '로그아웃'}
      </button>
    </section>
  );
}
