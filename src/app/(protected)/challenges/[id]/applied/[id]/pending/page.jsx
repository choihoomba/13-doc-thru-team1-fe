'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import deadlineIcon from '@/app/assets/icons/ic_deadline.svg';
import personIcon from '@/app/assets/icons/ic_person.svg';
import check from '@/app/assets/icons/icon_check.svg';
import kebabIcon from '@/app/assets/icons/icon_kebab.svg';

import { useCancelChallenge } from '@/hooks/queries/challenges/mutations';
import { useChallenge } from '@/hooks/queries/challenges/queries';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

const FIELD_LABEL_MAP = {
  NEXTJS: 'Next.js',
  REACT: 'React',
  MODERNJS: 'Modern JS',
  TYPESCRIPT: 'TypeScript',
  API: 'API',
  WEB: 'Web',
  CAREER: 'Career',
};

const DOC_TYPE_LABEL_MAP = {
  OFFICIAL: '공식문서',
  BLOG: '블로그',
  BOOK: '도서',
  ETC: '기타',
};

export default function ChallengePendingPage() {
  const router = useRouter();
  const params = useParams();
  const challengeId = Number(params.id);

  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: challenge, isLoading, isError } = useChallenge(challengeId);
  const { mutate: cancelChallenge, isPending: isCanceling } =
    useCancelChallenge();

  const handleConfirmCancel = () => {
    cancelChallenge(challengeId, {
      onSuccess: () => {
        setIsModalOpen(false);
        alert('신청이 취소되었습니다.');
        router.push('/challenges/[id]/applied');
      },
      onError: (error) => {
        setIsModalOpen(false);
        console.error('취소 오류:', error);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-16-regular text-gray-500">
        불러오는 중입니다...
      </div>
    );
  }

  if (isError || !challenge) {
    return (
      <div className="py-20 text-center text-16-regular text-red-error">
        챌린지 정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-10 font-pretendard">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-14-regular text-gray-500 transition-colors hover:text-black"
      >
        &lt; &nbsp;목록으로 돌아가기
      </button>

      <div className="mx-auto mb-6 flex h-[35px] w-[890px] items-center justify-center rounded-full bg-[#FFFDE7] shadow-sm">
        <span className="flex h-[19px] items-center justify-center text-center text-16-semibold text-[#F2BC00]">
          승인 대기 중입니다.
        </span>
      </div>

      <div className="relative mb-6">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h1 className="text-24-bold text-gray-900">{challenge.title}</h1>

          <div className="relative">
            <button
              onClick={() => setIsKebabOpen(!isKebabOpen)}
              className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100"
              aria-label="더보기 메뉴"
            >
              <Image src={kebabIcon} alt="더보기 메뉴" width={24} height={24} />
            </button>

            {isKebabOpen && (
              <div className="absolute right-0 z-10 mt-2 w-32 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                <button
                  onClick={() => {
                    setIsKebabOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="m-1 w-[calc(100%-8px)] rounded-md px-4 py-2.5 text-center text-14-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  취소하기
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span
            className={cn(
              'flex h-[26px] w-[76px] items-center justify-center rounded-md bg-[#78F867] text-[14px] font-bold text-gray-600',
            )}
            style={{ fontFamily: 'Quantico, sans-serif' }}
          >
            {FIELD_LABEL_MAP[challenge.field] ?? challenge.field}
          </span>
          <span
            className={cn(
              'flex h-[26px] w-[59px] items-center justify-center rounded-[8px] border border-gray-300 bg-white px-[7px] py-[5px] text-13-medium text-gray-600',
            )}
          >
            {DOC_TYPE_LABEL_MAP[challenge.docType] ?? challenge.docType}
          </span>
        </div>

        <p className="mb-6 text-body-16-130 text-gray-700">
          {challenge.content}
        </p>

        <div className="mb-4 flex items-center gap-6 text-14-regular text-gray-600">
          <div className="flex items-center gap-1.5">
            <Image src={deadlineIcon} alt="마감 기한" width={24} height={24} />
            <span>
              {challenge.deadline
                ? `${formatDate(challenge.deadline)} 마감`
                : '-'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Image src={personIcon} alt="현재참여인원" width={24} height={24} />
            <span>{challenge.maxParticipants}명</span>
          </div>
        </div>
      </div>

      <hr className="mb-4 border-gray-200" />

      <div>
        <h3 className="mb-4 text-18-bold text-gray-900">원본 링크</h3>

        <div className="relative h-100 w-full overflow-hidden rounded-lg border border-gray-200 bg-black shadow-md">
          <a
            href={challenge.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-14-medium text-gray-800 shadow-lg transition-all hover:bg-white"
          >
            링크 열기 ↗
          </a>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm transform rounded-2xl bg-white p-6 text-center shadow-xl transition-all">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#262626] text-white">
              <Image src={check} alt="모달체크" width={24} height={24} />
            </div>

            <h3 className="mb-6 text-16-semibold text-gray-900">
              정말 취소하시겠어요?
            </h3>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isCanceling}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-14-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                아니오
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCanceling}
                className="flex-1 rounded-lg bg-[#262626] py-2.5 text-14-medium text-white transition-colors hover:bg-black disabled:opacity-50"
              >
                {isCanceling ? '처리 중...' : '네'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
