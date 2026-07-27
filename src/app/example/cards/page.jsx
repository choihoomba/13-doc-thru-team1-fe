'use client';

import ExContainer from '@/app/example/_components/ExContainer';
import ExLayout from '@/app/example/_components/ExLayout';

import { cn } from '@/utils/cn';

import Card from '@/components/ui/Card';

const SAMPLE_CHALLENGE = {
  title: 'Next.js - App Router: Routing Fundamentals',
  deadline: '2024-03-03',
  maxParticipants: 5,
  currentParticipants: 5,
  field: 'Next.js',
  docType: '공식문서',
};

const SAMPLE_CHALLENGE_CLOSED = {
  ...SAMPLE_CHALLENGE,
  status: 'CLOSED',
};
const SAMPLE_CHALLENGE_COMPLETED = {
  ...SAMPLE_CHALLENGE,
  status: 'APPROVED',
};

export default function CardsExPage() {
  return (
    <section className={cn('p-[50px]')}>
      <h1
        className={cn(
          'w-fit mb-[12px] py-[10px] px-[24px] text-24-bold bg-brand-black text-brand-yellow border-1 border-brand-black rounded-[12px]',
        )}
      >
        공통 Card 컴포넌트
      </h1>

      <ExLayout title="🥕 챌린지 카드">
        <ExContainer description={`회원 챌린지 보기 페이지`}>
          <Card challenge={SAMPLE_CHALLENGE} detailHref="/" />
        </ExContainer>
        <ExContainer description={`회원 챌린지 보기 페이지 - 모집완료`}>
          <Card challenge={SAMPLE_CHALLENGE_COMPLETED} detailHref="/" />
        </ExContainer>
        <ExContainer description={`회원 챌린지 보기 페이지 - 챌린지 마감`}>
          <Card challenge={SAMPLE_CHALLENGE_CLOSED} detailHref="/" />
        </ExContainer>
        <hr className={cn('border-gray-200')} />

        <ExContainer description={`회원 나의 챌린지 -참여중인 챌린지 `}>
          <Card
            challenge={SAMPLE_CHALLENGE}
            detailHref="/"
            showContinueButton
            continueHref="/"
          />
        </ExContainer>
        <ExContainer
          description={`회원 나의 챌린지 -참여중인 챌린지 - 모집 완료  `}
        >
          <Card
            challenge={SAMPLE_CHALLENGE_COMPLETED}
            detailHref="/"
            showContinueButton
            continueHref="/"
          />
        </ExContainer>

        <ExContainer
          description={`회원 나의 챌린지 -참여중인 챌린지 - 챌린지 마감  `}
        >
          <Card
            challenge={SAMPLE_CHALLENGE_CLOSED}
            detailHref="/"
            showContinueButton
            continueHref="/"
          />
        </ExContainer>
        <hr className={cn('border-gray-200')} />

        <ExContainer description={`회원 나의 챌린지-완료한 챌린지`}>
          <Card
            challenge={SAMPLE_CHALLENGE}
            detailHref="/"
            showSubmissionButton
            submissionHref="/"
          />
        </ExContainer>
        <ExContainer description={`회원 나의 챌린지-완료한 챌린지 - 모집 완료`}>
          <Card
            challenge={SAMPLE_CHALLENGE_COMPLETED}
            detailHref="/"
            showSubmissionButton
            submissionHref="/"
          />
        </ExContainer>
        <ExContainer
          description={`회원 나의 챌린지-완료한 챌린지 - 챌린지 마감`}
        >
          <Card
            challenge={SAMPLE_CHALLENGE_CLOSED}
            detailHref="/"
            showSubmissionButton
            submissionHref="/"
          />
        </ExContainer>
        <hr className={cn('border-gray-200')} />

        <ExContainer description={`챌린지 보기 페이지 - 어드민 `}>
          <Card
            challenge={SAMPLE_CHALLENGE}
            detailHref="/"
            showKebab
            onEdit={() => alert('수정하기')}
            onDelete={() => alert('삭제하기')}
          />
        </ExContainer>
        <ExContainer description={`챌린지 보기 페이지 - 어드민 - 모집 완료 `}>
          <Card
            challenge={SAMPLE_CHALLENGE_COMPLETED}
            detailHref="/"
            showKebab
            onEdit={() => alert('수정하기')}
            onDelete={() => alert('삭제하기')}
          />
        </ExContainer>
        <ExContainer
          description={`챌린지 보기 페이지 - 어드민 - 챌린지 마감  `}
        >
          <Card
            challenge={SAMPLE_CHALLENGE_CLOSED}
            detailHref="/"
            showKebab
            onEdit={() => alert('수정하기')}
            onDelete={() => alert('삭제하기')}
          />
        </ExContainer>
      </ExLayout>
    </section>
  );
}
