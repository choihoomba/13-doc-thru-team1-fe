import Image from 'next/image';
import Link from 'next/link';

import IcDeadline from '@/app/assets/icons/ic_deadline.svg';
import IcDeadlineWhite from '@/app/assets/icons/ic_deadline_white.svg';
import IcPerson from '@/app/assets/icons/ic_person.svg';
import IcPersonWhite from '@/app/assets/icons/ic_person_white.svg';

import { cn } from '@/utils/cn';

import ButtonChallenge from '@/components/ui/Button/ButtonChallenge';
import ButtonKebab from '@/components/ui/Button/ButtonKebab';
import ChipCategory from '@/components/ui/Chip/ChipCategory';
import ChipFiled from '@/components/ui/Chip/ChipFiled';

function formatDeadline(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

const STATUS_MAP = {
  APPROVED: {
    label: '모집이 완료된 상태예요',
    icon: IcPersonWhite,
    className: 'bg-gray-200 text-gray-800',
  },
  CLOSED: {
    label: '챌린지가 마감되었어요',
    icon: IcDeadlineWhite,
    className: 'bg-gray-800 text-white',
  },
};

/**
 * 챌린지 카드
 * - challenge: BE 챌린지(title, deadline, maxParticipants, currentParticipants, Field, docType, status)
 * - status: BE ChallengeStatus enum 값 → STATUS_MAP 기준으로 상태 칩 렌더링
 * - showStatusChip / showKebab / showContinueButton / showSubmissionButton 으로 화면별 노출 요소 제어
 * - 상세페이지 이동은 제목 클릭으로만 처리 (ButtonChallenge 자체가 Link라 카드 전체를 Link로 감싸면 <a> 중첩이 발생)
 */
export default function Card({
  challenge,
  detailHref,
  showStatusChip = true,
  showKebab = false,
  onEdit,
  onDelete,
  showContinueButton = false,
  continueHref,
  showSubmissionButton = false,
  submissionHref,
  className = '',
}) {
  const {
    title,
    deadline,
    maxParticipants,
    currentParticipants,
    Field,
    docType,
    status,
  } = challenge;

  const statusChip = STATUS_MAP[status];
  const hasStatusChip = showStatusChip && Boolean(statusChip);

  return (
    <div
      className={cn(
        'flex flex-col w-full p-[24px] rounded-[12px] border-2 border-gray-800 bg-white',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between',
          hasStatusChip
            ? 'mb-[8px] tablet:mb-[14px] desktop:mb-[16px]'
            : 'mb-[14px]',
        )}
      >
        {hasStatusChip && (
          <span
            className={cn(
              'flex  gap-[4px] px-[12px] py-[8px] rounded-[24px] text-13-medium',
              statusChip.className,
            )}
          >
            <Image
              src={statusChip.icon}
              alt=""
              width={16}
              height={16}
              unoptimized
            />
            {statusChip.label}
          </span>
        )}

        {!hasStatusChip && (
          <Link
            href={detailHref}
            className={cn(
              'w-fit text-20-semibold text-gray-700',
              'tablet:text-22-semibold',
            )}
          >
            {title}
          </Link>
        )}

        {showKebab && (
          <ButtonKebab
            onEdit={onEdit}
            onDelete={onDelete}
            className={cn('ml-auto mb-auto')}
          />
        )}
      </div>

      {hasStatusChip && (
        <Link
          href={detailHref}
          className={cn(
            'w-fit mb-[14px] text-20-semibold text-gray-700',
            'tablet:text-22-semibold',
          )}
        >
          {title}
        </Link>
      )}

      <div
        className={cn(
          'flex items-center mb-[20px] gap-[8px]',
          'tablet:mb-[16px]',
        )}
      >
        {Field && <ChipFiled label={Field} />}
        {docType && <ChipCategory label={docType} />}
      </div>

      <hr className={cn('border-gray-200')} />

      <div className={cn('flex items-center justify-between')}>
        <div
          className={cn(
            'flex items-start mt-[12px] flex-col gap-[2px] text-13-regular text-gray-600',
            'tablet:flex-row tablet:items-center tablet:mt-[20.5px] tablet:gap-[8px]',
            'desktop:mt-[16px] desktop:gap-[12px]',
          )}
        >
          <span className={cn('flex items-center gap-[4px]')}>
            <Image src={IcDeadline} alt="" width={24} height={24} unoptimized />
            {formatDeadline(deadline)} 마감
          </span>
          <span className={cn('flex items-center gap-[4px]')}>
            <Image src={IcPerson} alt="" width={24} height={24} unoptimized />
            {currentParticipants}/{maxParticipants} 참여 완료
          </span>
        </div>

        {showContinueButton && (
          <div className={cn('flex mt-auto')}>
            <ButtonChallenge variant="challenge" href={continueHref} />
          </div>
        )}
        {showSubmissionButton && (
          <div className={cn('flex mt-auto')}>
            <ButtonChallenge variant="submission" href={submissionHref} />
          </div>
        )}
      </div>
    </div>
  );
}
