'use client';

import { CHALLENGE_TABS } from '@/lib/constants/constants';

import useInfiniteScroll from '@/hooks/common/useInfiniteScroll';
import { useMyChallenges } from '@/hooks/queries/challenges/queries';

import { cn } from '@/utils/cn';

import Card from '@/components/ui/Card';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

/** 완료한 챌린지 목록 */
export default function CompletedChallenges({ search }) {
  const { challenges, isLoading, isError, hasNext, isFetchingMore, loadMore } =
    useMyChallenges({ tab: CHALLENGE_TABS.COMPLETED, search });

  const sentinelRef = useInfiniteScroll(loadMore, {
    enabled: hasNext && !isFetchingMore,
  });

  if (isLoading) return <LoadingDisplay />;
  if (isError) {
    return (
      <p className={cn('py-[80px] text-center text-14-medium text-gray-500')}>
        완료한 챌린지를 불러오지 못했어요.
      </p>
    );
  }

  if (challenges.length === 0) {
    return (
      <p className={cn('py-[80px] text-center text-14-medium text-gray-500')}>
        완료한 챌린지가 없어요.
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
            showSubmissionButton={Boolean(submissionId)}
            submissionHref={submissionId ? `/submissions/${submissionId}` : ''}
          />
        );
      })}

      {hasNext && <div ref={sentinelRef} className="h-px" />}
      {isFetchingMore && (
        <LoadingDisplay size="32" fullHeight={false} className="mx-auto" />
      )}
    </div>
  );
}
