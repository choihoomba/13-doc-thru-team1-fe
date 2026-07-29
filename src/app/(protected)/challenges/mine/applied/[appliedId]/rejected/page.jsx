'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import deadlineIcon from '@/app/assets/icons/ic_deadline.svg';
import personIcon from '@/app/assets/icons/ic_person.svg';

import { useChallenge } from '@/hooks/queries/challenges/queries1';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import ButtonExternalLink from '@/components/ui/Button/ButtonExternalLink';
import ChipCategory from '@/components/ui/Chip/ChipCategory';
import ChipField from '@/components/ui/Chip/ChipField';

export default function ChallengeRejectedPage() {
  const router = useRouter();
  const params = useParams();
  const challengeId = Number(params.appliedId);

  const { data: challenge, isLoading, isError } = useChallenge(challengeId);

  if (isLoading) {
    return (
      <div className={cn('py-20 text-center text-16-regular text-gray-500')}>
        불러오는 중입니다...
      </div>
    );
  }

  if (isError || !challenge) {
    return (
      <div className={cn('py-20 text-center text-16-regular text-red-error')}>
        챌린지 정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className={cn('mx-auto max-w-4xl px-4 py-10 font-pretendard')}>
      <button
        onClick={() => router.back()}
        className={cn(
          'mb-6 flex items-center text-14-regular text-gray-500 transition-colors hover:text-black',
        )}
      >
        &lt; &nbsp;목록으로 돌아가기
      </button>

      <div
        className={cn(
          'mx-auto mb-6 flex h-[35px] w-[890px] items-center justify-center rounded-full bg-[#FFF0F0] shadow-sm',
        )}
      >
        <span
          className={cn(
            'flex h-[19px] items-center justify-center text-center text-16-semibold text-[#E54946]',
          )}
        >
          신청이 거절되었습니다.
        </span>
      </div>

      <div
        className={cn(
          'mb-10 w-full rounded-xl border border-gray-200 bg-gray-50 p-8',
        )}
      >
        <h3 className={cn('mb-4 text-center text-18-bold text-gray-900')}>
          신청 거절 사유
        </h3>
        <p
          className={cn(
            'text-center text-14-regular text-gray-700 md:text-16-regular',
          )}
        >
          {challenge.reason ?? '사유가 기재되지 않았습니다.'}
        </p>
        <div
          className={cn(
            'mt-6 flex items-center justify-end gap-2 text-14-regular text-gray-400',
          )}
        >
          <span>독스루 운영진</span>
          <span>|</span>
          <span>
            {challenge.updatedAt ? formatDate(challenge.updatedAt, true) : '-'}
          </span>
        </div>
      </div>

      <hr className={cn('mb-4 border-gray-200')} />

      <div className={cn('mb-8')}>
        <h1 className={cn('mb-4 text-24-bold text-gray-900')}>
          {challenge.title}
        </h1>

        <div className={cn('mb-4 flex items-center gap-2')}>
          <ChipField variant={challenge.field} />
          <ChipCategory variant={challenge.docType} />
        </div>

        <p className={cn('mb-6 text-body-16-130 text-gray-700')}>
          {challenge.content}
        </p>

        <div
          className={cn(
            'mb-4 flex items-center gap-6 text-14-regular text-gray-600',
          )}
        >
          <div className={cn('flex items-center gap-1.5')}>
            <Image src={deadlineIcon} alt="마감 기한" width={24} height={24} />
            <span>
              {challenge.deadline
                ? `${formatDate(challenge.deadline)} 마감`
                : '-'}
            </span>
          </div>
          <div className={cn('flex items-center gap-1.5')}>
            <Image src={personIcon} alt="현재참여인원" width={24} height={24} />
            <span>{challenge.maxParticipants}명</span>
          </div>
        </div>
      </div>

      <hr className={cn('mb-4 border-gray-200')} />

      <div>
        <h3 className={cn('mb-4 text-18-bold text-gray-900')}>원본 링크</h3>

        <div
          className={cn(
            'relative h-100 w-full overflow-hidden rounded-lg border border-gray-200 bg-black shadow-md',
          )}
        >
          <ButtonExternalLink
            href={challenge.originalUrl}
            className={cn('absolute right-4 top-4')}
          />
        </div>
      </div>
    </div>
  );
}
