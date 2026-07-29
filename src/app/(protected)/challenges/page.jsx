'use client';

import { useCallback, useMemo, useState } from 'react';

import Image from 'next/image';

import iconChallengePageNext from '@/app/assets/icons/icon_challenge_page_next.png';
import iconChallengePagePrev from '@/app/assets/icons/icon_challenge_page_prev.png';

import { useChallenges } from '@/hooks/queries/challenges/queries';

import { cn } from '@/utils/cn';

import ChallengeEmptyState from '@/components/challenges/ChallengeEmptyState';
import ButtonChallengeApply from '@/components/ui/Button/ButtonChallengeApply';
import Card from '@/components/ui/Card';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import Filter from '@/components/ui/FilterBar/Filter';
import SearchBar from '@/components/ui/FilterBar/SearchBar';
import Header from '@/components/ui/Header/Header';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

// 한 페이지에 표시할 챌린지 개수입니다.
const ITEMS_PER_PAGE = 5;

// 페이지네이션에 표시할 최대 페이지 번호 개수입니다.
const MAX_VISIBLE_PAGES = 5;

// 공통 Filter의 초기 선택값입니다.
const INITIAL_FILTERS = {
  categories: [],
  docType: null,
  status: null,
};

// 현재 페이지 주변에 보여줄 페이지 번호를 계산합니다.
function getVisiblePages(currentPage, totalPages) {
  const visiblePageCount = Math.min(MAX_VISIBLE_PAGES, totalPages);

  let startPage = currentPage - Math.floor(visiblePageCount / 2);

  startPage = Math.max(1, startPage);

  const lastPossibleStartPage = totalPages - visiblePageCount + 1;

  startPage = Math.min(startPage, lastPossibleStartPage);

  return Array.from(
    { length: visiblePageCount },
    (_, index) => startPage + index,
  );
}

// 이전·다음 페이지 화살표 버튼입니다.
function PageArrowButton({ direction, disabled, onClick }) {
  const isPrevious = direction === 'previous';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={isPrevious ? '이전 페이지' : '다음 페이지'}
      className={cn(
        'flex size-[24px] items-center justify-center',
        'disabled:cursor-default disabled:opacity-30',
      )}
    >
      <Image
        src={isPrevious ? iconChallengePagePrev : iconChallengePageNext}
        alt=""
        width={24}
        height={24}
        unoptimized
      />
    </button>
  );
}

// 챌린지 목록 페이지 내부에서 사용하는 페이지네이션입니다.
function ChallengePagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) {
      return;
    }

    onPageChange(nextPage);
  };

  return (
    <nav
      aria-label="챌린지 목록 페이지 이동"
      className="flex items-center justify-center gap-[4px]"
    >
      <PageArrowButton
        direction="previous"
        disabled={isFirstPage}
        onClick={() => handlePageChange(currentPage - 1)}
      />

      {visiblePages.map((page) => {
        const isCurrentPage = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => handlePageChange(page)}
            aria-label={`${page}페이지로 이동`}
            aria-current={isCurrentPage ? 'page' : undefined}
            className={cn(
              'flex size-[40px] items-center justify-center',
              'rounded-[8px] transition-colors',
              isCurrentPage
                ? 'bg-brand-black text-14-semibold text-brand-yellow'
                : [
                    'text-14-regular text-gray-400',
                    'hover:bg-gray-50 hover:text-gray-800',
                  ],
            )}
          >
            {page}
          </button>
        );
      })}

      <PageArrowButton
        direction="next"
        disabled={isLastPage}
        onClick={() => handlePageChange(currentPage + 1)}
      />
    </nav>
  );
}

export default function ChallengesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);

  // 공통 Filter의 IN_PROGRESS를 백엔드 APPROVED로 변환합니다.
  const apiStatus =
    appliedFilters.status === 'IN_PROGRESS'
      ? 'APPROVED'
      : appliedFilters.status;

  // API 요청에 사용할 Query String 조건입니다.
  const queryParams = useMemo(
    () => ({
      view: 'public',
      search: keyword.trim() || undefined,

      // 복수 field 지원 appliedFilters.categories 전체를 전달합니다.
      field: appliedFilters.categories.length
        ? appliedFilters.categories
        : undefined,

      docType: appliedFilters.docType || undefined,
      status: apiStatus || undefined,
      sort: 'latest',
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    }),
    [apiStatus, appliedFilters, currentPage, keyword],
  );

  // Query 조건이 변경되면 TanStack Query가 자동으로 재요청합니다.
