'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import IcDeadline from '@/app/assets/icons/ic_deadline.svg';
import IcPerson from '@/app/assets/icons/ic_person.svg';
import IcNext from '@/app/assets/icons/icon_challenge_page_next.png';
import IcPrev from '@/app/assets/icons/icon_challenge_page_prev.png';

import { useModal } from '@/hooks/modal/useModal';
import {
  useApproveAdminChallenge,
  useRejectAdminChallenge,
} from '@/hooks/queries/adminChallenges/mutations';
import { useAdminChallenge } from '@/hooks/queries/adminChallenges/queries';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import ButtonExternalLink from '@/components/ui/Button/ButtonExternalLink';
import ButtonSecondary from '@/components/ui/Button/ButtonSecondary';
import ChipCategory from '@/components/ui/Chip/ChipCategory';
import ChipField from '@/components/ui/Chip/ChipField';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import Header from '@/components/ui/Header/Header';
import LoadingDisplay from '@/components/ui/LoadingDisplay';
import ModalRejectReason from '@/components/ui/Modal/ModalRejectReason';

function ChallengeNavigationButton({ direction, targetId, onNavigate }) {
  const isPrevious = direction === 'previous';
  const isDisabled = !targetId;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => onNavigate(targetId)}
      aria-label={isPrevious ? '이전 챌린지' : '다음 챌린지'}
      className={cn(
        'flex size-[24px] items-center justify-center',
        'disabled:cursor-default disabled:opacity-30',
      )}
    >
      <Image
        src={isPrevious ? IcPrev : IcNext}
        alt=""
        width={24}
        height={24}
        unoptimized
      />
    </button>
  );
}

function ChallengeMeta({ challenge }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-[8px]',
        'text-12-regular text-gray-500',
        'tablet:flex-row tablet:items-center tablet:gap-[16px]',
      )}
    >
      <span className="flex items-center gap-[6px]">
        <Image src={IcDeadline} alt="" width={16} height={16} unoptimized />
        {formatDate(challenge.deadline)} 마감
      </span>

      <span className="flex items-center gap-[6px]">
        <Image src={IcPerson} alt="" width={16} height={16} unoptimized />
        {challenge.currentParticipants ?? 0}/{challenge.maxParticipants ?? 0}명
      </span>
    </div>
  );
}

function SourcePreview({ sourceUrl }) {
  return (
    <section className="mt-[24px]">
      <h2 className="text-16-semibold text-gray-800">원문 링크</h2>

      <div
        className={cn(
          'relative mt-[12px] aspect-[16/9] w-full overflow-hidden',
          'bg-gray-800 text-white',
        )}
      >
        {/* 원문 미리보기 이미지 API가 없어 링크 안내 화면을 유지합니다. */}
        <div className="flex h-full flex-col px-[24px] py-[20px]">
          <p className="text-14-semibold">원문 링크</p>

          <div className="flex flex-1 items-center justify-center">
            <p className="text-center text-16-regular text-gray-300">
              링크 열기 버튼을 눌러 원문을 확인해주세요.
            </p>
          </div>
        </div>

        {sourceUrl && (
          <ButtonExternalLink
            href={sourceUrl}
            className="absolute top-[8px] right-[8px]"
          />
        )}
      </div>
    </section>
  );
}

function DetailStateDisplay({ isLoading, error }) {
  return (
    <>
      <Header activeAdminNav="manage" />

      <main className={cn('min-h-dvh bg-white pt-[56px]', 'tablet:pt-[60px]')}>
        <div className="mx-auto w-full max-w-[890px] px-[16px] tablet:px-[24px] desktop:px-0">
          {isLoading ? (
            <LoadingDisplay />
          ) : (
            <ErrorDisplay
              message={
                error?.message ?? '챌린지 신청 정보를 불러오지 못했습니다.'
              }
            />
          )}
        </div>
      </main>
    </>
  );
}

