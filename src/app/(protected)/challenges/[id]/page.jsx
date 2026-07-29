import { cn } from '@/utils/cn';

import ChallengeInfo from '@/components/challenges/ChallengeDetail/ChallengeInfo';
import ParticipationStatus from '@/components/challenges/ChallengeDetail/ParticipationStatus';
import TopLikedSubmission from '@/components/challenges/ChallengeDetail/TopLikedSubmission';

export const metadata = {
  title: '챌린지 상세 페이지',
  description:
    '챌린지의 상세 정보를 조회할 수 있는 페이지입니다. 챌린지 정보와 참여 현황, 최다 추천 번역 정보를 조회할수 있습니다.',
};

/** 챌린지 상세 페이지 */
export default async function ChallengeDetailPage({ params }) {
  const { id } = await params;

  return (
    <section
      className={cn(
        'min-h-[100vh] py-[16px_28px] px-[16px]',
        'tablet:py-[24px_28px] tablet:px-[24px]',
      )}
    >
      <div className={cn('max-w-[890px] m-auto')}>
        {/* 챌린지 정보 섹션 */}
        <ChallengeInfo challengeId={id} />

        {/* 최다 추천 번역 섹션 */}
        <TopLikedSubmission challengeId={id} />

        {/* 참여 현황 섹션 */}
        <ParticipationStatus challengeId={id} />
      </div>
    </section>
  );
}
