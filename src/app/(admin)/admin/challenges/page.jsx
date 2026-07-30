'use client';

import { useCallback, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { deleteChallenge } from '@/lib/api/challenges';

import { useModal } from '@/hooks/modal/useModal';
import { challengeKeys } from '@/hooks/queries/challenges/keys1';
import { useChallenges } from '@/hooks/queries/challenges/queries1';

import { cn } from '@/utils/cn';

import Card from '@/components/ui/Card';
import Filter from '@/components/ui/FilterBar/Filter.jsx';
import SearchBar from '@/components/ui/FilterBar/SearchBar.jsx';
import LoadingDisplay from '@/components/ui/LoadingDisplay';
import ModalConfirm from '@/components/ui/Modal/ModalConfirm';
import ModalRejectReason from '@/components/ui/Modal/ModalRejectReason';

const DEFAULT_FILTERS = {
  categories: [],
  docType: null,
  status: null,
};

function isClosedChallenge(challenge) {
  if (challenge.status === 'CLOSED') return true;
  if (!challenge.deadline) return false;

  const deadline = new Date(challenge.deadline);
  return !Number.isNaN(deadline.getTime()) && deadline <= new Date();
}

export default function AdminChallengeListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModal();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const apiStatus =
    filters.status === 'IN_PROGRESS' ? 'APPROVED' : filters.status;

  const { data, isLoading, isError } = useChallenges({
    // 공개 목록은 진행 중(APPROVED)과 마감(CLOSED)만 조회합니다.
    // 승인 대기(PENDING)는 별도의 챌린지 관리 화면에서만 조회합니다.
    view: 'public',
    page: currentPage,
    limit: 10,
    search: searchTerm,
    field: filters.categories,
    docType: filters.docType,
    status: apiStatus,
  });

  const { mutate: deleteChallengeMutate } = useMutation({
    mutationFn: deleteChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.all });
    },
  });

  const challenges = data?.challenges ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  const handleEdit = (id) => {
    router.push(`/admin/challenges/${id}/edit`);
  };

  const openDeleteNotice = (message) => {
    openModal(
      <ModalConfirm icon={null} message={message} onConfirm={closeModal} />,
    );
  };

  const handleConfirmDelete = (challengeId, reason) => {
    deleteChallengeMutate(
      { id: challengeId, reason },
      {
        onSuccess: () => {
          openDeleteNotice('챌린지가 삭제되었습니다.');
        },
        onError: (error) => {
          const message =
            error?.status === 409
              ? '마감된 챌린지는 삭제할 수 없습니다.'
              : (error?.message ?? '챌린지 삭제 중 오류가 발생했습니다.');

          openDeleteNotice(message);
        },
      },
    );
  };

  const handleOpenDeleteModal = (challenge) => {
    if (isClosedChallenge(challenge)) {
      openDeleteNotice('마감된 챌린지는 삭제할 수 없습니다.');
      return;
    }

    openModal(
      <ModalRejectReason
        title="삭제 사유"
        label="내용"
        placeholder="삭제 사유를 입력해주세요"
        submitText="삭제"
        onSubmit={(reason) => handleConfirmDelete(challenge.id, reason)}
      />,
    );
  };

  // SearchBar의 effect 의존성이 매 렌더링마다 바뀌지 않도록 콜백을 고정합니다.
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleApplyFilter = useCallback((nextFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  }, []);

  return (
    <div className={cn('mt-10')}>
      <main
        className={cn(
          'min-h-[100vh] px-[16px] pb-[32px] bg-gray-50',
          'tablet:px-[24px]',
        )}
      >
        <div className={cn('m-auto max-w-[996px]')}>
          <div className="mb-6 flex flex-col">
            <h1 className={cn('mb-6 text-20-semibold text-gray-800')}>
              챌린지 목록
            </h1>

            <div className="flex items-center gap-3">
              <div>
                <Filter appliedFilters={filters} onApply={handleApplyFilter} />
              </div>
              <div className="flex-1">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="챌린지 이름을 검색해보세요"
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-[227px] items-center justify-center">
              <LoadingDisplay />
            </div>
          ) : isError ? (
            <div className="flex h-[227px] items-center justify-center text-center text-16-medium text-red-error">
              데이터를 불러오는데 실패했습니다.
            </div>
          ) : challenges.length === 0 ? (
            <div className="flex h-[227px] w-full items-center justify-center rounded-[12px] border border-gray-200 bg-white py-20 text-center text-14-medium text-gray-500">
              등록된 챌린지가 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {challenges.map((challenge) => {
                const submissionId =
                  challenge.participations?.[0]?.submission?.id;

                return (
                  <Card
                    key={challenge.id}
                    challenge={challenge}
                    detailHref={`/challenges/${challenge.id}`}
                    showKebab
                    onEdit={() => handleEdit(challenge.id)}
                    onDelete={() => handleOpenDeleteModal(challenge)}
                    showSubmissionButton={Boolean(submissionId)}
                    submissionHref={
                      submissionId ? `/submissions/${submissionId}` : ''
                    }
                  />
                );
              })}
            </div>
          )}

          {!isLoading && !isError && totalPages > 0 && (
            <div className="mt-12 flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-14-regular text-gray-400 hover:text-black disabled:opacity-30"
              >
                &lt;
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded text-14-medium transition-colors',
                      currentPage === pageNum
                        ? 'bg-brand-black text-white'
                        : 'text-gray-500 hover:bg-gray-100',
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((p) => (p >= totalPages ? p : p + 1))
                }
                disabled={currentPage >= totalPages}
                className="p-2 text-14-regular text-gray-400 hover:text-black disabled:opacity-30"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
