'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useChallenges } from '@/hooks/queries/challenges/queries';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import Filter from '@/components/ui/FilterBar/Filter.jsx';
import SearchBar from '@/components/ui/FilterBar/SearchBar.jsx';
import Sort from '@/components/ui/FilterBar/Sort.jsx';

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

const STATUS_LABEL_MAP = {
  PENDING: '승인 대기',
  APPROVED: '신청 승인',
  CLOSED: '신청 승인',
  REJECTED: '신청 거절',
  DELETED: '챌린지 삭제',
};

const DEFAULT_FILTERS = {
  categories: [],
  docType: null,
  status: null,
};

const DEFAULT_SORT = { field: 'createdAt', order: 'desc' };

export default function MyChallengePage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [sortOption, setSortOption] = useState(DEFAULT_SORT);

  const { data, isLoading, isError } = useChallenges({
    view: 'applied',
    page: currentPage,
    limit: 10,
    search: searchTerm,
    categories: filters.categories,
    docType: filters.docType,
    status: filters.status,
    sortBy: sortOption.field,
    sortOrder: sortOption.order,
  });

  const challenges = data?.challenges ?? [];
  const pagination = data?.pagination;

  const handleNewChallengeClick = () => {
    router.push('/challenges/[id]/applied');
  };

  const handleRowClick = (item) => {
    if (item.status === 'PENDING') {
      router.push(`/challenges/[id]/applied/${item.id}/pending`);
    } else if (item.status === 'REJECTED') {
      router.push(`/challenges/[id]/applied/${item.id}/rejected`);
    } else if (item.status === 'DELETED') {
      router.push(`/challenges/[id]/applied/${item.id}/deleted`);
    } else {
      router.push(`/challenges/[id]/applied/${item.id}`);
    }
  };

  const renderStatusBadge = (status) => {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-600';

    if (status === 'PENDING') {
      bgColor = 'bg-[#FFFDE7]';
      textColor = 'text-[#F2BC00]';
    } else if (status === 'APPROVED') {
      bgColor = 'bg-[#DFF0FF]';
      textColor = 'text-[#4095DE]';
    } else if (status === 'CLOSED' || status === 'REJECTED') {
      bgColor = 'bg-[#FFF0F0]';
      textColor = 'text-[#E54946]';
    } else if (status === 'DELETED') {
      bgColor = 'bg-[#E5E5E5]';
      textColor = 'text-[#737373]';
    }

    return (
      <span
        className={cn(
          'rounded-md px-2 py-1.5 text-13-semibold leading-none tracking-normal',
          bgColor,
          textColor,
        )}
      >
        {STATUS_LABEL_MAP[status] ?? status}
      </span>
    );
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleApplyFilter = (nextFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const handleSortSelect = (option) => {
    if (!option) return;

    if (option.type === 'sort') {
      setSortOption({ field: option.field, order: option.order });
    } else if (option.type === 'status') {
      setFilters((prev) => ({ ...prev, status: option.value }));
    }
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto max-w-5xl p-8 font-pretendard">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-24-bold text-gray-900">나의 챌린지</h1>
        <button
          onClick={handleNewChallengeClick}
          className="rounded-[19.5px] bg-gray-800 px-4 py-2 text-14-medium text-white transition-colors hover:bg-gray-700"
        >
          신규 챌린지 신청 +
        </button>
      </div>

      <div className="mb-6 flex space-x-6 border-b border-gray-200 text-14-medium text-gray-500">
        <button className="pb-2 transition-colors hover:text-gray-800">
          참여중인 챌린지
        </button>
        <button className="pb-2 transition-colors hover:text-gray-800">
          완료한 챌린지
        </button>
        <button className="border-b-2 border-black pb-2 text-14-bold text-black">
          신청한 챌린지
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex-1">
          <SearchBar
            onSearch={handleSearch}
            placeholder="챌린지 이름을 검색해보세요"
          />
        </div>
        <div className="flex gap-2">
          <Filter appliedFilters={filters} onApply={handleApplyFilter} />
          <Sort onSelect={handleSortSelect} />
        </div>
      </div>

      <div className="min-h-120 w-249 overflow-hidden rounded-[10px] border-t border-gray-200">
        <div className="grid grid-cols-[68px_84px_84px_358px_94px_94px_94px_120px] rounded-[10px] border-b border-gray-200 bg-gray-800 py-3 text-center text-14-medium text-white">
          <div>No.</div>
          <div>분야</div>
          <div>카테고리</div>
          <div className="px-2 text-left">챌린지 제목</div>
          <div>모집 인원</div>
          <div>신청일</div>
          <div>마감 기한</div>
          <div>상태</div>
        </div>
        <div className="h-3 w-full"></div>

        {isLoading ? (
          <div className="flex h-108 items-center justify-center text-center text-14-regular text-gray-500">
            데이터를 불러오는 중입니다...
          </div>
        ) : isError ? (
          <div className="flex h-108 items-center justify-center text-center text-14-regular text-red-error">
            데이터를 불러오는 데 실패했습니다.
          </div>
        ) : challenges.length === 0 ? (
          <div className="flex h-108 items-center justify-center text-center text-14-regular text-gray-500">
            신청한 챌린지가 없습니다.
          </div>
        ) : (
          challenges.map((item) => (
            <div
              key={item.id}
              onClick={() => handleRowClick(item)}
              className="grid grid-cols-[68px_84px_84px_358px_94px_94px_94px_120px] cursor-pointer items-center border-b border-gray-200 py-4 text-center transition-colors hover:bg-gray-50"
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
                {renderStatusBadge(item.status)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 flex items-center justify-center space-x-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-2 text-14-regular text-gray-500 hover:text-black disabled:opacity-30"
        >
          &lt;
        </button>

        {pagination &&
          Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
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
            );
          })}

        <button
          onClick={() =>
            setCurrentPage((p) =>
              !pagination || p >= pagination.totalPages ? p : p + 1,
            )
          }
          disabled={!pagination || currentPage >= pagination.totalPages}
          className="p-2 text-14-regular text-gray-500 hover:text-black disabled:opacity-30"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
