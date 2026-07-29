'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import deadlineIcon from '@/app/assets/icons/ic_deadline.svg';
import personIcon from '@/app/assets/icons/ic_person.svg';

import { useChallenge } from '@/hooks/queries/challenges/queries1';

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

export default function ChallengeDeletedPage() {
  const router = useRouter();
  const params = useParams();
  const challengeId = Number(params.id);

  const { data: challenge, isLoading, isError } = useChallenge(challengeId);

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
    <div className="mx-auto max-w-4xl px-4 py-10 font-pretendard">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-14-regular text-gray-500 transition-colors hover:text-black"
      >
        &lt; &nbsp;목록으로 돌아가기
      </button>

      <div className="mx-auto mb-6 flex h-[35px] w-[890px] items-center justify-center rounded-full bg-[#757575] shadow-sm">
        <span className="flex h-[19px] items-center justify-center text-center text-16-semibold text-[#FAFAFA]">
          삭제된 챌린지입니다.
        </span>
      </div>

      <div className="mb-10 w-full rounded-xl border border-gray-200 bg-gray-50 p-8">
        <h3 className="mb-4 text-center text-18-bold text-gray-900">
          삭제 사유
        </h3>

        <p className="text-center text-14-regular text-gray-700 md:text-16-regular">
          {challenge.reason ?? '삭제 사유가 등록되지 않았습니다.'}
        </p>

        <p className="mt-6 text-right text-14-regular text-gray-400">
          {challenge.deletedAt ? formatDate(challenge.deletedAt, true) : '-'}
        </p>
      </div>

      <hr className="mb-4 border-gray-200" />

      <div className="mb-8">
        <h1 className="mb-4 text-24-bold text-gray-900">{challenge.title}</h1>

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
    </div>
  );
}
