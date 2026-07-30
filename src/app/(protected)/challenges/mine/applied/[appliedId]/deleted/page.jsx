'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import deadlineIcon from '@/app/assets/icons/ic_deadline.svg';
import personIcon from '@/app/assets/icons/ic_person.svg';

import { useEmbeddableIframe } from '@/hooks/common/useEmbeddableIframe';
import { useChallenge } from '@/hooks/queries/challenges/queries1';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import ButtonExternalLink from '@/components/ui/Button/ButtonExternalLink';
import ChipCategory from '@/components/ui/Chip/ChipCategory';
import ChipField from '@/components/ui/Chip/ChipField';

export default function ChallengeDeletedPage() {
  const router = useRouter();
  const params = useParams();
  const challengeId = Number(params.appliedId);

  const { data: challenge, isLoading, isError } = useChallenge(challengeId);
  const { status: iframeStatus, handleIframeLoad } = useEmbeddableIframe(
    challenge?.originalUrl,
  );

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
    <div className={cn('mx-auto max-w-4xl px-4 py-10 ')}>
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
          'mx-auto mb-6 flex h-[35px]  items-center justify-center rounded-full bg-[#757575] ',
        )}
      >
        <span
          className={cn(
            'flex  items-center justify-center text-center text-16-semibold text-white',
          )}
        >
          삭제된 챌린지입니다.
        </span>
      </div>

      <div
        className={cn(
          'mb-10 w-full rounded-xl border border-gray-200 bg-gray-50 p-8',
        )}
      >
        <h3 className={cn('mb-4 text-center text-18-bold text-gray-900')}>
          삭제 사유
        </h3>

        <p
          className={cn(
            'text-center text-14-regular text-gray-700 md:text-16-regular',
          )}
        >
          {challenge.reason ?? '삭제 사유가 등록되지 않았습니다.'}
        </p>

        <p className={cn('mt-6 text-right text-14-regular text-gray-400')}>
          {challenge.deletedAt ? formatDate(challenge.deletedAt, true) : '-'}
        </p>
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

      <h3 className={cn('mb-4 text-18-bold text-gray-900')}>원본 링크</h3>

      <div className={cn('relative h-100 w-full  bg-black', 'tablet:mx-0')}>
        <ButtonExternalLink
          href={challenge.originalUrl}
          className={cn('absolute top-4 right-4 z-20')}
        />
        {iframeStatus === 'blocked' ? (
          <div
            className={cn(
              'flex h-full flex-col items-center justify-center gap-3 bg-white px-6 text-center',
            )}
          >
            <p className={cn('text-14-medium text-gray-500')}>
              이 사이트는 미리보기를 지원하지 않아요
            </p>
            <ButtonExternalLink
              href={challenge.originalUrl}
              className={cn('static w-auto')}
            />
          </div>
        ) : (
          <iframe
            src={challenge.originalUrl}
            title="원본 링크"
            onLoad={handleIframeLoad}
            scrolling="no"
            className={cn('h-full w-full border-none')}
          />
        )}
      </div>
    </div>
  );
}
