'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useChallenges } from '@/hooks/queries/challenges/queries1';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import ChipStatus from '@/components/ui/Chip/ChipStatus';
import Sort from '@/components/ui/FilterBar/Sort';

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

const DEFAULT_SORT = { field: 'createdAt', order: 'desc' };

/** 테이블 열 너비. 헤더와 본문이 같은 값을 써야 정렬이 맞는다 */
const GRID_COLS =
  'grid-cols-[68px_84px_84px_minmax(200px,1fr)_94px_94px_94px_120px]';

/**
 * 신청한 챌린지 목록
 *
 * 참여중·완료한 탭은 카드+무한스크롤이지만, 신청한 탭은 피그마상 표 형태이고
 * 페이지네이션을 사용하므로 별도 구조로 구현한다.
 *
 * @param search 상위 탭 페이지의 검색어
 */
export default function AppliedChallenges({ search }) {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(null);
  const [sortOption, setSortOption] = useState(DEFAULT_SORT);

  const { data, isLoading, isError } = useChallenges({
    view: 'applied',
    page: currentPage,
    limit: 10,
    search,
    status,
    sortBy: sortOption.field,
    sortOrder: sortOption.order,
  });

  const challenges = data?.challenges ?? [];
  const pagination = data?.pagination;

  // 신청 상태별로 확인 화면이 달라 상태에 맞는 경로로 이동한다
  const handleRowClick = (item) => {
    const basePath = `/challenges/mine/applied/${item.id}`;

    if (item.status === 'PENDING') {
      router.push(`${basePath}/pending`);
    } else if (item.status === 'REJECTED') {
      router.push(`${basePath}/rejected`);
    } else if (item.status === 'DELETED') {
      router.push(`${basePath}/deleted`);
    } else {
      router.push(basePath);
    }
  };

  const handleSortSelect = (option) => {
    if (!option) return;

    if (option.type === 'sort') {
      setSortOption({ field: option.field, order: option.order });
    } else if (option.type === 'status') {
      setStatus(option.value);
    }
    setCurrentPage(1);
  };

  return (
    <div className={cn('flex flex-col mt-[16px]', 'tablet:mt-[24px]')}>
      <div className="mb-[16px] flex justify-end">
        <Sort onSelect={handleSortSelect} />
      </div>

      {/* 열 너비가 고정이라 좁은 화면에서는 가로 스크롤로 표를 유지한다 */}
      <div className="overflow-x-auto">
        <div className="min-w-[796px] overflow-hidden rounded-[10px]">
          <div
            className={cn(
              'grid rounded-[10px] bg-gray-800 py-3 text-center text-14-medium text-white',
              GRID_COLS,
            )}
          >
            <div>No.</div>
            <div>분야</div>
            <div>카테고리</div>
            <div className="px-2 text-left">챌린지 제목</div>
            <div>모집 인원</div>
            <div>신청일</div>
            <div>마감 기한</div>
            <div>상태</div>
          </div>

          {isLoading ? (
            <p className="py-[80px] text-center text-14-medium text-gray-500">
              데이터를 불러오는 중입니다...
            </p>
          ) : isError ? (
            <p className="py-[80px] text-center text-14-medium text-red-error">
              신청한 챌린지를 불러오지 못했어요.
            </p>
          ) : challenges.length === 0 ? (
            <p className="py-[80px] text-center text-14-medium text-gray-500">
              신청한 챌린지가 없어요.
            </p>
          ) : (
            challenges.map((item) => (
              <div
                key={item.id}
                onClick={() => handleRowClick(item)}
                className={cn(
                  'grid cursor-pointer items-center border-b border-gray-200 py-4 text-center',
                  'transition-colors hover:bg-gray-50',
                  GRID_COLS,
                )}
              >
                <div className="truncate text-13-regular text-gray-500">
                  {item.id}
                </div>
                <div className="truncate text-13-regular text-gray-500">
                  {FIELD_LABEL_MAP[item.field] ?? item.field}
                </div>
                <div className="truncate text-13-regular text-gray-500">
                  {DOC_TYPE_LABEL_MAP[item.docType] ?? item.docType}
                </div>
                <div className="truncate px-2 text-left text-13-medium text-gray-700">
                  {item.title}
                </div>
                <div className="truncate text-13-regular text-gray-500">
                  {item.currentParticipants}/{item.maxParticipants}
                </div>
                <div className="truncate text-13-regular text-gray-500">
                  {formatDate(item.createdAt)}
                </div>
                <div className="truncate text-13-regular text-gray-500">
                  {formatDate(item.deadline)}
                </div>
                <div className="flex items-center justify-center">
                  <ChipStatus status={item.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-[32px] flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
            className="p-2 text-14-regular text-gray-500 hover:text-black disabled:opacity-30"
          >
            &lt;
          </button>

          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => i + 1,
          ).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded text-13-medium transition-colors',
                currentPage === pageNum
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-500 hover:bg-gray-100',
              )}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            onClick={() =>
              setCurrentPage((p) =>
                !pagination || p >= pagination.totalPages ? p : p + 1,
              )
            }
            disabled={!pagination || currentPage >= pagination.totalPages}
            aria-label="다음 페이지"
            className="p-2 text-14-regular text-gray-500 hover:text-black disabled:opacity-30"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
