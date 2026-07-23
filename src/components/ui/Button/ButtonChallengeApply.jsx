import Image from 'next/image';
import Link from 'next/link';

import IcPlus from '@/app/assets/icons/icon_plus.svg';

import { cn } from '@/utils/cn';

import { BUTTON_BASE_STYLE } from '@/components/ui/Button/buttonStyles';

/** 신규 챌린지 신청 버튼 */
export default function ButtonChallengeApply({
  className = '',
  href,
  ...props
}) {
  return (
    <Link
      className={cn(
        BUTTON_BASE_STYLE,
        'gap-[8px] w-[154px] h-[39px] rounded-[19.5px] text-16-semibold bg-brand-black text-white',
        className,
      )}
      href={href}
      {...props}
    >
      신규 챌린지 신청
      <Image src={IcPlus} alt="" width={16} height={16} unoptimized />
    </Link>
  );
}
