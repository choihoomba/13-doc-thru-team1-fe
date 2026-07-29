'use client';

import { useState } from 'react';

import Image from 'next/image';

import IcDeadline from '@/app/assets/icons/ic_deadline.svg';
import IcPerson from '@/app/assets/icons/ic_person.svg';
import IcNext from '@/app/assets/icons/icon_challenge_page_next.png';
import IcPrev from '@/app/assets/icons/icon_challenge_page_prev.png';

import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import ButtonExternalLink from '@/components/ui/Button/ButtonExternalLink';
import ButtonSecondary from '@/components/ui/Button/ButtonSecondary';
import ChipCategory from '@/components/ui/Chip/ChipCategory';
import ChipField from '@/components/ui/Chip/ChipField';
import Feedback from '@/components/ui/Feedback/Feedback';
import Header from '@/components/ui/Header/Header';
import ModalRejectReason from '@/components/ui/Modal/ModalRejectReason';

// API 연결 전 퍼블리싱을 확인하기 위한 임시 챌린지 데이터입니다.
const MOCK_CHALLENGE = {
  id: 1023,
  title: 'Next.js - App Router : Routing Fundamentals',
  field: 'NEXTJS',
  docType: 'OFFICIAL',
  description:
    'Next.js App Router 공식 문서 중 Routing Fundamentals 내용입니다. 라우팅에 따른 폴더와 파일이 구성되는 법칙과 컨벤션 등에 대해 공부할 수 있을 것 같아요~! 다른 챌린지 많이 참여해 주세요 :)',
  deadline: '2024-03-03',
  maxParticipants: 15,
  currentParticipants: 14,
  sourceUrl: 'https://nextjs.org/docs/app/building-your-application/routing',
};

// 승인 화면에서 확인할 임시 피드백 데이터입니다.
const MOCK_FEEDBACK = {
  id: 1,
  content:
    '일반적으로 개발자는 일련의 하드 스킬을 가지고 있어야 커리어에서 경력과 전문성을 쌓을 수 있습니다. 하지만 이에 못지않게 개인 브랜드를 구축하는 것도 중요합니다.',
  createdAt: '2024-01-18T16:38:00',
  user: {
    id: 1,
    nickname: '개발하는 전문가',
    grade: 'EXPERT',
  },
};

const STATUS_MESSAGE = {
  APPROVED: '신청이 승인된 챌린지입니다.',
  REJECTED: '신청이 거절된 챌린지입니다.',
};

const STATUS_BANNER_STYLE = {
  APPROVED: 'bg-[#DFF0FF] text-[#4095DE]',
  REJECTED: 'bg-[#FFF0F0] text-[#E54946]',
};

// 상단 이전/다음 챌린지 이동 버튼입니다.
// 퍼블리싱 단계라 아직 실제 이동 기능은 연결하지 않습니다.
function ChallengeNavigationButton({ direction }) {
  const isPrevious = direction === 'previous';

  return (
    <button
      type="button"
      aria-label={isPrevious ? '이전 챌린지' : '다음 챌린지'}
      className="flex size-[24px] items-center justify-center"
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

// 챌린지 마감일과 참여 인원을 보여주는 영역입니다.
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
        {challenge.currentParticipants}/{challenge.maxParticipants}명
      </span>
    </div>
  );
}

// 원문 링크와 미리보기 영역입니다.
// 실제 원문 캡처 이미지가 준비되면 임시 안내 영역을 Next Image로 교체합니다.
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
        {/* 실제 원문 캡처 이미지를 넣기 전까지 사용하는 임시 화면입니다. */}
        <div className="flex h-full flex-col px-[24px] py-[20px]">
          <p className="text-14-semibold">NEXT.js</p>

          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <p className="text-18-semibold tablet:text-20-semibold">
                Routing Fundamentals
              </p>
              <p className="mt-[8px] text-12-regular text-gray-300">
                원문 링크 미리보기
              </p>
            </div>
          </div>
        </div>

        <ButtonExternalLink
          href={sourceUrl}
          className="absolute top-[8px] right-[8px]"
        />
      </div>
    </section>
  );
}

