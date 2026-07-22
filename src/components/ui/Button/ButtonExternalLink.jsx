import Image from 'next/image';

import IcClick from '@/app/assets/icons/icon_click.svg';

import { cn } from '@/utils/cn';

import { BUTTON_BASE_STYLE } from '@/components/ui/Button/buttonStyles';

/** (원문)링크 열기 버튼 */
export default function ButtonExternalLink({ className = '', href, ...props }) {
  return (
    <a
      className={cn(
        BUTTON_BASE_STYLE,
        'gap-[2px] w-[96px] h-[32px] rounded-[10px] bg-[rgba(246,248,250,0.80)] text-14-bold tracking-[0.28px] text-gray-700',
        'tablet:w-[110px] tablet:text-16-bold tracking-[0.32px]',
        'desktop:w-[96px] desktop:text-14-bold desktop:tracking-[0.28px]',
        className,
      )}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      링크 열기
      <Image src={IcClick} alt="" width={24} height={24} unoptimized />
    </a>
  );
}