export default function AdminChallengeApplicationDetail({
  challengeId,
  challengeIds = [],
}) {
  const router = useRouter();
  const { openModal } = useModal();
  const {
    data: challenge,
    isLoading,
    isError,
    error,
  } = useAdminChallenge(challengeId);
  const approveMutation = useApproveAdminChallenge(challengeId);
  const rejectMutation = useRejectAdminChallenge(challengeId);

  // 현재 챌린지가 전달받은 목록에서 몇 번째인지 찾습니다.
  const currentChallengeIndex = challengeIds.findIndex(
    (id) => String(id) === String(challengeId),
  );

  // 현재 항목의 바로 앞과 뒤에 있는 챌린지 ID를 가져옵니다.
  const previousChallengeId =
    currentChallengeIndex > 0 ? challengeIds[currentChallengeIndex - 1] : null;

  const nextChallengeId =
    currentChallengeIndex >= 0 &&
    currentChallengeIndex < challengeIds.length - 1
      ? challengeIds[currentChallengeIndex + 1]
      : null;

  if (isLoading) {
    return <DetailStateDisplay isLoading />;
  }

  if (isError || !challenge) {
    return <DetailStateDisplay error={error} />;
  }

  const status = challenge.status;
  const isPending = status === 'PENDING';
  const isApproved = status === 'APPROVED';
  const isRejected = status === 'REJECTED';
  const isActionPending = approveMutation.isPending || rejectMutation.isPending;
  const actionError = approveMutation.error ?? rejectMutation.error;

  const handleChallengeNavigate = (targetId) => {
    if (!targetId) return;

    const searchParams = new URLSearchParams();

    if (challengeIds.length > 0) {
      searchParams.set('ids', challengeIds.join(','));
    }

    const queryString = searchParams.toString();

    router.push(
      queryString
        ? `/admin/challenges/${targetId}?${queryString}`
        : `/admin/challenges/${targetId}`,
    );
  };

  const handleApprove = () => {
    approveMutation.mutate();
  };

  const handleRejectSubmit = (reason) => {
    return rejectMutation.mutateAsync(reason);
  };

  const handleRejectClick = () => {
    openModal(
      <ModalRejectReason
        title="거절 사유"
        label="내용"
        placeholder="거절 사유를 입력해주세요"
        submitText="전송"
        onSubmit={handleRejectSubmit}
      />,
    );
  };

  return (
    <>
      <Header activeAdminNav="manage" />

      <main className={cn('min-h-dvh bg-white pt-[56px]', 'tablet:pt-[60px]')}>
        <div
          className={cn(
            'mx-auto w-full max-w-[890px]',
            'px-[16px] pt-[24px] pb-[48px]',
            'tablet:px-[24px] tablet:pt-[32px]',
            'desktop:px-0',
          )}
        >
          <div className="flex items-center justify-between">
            <p className="text-13-regular text-gray-800">No. {challenge.id}</p>

            <div className="flex items-center gap-[8px]">
              <ChallengeNavigationButton
                direction="previous"
                targetId={previousChallengeId}
                onNavigate={handleChallengeNavigate}
              />

              <ChallengeNavigationButton
                direction="next"
                targetId={nextChallengeId}
                onNavigate={handleChallengeNavigate}
              />
            </div>
          </div>

          {(isApproved || isRejected) && (
            <div
              role="status"
              aria-live="polite"
              className={cn(
                'mt-[16px] flex min-h-[35px] w-full items-center justify-center',
                'rounded-full px-[16px] text-center text-16-semibold',
                isApproved
                  ? 'bg-[#DFF0FF] text-[#4095DE]'
                  : 'bg-[#FFF0F0] text-[#E54946]',
              )}
            >
              {isApproved
                ? '신청이 승인된 챌린지입니다.'
                : '신청이 거절된 챌린지입니다.'}
            </div>
          )}

          {isRejected && (
            <section
              className={cn(
                'mt-[16px] rounded-[12px]',
                'border border-gray-300 bg-gray-50',
                'px-[16px] py-[16px]',
                'tablet:px-[24px]',
              )}
            >
              <h2 className="text-center text-14-semibold text-gray-800">
                신청 거절 사유
              </h2>

              <p className="mt-[12px] text-center text-16-medium text-gray-700">
                {challenge.reason || '등록된 거절 사유가 없습니다.'}
              </p>

              <div
                className={cn(
                  'mt-[16px] flex justify-end gap-[16px]',
                  'text-12-regular text-gray-400',
                )}
              >
                <span>독스루 운영진</span>
                <time dateTime={challenge.updatedAt}>
                  {formatDate(challenge.updatedAt, true)}
                </time>
              </div>
            </section>
          )}

          <article className="mt-[16px] border-b border-gray-200 pb-[24px]">
            <h1
              className={cn(
                'break-words text-18-semibold text-gray-800',
                'tablet:text-20-semibold',
              )}
            >
              {challenge.title}
            </h1>

            <div className="mt-[12px] flex items-center gap-[8px]">
              <ChipField variant={challenge.field} />
              <ChipCategory variant={challenge.docType} />
            </div>

            <p
              className={cn(
                'mt-[16px] break-words text-14-regular text-gray-700',
                'tablet:text-16-regular',
              )}
            >
              {challenge.content}
            </p>

            <div className="mt-[16px]">
              <ChallengeMeta challenge={challenge} />
            </div>
          </article>

          <SourcePreview sourceUrl={challenge.originalUrl} />

          {actionError && (
            <p
              role="alert"
              className="mt-[16px] text-right text-14-regular text-red-error"
            >
              {actionError.message}
            </p>
          )}

          {isPending && (
            <div className="mt-[16px] border-t border-gray-200 pt-[16px]">
              <div
                className={cn(
                  'grid grid-cols-2 gap-[8px]',
                  'tablet:ml-auto tablet:w-[330px]',
                )}
              >
                <ButtonSecondary
                  color="red"
                  size="lg"
                  width="100%"
                  disabled={isActionPending}
                  onClick={handleRejectClick}
                >
                  거절하기
                </ButtonSecondary>

                <ButtonSecondary
                  color="black"
                  size="lg"
                  width="100%"
                  disabled={isActionPending}
                  onClick={handleApprove}
                >
                  {approveMutation.isPending ? '승인 중' : '승인하기'}
                </ButtonSecondary>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
