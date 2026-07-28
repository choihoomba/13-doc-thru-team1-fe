import Image from 'next/image';

import ImgProfileAdmin from '@/app/assets/images/img_profile_admin.svg';
import ImgProfileMember from '@/app/assets/images/img_profile_member.svg';

/**
 * Header에서 회원과 관리자가 공통으로 사용하는 프로필 패널 토글 버튼입니다.
 * 사용자 role에서 파생한 isAdmin만 받아 variant 중복을 만들지 않습니다.
 */
export default function ProfileButton({
  isAdmin,
  controlsId,
  isOpen,
  onClick,
}) {
  return (
    <button
      type="button"
      aria-label={isAdmin ? '관리자 계정 메뉴' : '회원 계정 메뉴'}
      aria-expanded={isOpen}
      aria-controls={controlsId}
      onClick={onClick}
      className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center"
    >
      <Image
        src={isAdmin ? ImgProfileAdmin : ImgProfileMember}
        width={32}
        height={32}
        alt=""
      />
    </button>
  );
}
