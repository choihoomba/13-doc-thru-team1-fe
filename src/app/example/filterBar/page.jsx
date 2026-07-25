// [my-app\src\app\test-page\page.js]
'use client';

import { useState, useMemo } from 'react';

import Filter from '@/components/ui/FilterBar/Filter';
import InputSearch from '@/components/ui/FilterBar/SearchBar';
import SortDropdown from '@/components/ui/FilterBar/Sort';
import { dummyChallenges } from '@/components/ui/FilterBar/TestData';

export default function FilterTestPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    categories: [],
    docType: null,
    status: null,
  });

  const [sortOption, setSortOption] = useState({
    id: 'PENDING',
    type: 'status',
    value: 'PENDING',
  });

  const processedChallenges = useMemo(() => {
    let result = [...dummyChallenges];

    if (searchKeyword) {
      result = result.filter((challenge) =>
        challenge.title.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
    }

    if (appliedFilters.categories.length > 0) {
      result = result.filter((challenge) =>
        appliedFilters.categories.includes(challenge.field),
      );
    }

    if (appliedFilters.docType) {
      result = result.filter(
        (challenge) => challenge.docType === appliedFilters.docType,
      );
    }

    if (appliedFilters.status) {
      result = result.filter(
        (challenge) =>
          challenge.progressStatus === appliedFilters.status ||
          challenge.status === appliedFilters.status,
      );
    }

    if (sortOption.type === 'status') {
      result = result.filter(
        (challenge) => challenge.status === sortOption.value,
      );
    } else if (sortOption.type === 'sort') {
      result.sort((a, b) => {
        const dateA = new Date(a[sortOption.field]);
        const dateB = new Date(b[sortOption.field]);
        return sortOption.order === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }
    return result;
  }, [searchKeyword, appliedFilters, sortOption]);

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  const handleApplyFilter = (filters) => {
    setAppliedFilters(filters);
  };

  const handleSelectSort = (option) => {
    setSortOption(option);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-24-semibold text-gray-800 mb-6">
        챌린지 필터 및 검색 테스트
      </h1>

      <div className="flex items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <InputSearch
          placeholder="챌린지 이름을 검색해보세요"
          onSearch={handleSearch}
        />

        <div className="flex items-center gap-3">
          <Filter appliedFilters={appliedFilters} onApply={handleApplyFilter} />
          <SortDropdown onSelect={handleSelectSort} />
        </div>
      </div>

      <div>
        <p className="text-14-medium text-gray-600 mb-4">
          총{' '}
          <span className="font-bold text-black">
            {processedChallenges.length}
          </span>
          개의 결과가 있습니다.
        </p>

        {processedChallenges.length > 0 ? (
          <div className="grid gap-4">
            {processedChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-gray-100 text-12-medium text-gray-600 rounded-md">
                    {challenge.field} | {challenge.docType}
                  </span>

                  <div className="flex gap-2">
                    {challenge.progressStatus && (
                      <span
                        className={`px-2 py-1 rounded-md text-12-medium ${
                          challenge.progressStatus === 'IN_PROGRESS'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {challenge.progressStatus === 'IN_PROGRESS'
                          ? '진행중'
                          : '마감'}
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded-md text-12-medium ${
                        challenge.status === 'APPROVED'
                          ? 'bg-blue-100 text-blue-700'
                          : challenge.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : challenge.status === 'REJECTED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {challenge.status === 'PENDING'
                        ? '승인 대기'
                        : challenge.status === 'APPROVED'
                          ? '승인됨'
                          : challenge.status}
                    </span>
                  </div>
                </div>
                <h3 className="text-18-semibold text-gray-900 mt-1">
                  {challenge.title}
                </h3>
                <div className="text-14-regular text-gray-500 flex gap-4 mt-2">
                  <span>
                    생성일: {new Date(challenge.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    마감일: {new Date(challenge.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-gray-200">
            <p className="text-16-medium text-gray-500">
              조건에 맞는 챌린지가 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
