'use client';

import { useEffect, useState } from 'react';

import { getMyChallenges } from '@/lib/api/challengeMine';
import { CHALLENGE_TABS } from '@/lib/constants/constants';

import { cn } from '@/utils/cn';

import Card from '@/components/ui/Card';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

/** 참여중인 챌린지 목록 */
export default function OngoingChallenges({ search }) {
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getMyChallenges({ tab: CHALLENGE_TABS.ONGOING, search })
      .then((data) => {
        if (cancelled) return;
        setChallenges(data?.challenges ?? []);
        setIsError(false);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('참여중인 챌린지 조회 실패:', error);
        setIsError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search]);

  if (isLoading) return <LoadingDisplay />;
  if (isError) {
    return (
      <p className={cn('py-[80px] text-center text-14-medium text-gray-500')}>
        참여중인 챌린지를 불러오지 못했어요.
      </p>
    );
  }

  if (challenges.length === 0) {
    return (
      <p className={cn('py-[80px] text-center text-14-medium text-gray-500')}>
        참여중인 챌린지가 없어요.
      </p>
    );
  }

  return (
    <div
      className={cn('flex flex-col mt-[16px] gap-[24px]', 'tablet:mt-[24px]')}
    >
      {challenges.map((challenge) => {
        const submissionId = challenge.participations?.[0]?.submission?.id;

        return (
          <Card
            key={challenge.id}
            challenge={challenge}
            detailHref={`/challenges/${challenge.id}`}
            showStatusChip={false}
            showContinueButton={Boolean(submissionId)}
            continueHref={
              submissionId ? `/submissions/new?id=${submissionId}` : ''
            }
          />
        );
      })}
    </div>
  );
}
