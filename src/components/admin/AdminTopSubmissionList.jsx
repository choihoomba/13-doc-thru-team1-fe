import Image from 'next/image';

import IcMedal from '@/app/assets/icons/icon_medal.svg';
import ImgUser from '@/app/assets/images/img_user.svg';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

export default function AdminTopSubmissionList({ submissions = [] }) {
  // 최다 추천작이 없으면 영역 자체를 보여주지 않습니다.
  if (submissions.length === 0) {
    return null;
  }

  return (
    <section className="mt-[16px]" aria-labelledby="top-submission-title">
      <h2 id="top-submission-title" className="sr-only">
        최다 추천 번역
      </h2>

      <div className="flex flex-col gap-[16px]">
        {submissions.map((submission) => (
          <article
            key={submission.id}
            className={cn(
              'overflow-hidden rounded-[16px]',
              'border-2 border-gray-100 bg-gray-50',
            )}
          >
            <div className="flex w-fit items-center gap-[4px] rounded-br-[14px] bg-brand-black px-[12px] py-[8px]">
              <Image src={IcMedal} width={16} height={16} alt="" />

              <span className="text-13-medium text-white">최다 추천 번역</span>
            </div>

            <div className="px-[16px] pt-[12px] pb-[16px] tablet:px-[24px]">
              <div className="flex items-center gap-[8px] border-b border-gray-200 pb-[12px]">
                <Image
                  src={ImgUser}
                  width={24}
                  height={24}
                  alt=""
                  aria-hidden="true"
                />

                <div>
                  <p className="text-14-medium text-gray-800">
                    {submission.user?.nickname || '사용자'}
                  </p>

                  <p className="text-12-medium text-gray-500">
                    {submission.user?.grade === 'GENERAL' ? '일반' : '전문가'}
                  </p>
                </div>

                <span className="text-13-medium text-gray-500">
                  추천 {submission._count?.likes ?? 0}
                </span>

                <time
                  className="ml-auto text-12-regular text-gray-400"
                  dateTime={submission.updatedAt}
                >
                  {formatDate(submission.updatedAt, true, 'slash')}
                </time>
              </div>

              <p className="mt-[16px] whitespace-pre-wrap break-words text-body-14-160 text-gray-800 tablet:text-body-16-160">
                {submission.content}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
