'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import {
  CHALLENGE_TABS,
  CHALLENGE_TAB_LABELS,
} from '@/lib/constants/constants';

import { cn } from '@/utils/cn';

const TAB_ORDER = [
  CHALLENGE_TABS.ONGOING,
  CHALLENGE_TABS.COMPLETED,
  CHALLENGE_TABS.APPLIED,
];

/** 나의 챌린지 탭(참여중인/완료한/신청한) - ?tab= 쿼리로 전환 */
export default function ChallengeTabs({ className = '' }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? CHALLENGE_TABS.ONGOING;

  return (
    <nav
      aria-label="나의 챌린지 탭"
      className={cn('flex items-center gap-[8px]', className)}
    >
      {TAB_ORDER.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <Link
            key={tab}
            href={`${pathname}?tab=${tab}`}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex items-center justify-center px-[16px] py-[8px] rounded-[24px] whitespace-nowrap',
              'text-14-medium transition-colors',
              isActive
                ? 'bg-gray-800 text-white'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            {CHALLENGE_TAB_LABELS[tab]}
          </Link>
        );
      })}
    </nav>
  );
}