export default function AdminChallengeApplicationDetail({ challengeId }) {
  const { openModal } = useModal();

  // PENDING에서 승인 또는 거절 상태로 바꾸기 위한 임시 상태입니다.
  // API 연결 후에는 서버에서 받은 challenge.status를 사용하게 됩니다.
  const [status, setStatus] = useState('PENDING');

  // 관리자가 모달에서 입력한 거절 사유를 임시로 저장합니다.
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectedAt, setRejectedAt] = useState(null);

  const challenge = {
    ...MOCK_CHALLENGE,
    id: challengeId || MOCK_CHALLENGE.id,
  };

  const handleApprove = () => {
    // API 연결 후 승인 mutation을 실행하는 위치입니다.
    setStatus('APPROVED');
  };

  const handleRejectSubmit = (reason) => {
    // API 연결 후 거절 mutation에 reason을 전달하는 위치입니다.
    setRejectionReason(reason);
    setRejectedAt(new Date());
    setStatus('REJECTED');
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

  const hasResult = status === 'APPROVED' || status === 'REJECTED';

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
          {/* 신청 번호와 이전/다음 이동 버튼 영역입니다. */}
          <div className="flex items-center justify-between">
            <p className="text-13-regular text-gray-800">No. {challenge.id}</p>

            <div className="flex items-center gap-[8px]">
              <ChallengeNavigationButton direction="previous" />
              <ChallengeNavigationButton direction="next" />
            </div>
          </div>

          {/* 승인 또는 거절된 경우 결과 안내를 보여줍니다. */}
          {hasResult && (
            <div
              role="status"
              aria-live="polite"
              className={cn(
                'mt-[16px] flex min-h-[35px] w-full items-center justify-center',
                'rounded-full px-[16px] text-center text-16-semebold',
                STATUS_BANNER_STYLE[status],
              )}
            >
              {STATUS_MESSAGE[status]}
            </div>
          )}

          {/* 거절 상태일 때만 거절 사유를 표시합니다. */}
          {status === 'REJECTED' && (
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
                {rejectionReason}
              </p>

              <div
                className={cn(
                  'mt-[16px] flex justify-end gap-[16px]',
                  'text-12-regular text-gray-400',
                )}
              >
                <span>독스루 운영진</span>
                <time dateTime={rejectedAt?.toISOString()}>
                  {formatDate(rejectedAt, true)}
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
              {challenge.description}
            </p>

            <div className="mt-[16px]">
              <ChallengeMeta challenge={challenge} />
            </div>
          </article>

          <SourcePreview sourceUrl={challenge.sourceUrl} />

          {/* 승인된 화면에서만 피드백 예시를 보여줍니다. */}
          {status === 'APPROVED' && (
            <section className="mt-[16px] border-t border-gray-200 pt-[16px]">
              <p
                className={cn(
                  'inline-flex rounded-full bg-gray-800',
                  'px-[12px] py-[6px]',
                  'text-12-medium text-white',
                )}
              >
                🏆 최다 추천 번역
              </p>

              <Feedback
                feedback={MOCK_FEEDBACK}
                canManage={false}
                className="mt-[8px]"
              />
            </section>
          )}

          {/* 승인 대기 상태일 때만 승인·거절 버튼을 보여줍니다. */}
          {status === 'PENDING' && (
            <div className="mt-[16px] border-t border-gray-200 pt-[16px]">
              <div
                className={cn(
                  'mt-[16px] grid grid-cols-2 gap-[8px]',
                  'tablet:ml-auto tablet:w-[330px]',
                )}
              >
                <ButtonSecondary
                  color="red"
                  size="lg"
                  width="100%"
                  onClick={handleRejectClick}
                >
                  거절하기
                </ButtonSecondary>

                <ButtonSecondary
                  color="black"
                  size="lg"
                  width="100%"
                  onClick={handleApprove}
                >
                  승인하기
                </ButtonSecondary>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
