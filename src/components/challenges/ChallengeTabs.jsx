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

/** 나의 챌린지 탭(참여중인/완료한/(신청한)) - ?tab= 쿼리로 전환 */
export default function ChallengeTabs({ className = '' }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? CHALLENGE_TABS.ONGOING;

  return (
    <div className={cn('relative mb-[16px]', 'tablet:mb-[24px]', className)}>
      <nav aria-label="나의 챌린지 탭" className={cn('flex items-center')}>
        {TAB_ORDER.map((tab) => {
          const isActive = tab === activeTab;

          return (
            <Link
              key={tab}
              href={`${pathname}?tab=${tab}`}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center justify-center whitespace-nowrap px-[24px] py-[16px] border-b-[3px]',
                'transition-colors',
                isActive
                  ? 'border-gray-800 text-gray-800 text-16-semibold'
                  : 'border-transparent text-gray-500 text-16-semibold hover:text-gray-600',
              )}
            >
              {CHALLENGE_TAB_LABELS[tab]}
            </Link>
          );
        })}
      </nav>
      <div className="h-px w-full bg-gray-300" />
    </div>
  );
}
