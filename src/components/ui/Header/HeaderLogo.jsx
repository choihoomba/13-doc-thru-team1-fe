import Image from 'next/image';
import Link from 'next/link';

import ImgLogo from '@/app/assets/images/img_logo.svg';

/**
 * 모든 권한의 Header에서 공통으로 사용하는 홈 링크입니다.
 * 실제 이동 경로는 서비스 전역에서 동일하므로 prop 대신 고정 경로를 사용합니다.
 */
export default function HeaderLogo() {
  return (
    <Link
      href="/"
      aria-label="독스루 홈"
      className="flex shrink-0 items-center"
    >
      <Image
        src={ImgLogo}
        width={120}
        height={27}
        priority
        alt="Docthru"
        className="h-[18px] w-[80px] min-[600px]:h-[27px] min-[600px]:w-[120px]"
      />
    </Link>
  );
}