<<<<<<< HEAD
  const { data, isPending, isError, error } = useChallenges(queryParams);
=======
  const { data, isLoading, isError, error } = useChallenges(queryParams);
>>>>>>> a124381 (챌린지 목록페이지 (#75))

  // getChallenges가 response.data를 반환하므로 바로 꺼낼 수 있습니다.
  const currentChallenges = data?.challenges ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  // API 요청 성공 후 결과가 0개인지 확인합니다.
<<<<<<< HEAD
  const isEmpty = !isPending && !isError && currentChallenges.length === 0;

  // 로딩, 에러, 빈 화면은 목록 영역의 가운데에 표시합니다.
  const isCenteredState = isPending || isError || isEmpty;
=======
  const isEmpty = !isLoading && !isError && currentChallenges.length === 0;

  // 로딩, 에러, 빈 화면은 목록 영역의 가운데에 표시합니다.
  const isCenteredState = isLoading || isError || isEmpty;
>>>>>>> a124381 (챌린지 목록페이지 (#75))

  // SearchBar가 전달한 검색어를 저장하고 첫 페이지로 이동합니다.
  const handleSearch = useCallback((nextKeyword) => {
    setKeyword(nextKeyword);
    setCurrentPage(1);
  }, []);

  // Filter에서 적용한 조건을 저장하고 첫 페이지로 이동합니다.
  const handleApplyFilters = useCallback((nextFilters) => {
    setAppliedFilters(nextFilters);
    setCurrentPage(1);
  }, []);

  return (
    <>
      <Header />

      <main
        className={cn(
          'flex min-h-dvh flex-col bg-white',
          'pt-[56px]',
          'tablet:pt-[60px]',
        )}
      >
        <div
          className={cn(
            'mx-auto flex w-full max-w-[996px] flex-1 flex-col',
            'px-[16px]',
            'tablet:px-[24px]',
            'desktop:px-0',
          )}
        >
          <section
            aria-labelledby="challenge-list-title"
            className="shrink-0 pt-[24px]"
          >
            <div className="flex items-center justify-between gap-[12px]">
              <h1
                id="challenge-list-title"
                className="text-20-semibold text-gray-800"
              >
                챌린지 목록
              </h1>

              <ButtonChallengeApply href="/challenges/new" />
            </div>

            <div className="mt-[16px] flex w-full items-center gap-[8px]">
              <Filter
                appliedFilters={appliedFilters}
                onApply={handleApplyFilters}
                className="shrink-0"
              />

              <div className="min-w-0 flex-1">
                <SearchBar
                  placeholder="챌린지 이름을 검색해보세요"
                  onSearch={handleSearch}
                  className="w-full max-w-none"
                />
              </div>
            </div>
          </section>

          <section
            aria-label="챌린지 목록"
            className={cn(
              'flex w-full flex-1',
              isCenteredState
                ? 'items-center justify-center'
                : 'flex-col items-stretch pt-[16px]',
            )}
          >
<<<<<<< HEAD
            {isPending ? (
=======
            {isLoading ? (
>>>>>>> a124381 (챌린지 목록페이지 (#75))
              <LoadingDisplay />
            ) : isError ? (
              <ErrorDisplay
                message={error?.message ?? '챌린지 목록을 불러오지 못했습니다.'}
              />
            ) : isEmpty ? (
              <ChallengeEmptyState />
            ) : (
              <>
                <div className="flex w-full flex-col gap-[24px]">
                  {currentChallenges.map((challenge) => {
                    // CLOSED이거나 참여 인원이 가득 찼을 때만 상태 칩을 표시합니다.
                    const showStatusChip =
                      challenge.status === 'CLOSED' ||
                      challenge.currentParticipants >=
                        challenge.maxParticipants;

                    return (
                      <Card
                        key={challenge.id}
                        challenge={challenge}
                        detailHref={`/challenges/${challenge.id}`}
                        showStatusChip={showStatusChip}
                      />
                    );
                  })}
                </div>

                <div className="mt-[32px] pb-[40px]">
                  <ChallengePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
