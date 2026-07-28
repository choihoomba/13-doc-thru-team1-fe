'use client';

import { CHALLENGE_TABS } from '@/lib/constants/constants';

import { useMyChallenges } from '@/hooks/queries/challenges/queries';

import Card from '@/components/ui/Card';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

/** 참여중인 챌린지 목록 */
export default function OngoingChallenges({ search }) {
  const { data, isLoading, isError } = useMyChallenges({
    tab: CHALLENGE_TABS.ONGOING,
    search,
  });

  if (isLoading) return <LoadingDisplay />;
  if (isError) {
    return (
      <p className="py-[80px] text-center text-14-medium text-gray-500">
        참여중인 챌린지를 불러오지 못했어요.
      </p>
    );
  }

  const challenges = data?.challenges ?? [];

  if (challenges.length === 0) {
    return (
      <p className="py-[80px] text-center text-14-medium text-gray-500">
        참여중인 챌린지가 없어요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-[16px]">
      {challenges.map((challenge) => {
        const submissionId = challenge.participations?.[0]?.submission?.id;

        return (
          <Card
            key={challenge.id}
            challenge={challenge}
            detailHref={`/challenges/${challenge.id}`}
            showStatusChip={false}
            showSubmissionButton={Boolean(submissionId)}
            submissionHref={submissionId ? `/submissions/${submissionId}` : ''}
            showContinueButton={!submissionId}
            continueHref={`/submissions/new?challengeId=${challenge.id}`}
          />
        );
      })}
    </div>
  );
}
