'use client';

import { useCallback, useMemo, useState } from 'react';

import Image from 'next/image';

import IcPageNext from '@/app/assets/icons/icon_challenge_page_next.png';
import IcPagePrev from '@/app/assets/icons/icon_challenge_page_prev.png';

import { useAdminChallengeApplications } from '@/hooks/queries/adminChallenges/queries';

import { cn } from '@/utils/cn';

import ApplicationTable from '@/components/admin/ApplicationTable';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import SearchBar from '@/components/ui/FilterBar/SearchBar';
import SortDropdown from '@/components/ui/FilterBar/Sort';
import Header from '@/components/ui/Header/Header';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 5;

const INITIAL_ADMIN_FILTER = {
  id: 'PENDING',
  type: 'status',
  value: 'PENDING',
};

// 공통 Sort가 전달하는 값을 백엔드 sort Query 값으로 변환합니다.
const SORT_QUERY_BY_OPTION_ID = {
  created_asc: 'oldest',
  created_desc: 'latest',
  deadline_asc: 'deadlineAsc',
  deadline_desc: 'deadlineDesc',
};

function getVisiblePages(currentPage, totalPages) {
  const visiblePageCount = Math.min(MAX_VISIBLE_PAGES, totalPages);
  let startPage = currentPage - Math.floor(visiblePageCount / 2);

  startPage = Math.max(1, startPage);
  startPage = Math.min(startPage, totalPages - visiblePageCount + 1);

  return Array.from(
    { length: visiblePageCount },
    (_, index) => startPage + index,
  );
}

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
        src={isPrevious ? IcPagePrev : IcPageNext}
        alt=""
        width={24}
        height={24}
        unoptimized
      />
    </button>
  );
}

function AdminPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(currentPage, totalPages);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) {
      return;
    }

    onPageChange(nextPage);
  };

  return (
    <nav
      aria-label="챌린지 신청 목록 페이지 이동"
      className="flex items-center justify-center gap-[4px]"
    >
      <PageArrowButton
        direction="previous"
        disabled={currentPage === 1}
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
                : 'text-14-regular text-gray-400 hover:bg-gray-50 hover:text-gray-800',
            )}
          >
            {page}
          </button>
        );
      })}

      <PageArrowButton
        direction="next"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      />
    </nav>
  );
}

export default function AdminManagePage() {
  const [keyword, setKeyword] = useState('');
  const [selectedOption, setSelectedOption] = useState(INITIAL_ADMIN_FILTER);
  const [currentPage, setCurrentPage] = useState(1);

  const queryParams = useMemo(() => {
    const isStatusOption = selectedOption?.type === 'status';
    const isSortOption = selectedOption?.type === 'sort';

    return {
      search: keyword || undefined,
      status: isStatusOption ? selectedOption.value : undefined,
      sort: isSortOption
        ? SORT_QUERY_BY_OPTION_ID[selectedOption.id]
        : 'latest',
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    };
  }, [currentPage, keyword, selectedOption]);

  const { data, isLoading, isError, error, isFetching } =
    useAdminChallengeApplications(queryParams);

  const applications = data?.challenges ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  const handleSearch = useCallback((nextKeyword) => {
    // 백엔드 검색어 최대 길이인 100자를 넘기지 않습니다.
    setKeyword(nextKeyword.slice(0, 100));
    setCurrentPage(1);
  }, []);

  const handleSortSelect = useCallback((nextOption) => {
    setSelectedOption(nextOption);
    setCurrentPage(1);
  }, []);

  return (
    <>
      <Header activeAdminNav="manage" />

      <main className={cn('min-h-dvh bg-white pt-[56px]', 'tablet:pt-[60px]')}>
        <div
          className={cn(
            'mx-auto w-full max-w-[996px]',
            'px-[16px] pt-[32px] pb-[48px]',
            'tablet:px-[24px]',
            'desktop:px-0',
          )}
        >
          <h1 className="text-20-semibold text-gray-800">챌린지 신청 관리</h1>

          <div className="mt-[16px] flex w-full items-center gap-[8px]">
            <div className="min-w-0 flex-1">
              <SearchBar
                placeholder="챌린지 이름을 검색해보세요"
                onSearch={handleSearch}
                className="w-full max-w-none"
              />
            </div>

            <SortDropdown onSelect={handleSortSelect} className="shrink-0" />
          </div>

          <section aria-label="챌린지 신청 목록" className="mt-[16px]">
            {isLoading ? (
              <LoadingDisplay />
            ) : isError ? (
              <ErrorDisplay
                message={
                  error?.message ?? '챌린지 신청 목록을 불러오지 못했습니다.'
                }
              />
            ) : (
              <div
                className={cn('transition-opacity', isFetching && 'opacity-60')}
              >
                <ApplicationTable applications={applications} />
              </div>
            )}
          </section>

          {!isLoading && !isError && (
            <div className="mt-[32px]">
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
