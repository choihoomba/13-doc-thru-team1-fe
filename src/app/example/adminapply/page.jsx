'use client';

import { useCallback, useMemo, useState } from 'react';

import Image from 'next/image';

import icon_challenge_page_next from '@/app/assets/icons/icon_challenge_page_next.png';
import icon_challenge_page_prev from '@/app/assets/icons/icon_challenge_page_prev.png';

import { cn } from '@/utils/cn';

import ApplicationTable from '@/components/admin/ApplicationTable';
import SearchBar from '@/components/ui/FilterBar/SearchBar';
import SortDropdown from '@/components/ui/FilterBar/Sort';
import Header from '@/components/ui/Header/Header';

// 한 페이지에 표시할 신청 개수입니다.
const ITEMS_PER_PAGE = 10;

// 페이지네이션에 한 번에 표시할 페이지 번호 개수입니다.
const MAX_VISIBLE_PAGES = 5;

// API 연결 전 화면을 확인하기 위한 임시 데이터입니다.
const BASE_APPLICATIONS = [
  {
    id: 1023,
    docType: 'OFFICIAL',
    field: 'NEXTJS',
    title: 'Next.js - App Router: Routing Fundamentals',
    maxParticipants: 10,
    createdAt: '2024-01-16',
    deadline: '2024-02-24',
    status: 'PENDING',
  },
  {
    id: 1022,
    docType: 'BLOG',
    field: 'API',
    title: 'Fetch API, 너는 에러를 제대로 핸들링 하고 있는가?(dailydev)',
    maxParticipants: 5,
    createdAt: '2024-01-16',
    deadline: '2024-02-23',
    status: 'PENDING',
  },
  {
    id: 1021,
    docType: 'OFFICIAL',
    field: 'API',
    title: 'Fetch API, 너는 에러를 제대로 핸들링 하고 있는가?(dailydev)',
    maxParticipants: 10,
    createdAt: '2024-01-16',
    deadline: '2024-02-22',
    status: 'PENDING',
  },
  {
    id: 1020,
    docType: 'BLOG',
    field: 'CAREER',
    title: '개발자로서 자신만의 브랜드를 구축하는 방법(dailydev)',
    maxParticipants: 5,
    createdAt: '2024-01-16',
    deadline: '2024-02-22',
    status: 'REJECTED',
  },
  {
    id: 1019,
    docType: 'OFFICIAL',
    field: 'NEXTJS',
    title: 'Next.js - App Router: Routing Fundamentals',
    maxParticipants: 10,
    createdAt: '2024-01-16',
    deadline: '2024-02-22',
    status: 'APPROVED',
  },
  {
    id: 1018,
    docType: 'OFFICIAL',
    field: 'API',
    title: 'Fetch API, 너는 에러를 제대로 핸들링 하고 있는가?(dailydev)',
    maxParticipants: 5,
    createdAt: '2024-01-16',
    deadline: '2024-02-22',
    status: 'REJECTED',
  },
  {
    id: 1017,
    docType: 'OFFICIAL',
    field: 'API',
    title: 'Fetch API, 너는 에러를 제대로 핸들링 하고 있는가?(dailydev)',
    maxParticipants: 10,
    createdAt: '2024-01-16',
    deadline: '2024-02-22',
    status: 'APPROVED',
  },
  {
    id: 1016,
    docType: 'BLOG',
    field: 'CAREER',
    title: '개발자로서 자신만의 브랜드를 구축하는 방법(dailydev)',
    maxParticipants: 5,
    createdAt: '2024-01-16',
    deadline: '2024-02-22',
    status: 'APPROVED',
  },
  {
    id: 1015,
    docType: 'BLOG',
    field: 'NEXTJS',
    title: 'Next.js - App Router: Routing Fundamentals',
    maxParticipants: 10,
    createdAt: '2024-01-16',
    deadline: '2024-02-22',
    status: 'APPROVED',
  },
  {
    id: 1014,
    docType: 'BLOG',
    field: 'NEXTJS',
    title: 'Next.js - App Router: Routing Fundamentals',
    maxParticipants: 10,
    createdAt: '2024-01-16',
    deadline: '2024-02-22',
    status: 'DELETED',
  },
];

// 페이지네이션을 테스트할 수 있도록 5페이지 분량으로 복사합니다.
const MOCK_APPLICATIONS = Array.from(
  { length: ITEMS_PER_PAGE * 5 },
  (_, index) => {
    const application = BASE_APPLICATIONS[index % BASE_APPLICATIONS.length];

    return {
      ...application,
      id: 1023 - index,
    };
  },
);

// 현재 페이지 주변에 표시할 페이지 번호를 계산합니다.
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

function PageArrowButton({ direction, disabled, onClick }) {
  const isPrev = direction === 'prev';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={isPrev ? '이전 페이지' : '다음 페이지'}
      className={cn(
        'flex size-[24px] items-center justify-center',
        'disabled:cursor-default disabled:opacity-30',
      )}
    >
      <Image
        src={isPrev ? icon_challenge_page_prev : icon_challenge_page_next}
        alt=""
        width={24}
        height={24}
        unoptimized
      />
    </button>
  );
}

// 어드민 신청 관리 페이지 안에서만 사용하는 페이지네이션입니다.
function AdminPagination({ currentPage, totalPages, onPageChange }) {
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
      aria-label="챌린지 신청 목록 페이지 이동"
      className="flex items-center justify-center gap-[4px]"
    >
      <PageArrowButton
        direction="prev"
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
                : 'text-14-regular text-gray-400 hover:bg-gray-50 hover:text-gray-800',
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

export default function AdminManagePage() {
  const [keyword, setKeyword] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // SearchBar가 전달한 문자열을 검색어로 저장합니다.
  const handleSearch = useCallback((nextKeyword) => {
    setKeyword(nextKeyword);
    setCurrentPage(1);
  }, []);

  // Sort가 전달한 상태 또는 정렬 조건을 저장합니다.
  const handleSortSelect = useCallback((nextOption) => {
    setSelectedOption(nextOption);
    setCurrentPage(1);
  }, []);

  // 검색어, 상태, 정렬 조건에 맞는 신청 목록을 계산합니다.
  const filteredApplications = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    let nextApplications = MOCK_APPLICATIONS.filter((application) => {
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        application.title.toLowerCase().includes(normalizedKeyword);

      const matchesStatus =
        selectedOption?.type !== 'status' ||
        application.status === selectedOption.value;

      return matchesKeyword && matchesStatus;
    });

    if (selectedOption?.type === 'sort') {
      nextApplications = [...nextApplications].sort((first, second) => {
        const firstValue = new Date(first[selectedOption.field]).getTime();
        const secondValue = new Date(second[selectedOption.field]).getTime();

        return selectedOption.order === 'asc'
          ? firstValue - secondValue
          : secondValue - firstValue;
      });
    }

    return nextApplications;
  }, [keyword, selectedOption]);

  // 필터링된 목록을 기준으로 전체 페이지 수를 계산합니다.
  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);

  // 현재 페이지에서 시작할 배열 위치를 계산합니다.
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  // 현재 페이지에서 보여줄 신청 데이터만 잘라냅니다.
  const currentApplications = filteredApplications.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

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

          <div className="mt-[16px]">
            <ApplicationTable applications={currentApplications} />
          </div>

          <div className="mt-[32px]">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>
    </>
  );
}
