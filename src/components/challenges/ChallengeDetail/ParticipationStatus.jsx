'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import IcCrown from '@/app/assets/icons/ic_crown.svg';
import IcRightBracket from '@/app/assets/icons/icon_right_angle_bracket_black.svg';
import IcRightBracketSm from '@/app/assets/icons/icon_right_angle_bracket_black_sm.svg';
import ImgUser from '@/app/assets/images/img_user.svg';

import { useSubmissions } from '@/hooks/queries/submissions/queries';

import buildRanks from '@/utils/buildRanks';
import { cn } from '@/utils/cn';

import ButtonLike from '@/components/ui/Button/ButtonLike';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

const LIMIT = 5;

export default function ParticipationStatus({ challengeId }) {
  const [page, setPage] = useState(1);
  // 페이지 경계에서도 순위가 이어지도록 이전 페이지 마지막 항목의 순위/좋아요 수를 기억
  const [pageBoundaries, setPageBoundaries] = useState({});
  const { data, isPending, isError } = useSubmissions({
    challengeId,
    page,
    limit: LIMIT,
  });

  const ranks = useMemo(() => {
    if (!data?.submissions?.length) return [];

    const prevBoundary = pageBoundaries[page - 1];
    const baseRank =
      page === 1
        ? 1
        : prevBoundary
          ? prevBoundary.lastLikes === data.submissions[0]._count.likes
            ? prevBoundary.lastRank
            : prevBoundary.lastRank + 1
          : (page - 1) * LIMIT + 1;

    return buildRanks(data.submissions, baseRank);
  }, [data, page, pageBoundaries]);

  // 다음 페이지 계산에 쓸 수 있도록 이번 페이지의 마지막 순위/좋아요 수를 기록
  if (data?.submissions?.length && ranks.length) {
    const lastSubmission = data.submissions[data.submissions.length - 1];
    const lastRank = ranks[ranks.length - 1];

    if (
      pageBoundaries[page]?.lastRank !== lastRank ||
      pageBoundaries[page]?.lastLikes !== lastSubmission._count.likes
    ) {
      setPageBoundaries((prev) => ({
        ...prev,
        [page]: { lastLikes: lastSubmission._count.likes, lastRank },
      }));
    }
  }

  if (isPending) return <LoadingDisplay />;
  if (isError) return <ErrorDisplay />;

  const { submissions, pagination } = data;
  const totalPages = Math.max(1, Math.ceil(pagination.totalCount / LIMIT));

  return (
    <section
      className={cn(
        'px-[16px] py-[16px_24px] border-2 rounded-[16px] border-gray-800 bg-white',
        'tablet:px-[24px] tablet:py-[21px_24px]',
      )}
    >
      {/* 헤더 섹션 */}
      <header className={cn('flex items-center justify-between')}>
        <h2
          className={cn(
            'text-16-semibold text-gray-800',
            'tablet:text-18-semibold',
          )}
        >
          참여 현황
        </h2>

        {/* 페이네이션 + 네비게이터 : 6개 이상일 때부터 노출 */}
        {pagination.totalCount > 5 && (
          <div className={cn('flex items-center mt-[-9px]')}>
            {/* 현재 페이지 / 총 페이지 */}
            <span
              className={cn(
                'inline-flex items-center justify-center px-[18px] py-[4px] mr-[8px] rounded-[13px] bg-gray-50 text-13-medium',
              )}
            >
              <span className={cn('text-brand-yellow')}>{page}</span>{' '}
              <span className={cn('ml-[4px] text-gray-800')}>
                / {totalPages}
              </span>
            </span>
            {/* 페이지네이션 버튼 그룹 */}
            <div className={cn('flex items-center')}>
              <button
                className={cn('cursor-pointer', page <= 1 && 'opacity-20')}
                type="button"
                aria-label="참여 현황 이전 페이지 버튼"
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                <Image
                  className={cn('rotate-180')}
                  src={IcRightBracket}
                  width={32}
                  height={32}
                  alt=""
                />
              </button>
              <button
                className={cn(
                  'cursor-pointer',
                  !pagination.hasMore && 'opacity-20',
                )}
                type="button"
                aria-label="참여 현황 다음 페이지 버튼"
                disabled={!pagination.hasMore}
                onClick={() => setPage((prev) => prev + 1)}
              >
                <Image src={IcRightBracket} width={32} height={32} alt="" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 참여 현황 리스트 */}
      {data?.submissions?.length < 1 ? (
        // 참여 현황 리스트 없음
        <p
          className={cn(
            'mt-[31px] mb-[49px] text-14-regular text-gray-500 text-center',
            'tablet:mt-[22px] tablet:mb-[42px] tablet:text-16-regular',
          )}
        >
          아직 참여한 도전자가 없어요,
          <br /> 지금 바로 도전해보세요!
        </p>
      ) : (
        // 참여 현황 리스트
        <ul>
          {submissions.map((s, i) => {
            const rank = ranks[i];
            return (
              <li key={s.id}>
                <Link
                  className={cn(
                    'grid grid-cols-[63fr_105fr_70fr_73fr] items-center pt-[12px]',
                    'tablet:grid-cols-[75fr_389fr_111fr_73fr]',
                    'desktop:grid-cols-[75fr_583fr_111fr_73fr]',
                    i === submissions.length - 1 ? 'pb-0' : 'pb-[12px]',
                    i !== submissions.length - 1 && 'border-b border-gray-200',
                  )}
                  href={`/submissions/${s.id}`}
                >
                  {/* 랭킹 */}
                  <div
                    className={cn(
                      'inline-flex items-center justify-center gap-[2px] w-fit min-w-[51px] px-[7px] py-[2px] rounded-[16px] bg-gray-800',
                    )}
                  >
                    {rank === 1 && (
                      <Image src={IcCrown} width={16} height={16} alt="" />
                    )}
                    <p className={cn('text-14-medium text-brand-yellow')}>
                      {rank < 10 ? `0${rank}` : rank}
                    </p>
                  </div>

                  {/* 유저 정보 */}
                  <div className={cn('flex items-center gap-[10px]')}>
                    <Image
                      src={ImgUser}
                      width={24}
                      height={24}
                      alt={`${s.user.nickname} 이미지`}
                    />
                    <div
                      className={cn(
                        'flex flex-col gap-[4px]',
                        'tablet:gap-[2px]',
                      )}
                    >
                      <p
                        className={cn(
                          'text-13-medium text-gray-800',
                          'tablet:text-14-medium',
                        )}
                      >
                        {s.user.nickname}
                      </p>
                      <p className={cn('text-12-medium text-gray-500')}>
                        {s.user.grade === 'GENERAL' ? '일반' : '전문가'}
                      </p>
                    </div>
                  </div>

                  {/* 좋아요 수 */}
                  <ButtonLike
                    className={cn(
                      'text-13-medium text-gray-500',
                      'tablet:text-14-medium',
                    )}
                    count={s._count.likes}
                    status={s.isLiked ? 'active' : 'inactive'}
                    disabled
                  />

                  {/* 작업물 보기 버튼 */}
                  <div
                    className={cn(
                      'flex items-center gap-[2px] text-12-medium text-nowrap ml-auto',
                    )}
                  >
                    작업물 보기
                    <Image
                      src={IcRightBracketSm}
                      width={16}
                      height={16}
                      alt=""
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
