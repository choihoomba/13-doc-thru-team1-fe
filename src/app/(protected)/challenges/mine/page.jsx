'use client';

import { useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { CHALLENGE_TABS } from '@/lib/constants/constants';

import { cn } from '@/utils/cn';

import ChallengeTabs from '@/components/challenges/ChallengeTabs';
import CompletedChallenges from '@/components/challenges/CompletedChallenges';
import OngoingChallenges from '@/components/challenges/OngoingChallenges';
import ButtonChallengeApply from '@/components/ui/Button/ButtonChallengeApply';
import InputSearch from '@/components/ui/FilterBar/SearchBar';

/** 나의 챌린지
 * - 참여중인 챌린지, 완료한 챌린지, 신청한 챌린지
 */
export default function MyChallengesPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? CHALLENGE_TABS.ONGOING;
  const [search, setSearch] = useState('');

  return (
    <div
      className={cn(
        'flex flex-col pt-[15px] px-[16px] pb-[60px]',
        'tablet:px-[24px] tablet:pt-[16px]',
        'desktop:max-w-[996px] desktop:mx-auto desktop:pt-[24px]',
      )}
    >
      <div className={cn('flex justify-between items-center')}>
        <h1 className={cn('text-20-semibold')}>나의 챌린지</h1>
        <ButtonChallengeApply href="/challenges/new" />
      </div>

      <ChallengeTabs />

      <InputSearch onSearch={setSearch} />

      {activeTab === CHALLENGE_TABS.ONGOING && (
        <OngoingChallenges search={search} />
      )}
      {activeTab === CHALLENGE_TABS.COMPLETED && (
        <CompletedChallenges search={search} />
      )}
      {activeTab === CHALLENGE_TABS.APPLIED && (
        // TODO: 신청한 챌린지 탭
        <p className="py-[80px] text-center text-14-medium text-gray-500">
          준비 중이에요.
        </p>
      )}
    </div>
  );
}
