'use client';

import { useState } from 'react';

import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';

import IcDeadline from '@/app/assets/icons/icon_deadline.svg';
import IcPerson from '@/app/assets/icons/icon_person.svg';
import ImgUser from '@/app/assets/images/img_user.svg';

import { useAuth } from '@/lib/providers/AuthProvider';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useExpandableHeight } from '@/hooks/common/useExpandableHeight';
import { useModal } from '@/hooks/modal/useModal';
import { useDeleteChallenge } from '@/hooks/queries/challenges/mutations';
import { useChallenge } from '@/hooks/queries/challenges/queries';
import { useCreateParticipation } from '@/hooks/queries/participations/mutations';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import ButtonKebab from '@/components/ui/Button/ButtonKebab';
import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';
import ButtonText from '@/components/ui/Button/ButtonText';
import ChipField from '@/components/ui/Chip/ChipField';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import LoadingDisplay from '@/components/ui/LoadingDisplay';
import ModalNotice from '@/components/ui/Modal/ModalNotice';
import ModalRejectReason from '@/components/ui/Modal/ModalRejectReason';

import ChipCategory from '../../ui/Chip/ChipCategory';

const CHALLENGE_CONTENT_HEIGHT = {
  mobile: 250,
  tablet: 300,
  desktop: 320,
};

/** 챌린지 정보 섹션 */
export default function ChallengeInfo({ challengeId }) {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.data.role === 'ADMIN';
  const [isNavigating, setIsNavigating] = useState(false);

  const {
    data: challenge,
    isPending: isChallengePending,
    isError,
    error,
  } = useChallenge(challengeId);
  const { mutate: createParticipation, isPending } = useCreateParticipation();
  const { mutate: deleteChallenge } = useDeleteChallenge();
  const { openModal, closeModal } = useModal();

  const { contentRef, open, height, toggleOpen } =
    useExpandableHeight(challenge);
  const collapsedHeight = useBreakpointValue(CHALLENGE_CONTENT_HEIGHT);

  if (isChallengePending) return <LoadingDisplay />;
  // PENDING/REJECTED/DELETED 상태는 신청자 본인/ADMIN이 아니면 백엔드가 404를 반환
  if (error?.status === 404) notFound();
  if (isError || !challenge) return <ErrorDisplay />;

  const isParticipating = Boolean(challenge.viewer?.participation);
  const isDeadlinePassed = new Date(challenge.deadline) <= new Date();

  const handleChallenge = () => {
    setIsNavigating(true);

    if (isParticipating) {
      router.push(
        `/submissions/${challenge.viewer.participation.submission.id}/edit`,
      );
      return;
    }

    createParticipation(
      { challengeId },
      {
        onSuccess: ({ submission }) => {
          router.push(`/submissions/${submission.id}/edit`);
        },
        onError: (error) => {
          setIsNavigating(false);
          openModal(
            <ModalNotice message={error.message} onConfirm={closeModal} />,
          );
        },
      },
    );
  };

  // 진행 중인 챌린지의 수정/삭제는 ADMIN 전용
  const handleEditChallenge = () => {
    if (!isAdmin) return;
    router.push(`/admin/challenges/${challengeId}/edit`);
  };

  const handleDeleteChallenge = () => {
    if (!isAdmin) return;

    openModal(
      <ModalRejectReason
        title="삭제 사유"
        placeholder="삭제 사유를 입력해주세요"
        submitText="전송"
        onSubmit={(reason) => {
          deleteChallenge(
            { id: challengeId, reason },
            {
              onError: (error) => {
                openModal(
                  <ModalNotice
                    message={error.message}
                    onConfirm={closeModal}
                  />,
                );
              },
            },
          );
        }}
      />,
    );
  };

  return (
    <section>
      <div
        className={cn(
          'pb-[16px] mb-[16px] border-b border-gray-100',
          'tablet:pb-[24px] tablet:flex tablet:justify-between tablet:gap-[16px] tablet:mb-[24px]',
          'desktop:gap-[24px]',
        )}
      >
        {/* 챌린지 정보 섹션 */}
        <article className={cn('w-full')}>
          {/* 타이틀 + 케밥 버튼 */}
          <div className={cn('flex justify-between mb-[16px]')}>
            <h1
              className={cn(
                'text-20-semibold text-gray-800',
                'tablet:text-24-semibold',
              )}
            >
              {challenge.title}
            </h1>
            {isAdmin && !isDeadlinePassed && (
              <ButtonKebab
                onEdit={handleEditChallenge}
                onDelete={handleDeleteChallenge}
              />
            )}
          </div>

          <ul className={cn('flex gap-[8px] mb-[16px]')}>
            <li>
              <ChipField variant={challenge.field} />
            </li>
            <li>
              <ChipCategory variant={challenge.docType} />
            </li>
          </ul>

          <div className={cn('relative mb-[12px]')}>
            <p
              ref={contentRef}
              style={open ? { height } : undefined}
              className={cn(
                'text-body-14-130 text-gray-700',
                'text-body-16-130',
                'overflow-hidden transition-[height] duration-300 ease-in-out',
                !open && 'line-clamp-3',
              )}
            >
              {challenge.content}
            </p>

            {/* 잘리는 지점을 "..."으로 표시하고, 그 뒤에 더보기 버튼을 배치 */}
            {height > collapsedHeight && (
              <ButtonText
                className={cn('mt-[8px]')}
                text={open ? '접기' : '더보기'}
                onClick={toggleOpen}
              />
            )}
          </div>

          <div
            className={cn(
              'flex gap-[8px] items-center mb-[16px] text-12-medium text-gray-800',
              'tablet:mb-0',
            )}
          >
            <Image src={ImgUser} width={24} height={24} alt="신청자 이미지" />
            {challenge.user?.nickname}
          </div>
        </article>

        {/* 마감일, 참여 인원, 원문보기/작업 도전하기 버튼 섹션 */}
        <article
          className={cn(
            'border-2 rounded-[16px] border-gray-100 bg-white flex flex-col gap-[16px] items-center py-[12px] px-[16.5px]',
            'tablet:flex-0 tablet:min-w-[251px] tablet:h-fit tablet:py-[24px] tablet:px-[16px]',
            'desktop:min-w-[285px]',
          )}
        >
          {/* 마감, 모집인원 */}
          <div
            className={cn(
              'flex gap-[4px] items-center text-13-regular text-gray-600',
            )}
          >
            <p className={cn('flex gap-[4px] items-center')}>
              <Image src={IcDeadline} width={24} height={24} alt="" />
              {formatDate(challenge.deadline, false, 'korean')} 마감
            </p>
            <p className={cn('flex gap-[4px] items-center')}>
              <Image src={IcPerson} width={24} height={24} alt="" />
              {challenge.currentParticipants}/{challenge.maxParticipants}
            </p>
          </div>

          {/* 버튼 그룹 */}
          <div className={cn('flex gap-[8px] w-[100%]', 'tablet:flex-col')}>
            <ButtonPrimary
              className="flex-auto"
              variant="tertiary"
              color="yellow"
              size="md"
              href={challenge.originalUrl}
              as="a"
              target="_blank"
            >
              원문 보기
            </ButtonPrimary>
            <ButtonPrimary
              className="flex-auto"
              size="md"
              onClick={handleChallenge}
              disabled={isDeadlinePassed || isPending || isNavigating}
            >
              {isParticipating ? '도전 계속하기' : '작업 도전하기'}
            </ButtonPrimary>
          </div>
        </article>
      </div>
    </section>
  );
}
