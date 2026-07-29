'use client';

import { useState, useEffect, useRef } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import deadlineIcon from '@/app/assets/icons/ic_deadline.svg';
import personIcon from '@/app/assets/icons/ic_person.svg';
import persons from '@/app/assets/icons/ic_persons.svg';
import kebab from '@/app/assets/icons/icon_kebab.svg';
import out from '@/app/assets/icons/icon_out.svg';

import { useDeleteChallenge } from '@/hooks/queries/challenges/mutations1';
import { useChallenges } from '@/hooks/queries/challenges/queries1';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import Filter from '@/components/ui/FilterBar/Filter.jsx';
import SearchBar from '@/components/ui/FilterBar/SearchBar.jsx';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

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

const DEFAULT_FILTERS = {
  categories: [],
  docType: null,
  status: null,
};

function DeleteModal({ isOpen, onClose, onSubmit, isPending }) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmit(reason);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/50 p-4 font-pretendard">
      <div className="relative w-full max-w-120 rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-18-bold text-gray-900">삭제 사유</h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="p-1 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50"
            aria-label="닫기"
          >
            <Image src={out} alt="닫기" width={24} height={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div>
            <label
              htmlFor="delete-reason"
              className="mb-2 block text-14-medium text-gray-700"
            >
              내용
            </label>
            <textarea
              id="delete-reason"
              rows={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="삭제 사유를 입력해주세요"
              disabled={isPending}
              className="w-full resize-none rounded-xl border border-gray-200 p-4 text-14-regular text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={!reason.trim() || isPending}
            className="w-full rounded-xl bg-brand-black py-3.5 text-14-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isPending ? '전송 중...' : '전송'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminChallengeListPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);

  const { data, isLoading, isError } = useChallenges({
    view: 'admin',
    page: currentPage,
    limit: 10,
    search: searchTerm,
    categories: filters.categories,
    docType: filters.docType,
    status: filters.status,
  });

  const { mutate: deleteChallengeMutate, isPending: isDeleting } =
    useDeleteChallenge();

  const challenges = data?.challenges ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (id) => {
    setOpenDropdownId(null);
    router.push(`/example/challenges/admin/${id}/edit`);
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedChallengeId(id);
    setIsDeleteModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedChallengeId(null);
  };

  const handleConfirmDelete = (reason) => {
    if (!selectedChallengeId) return;

    deleteChallengeMutate(
      { id: selectedChallengeId, reason },
      {
        onSuccess: () => {
          handleCloseDeleteModal();
          alert('삭제 처리되었습니다.');
        },
        onError: () => {
          handleCloseDeleteModal();
        },
      },
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

  const getFieldBadgeClass = (field) => {
    switch (field) {
      case 'NEXTJS':
        return 'bg-[#78F867] text-gray-800';
      case 'API':
        return 'bg-[#FF7A50] text-white';
      case 'CAREER':
        return 'bg-[#8BB2F9] text-white';
      case 'MODERNJS':
        return 'bg-[#FF5A5A] text-white';
      case 'WEB':
        return 'bg-[#FFE600] text-gray-800';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  if (isLoading) return <LoadingDisplay />;
  if (isError)
    return (
      <div className="py-10 text-center text-16-medium text-red-error font-pretendard">
        데이터를 불러오는데 실패했습니다.
      </div>
    );

  return (
    <div className="min-h-screen bg-white pb-16 font-pretendard">
      <main className="mx-auto mt-10 max-w-[996px] px-4 sm:px-0">
        <div className="mb-6 flex flex-col">
          <h1 className={cn('-mt-[24px] mb-6 text-20-semibold text-gray-800')}>
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

        {challenges.length === 0 ? (
          <div className="flex h-[227px] w-full items-center justify-center rounded-[12px] border border-gray-200 bg-white py-20 text-center text-14-medium text-gray-500">
            등록된 챌린지가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {challenges.map((challenge) => {
              const isFull =
                challenge.currentParticipants >= challenge.maxParticipants;
              const isClosed = challenge.status === 'CLOSED';

              return (
                <div
                  key={challenge.id}
                  className="relative w-full desktop:w-[996px] rounded-[12px] border border-gray-800 bg-white p-[24px] shadow-sm transition-shadow hover:shadow-md"
                >
                  {isClosed ? (
                    <div className="mb-3 flex w-fit items-center gap-1.5 rounded-full bg-gray-800 px-3 py-1 text-12-medium text-white">
                      <Image
                        src={deadlineIcon}
                        alt="마감일"
                        width={24}
                        height={24}
                      />
                      <span>챌린지가 마감되었어요</span>
                    </div>
                  ) : isFull ? (
                    <div className="mb-3 flex w-fit items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-12-medium text-gray-800 border border-gray-200">
                      <Image
                        src={persons}
                        alt="마감배지_사람들"
                        width={24}
                        height={24}
                      />
                      <span>모집이 완료된 상태에요</span>
                    </div>
                  ) : null}

                  <div
                    className="absolute right-[24px] top-[24px] z-dropdown"
                    ref={openDropdownId === challenge.id ? dropdownRef : null}
                  >
                    <button
                      onClick={() => toggleDropdown(challenge.id)}
                      className="rounded-full p-1 transition-colors hover:bg-gray-100"
                    >
                      <Image
                        src={kebab}
                        alt="케밥메뉴"
                        width={24}
                        height={24}
                      />
                    </button>

                    {openDropdownId === challenge.id && (
                      <div className="absolute right-0 top-8 flex w-[120px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                        <button
                          onClick={() => handleEdit(challenge.id)}
                          className="w-full border-b border-gray-100 py-3 text-center text-14-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          수정하기
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(challenge.id)}
                          className="w-full py-3 text-center text-14-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          삭제하기
                        </button>
                      </div>
                    )}
                  </div>

                  <h2
                    className={cn('mb-3 pr-12 text-22-semibold text-gray-800')}
                  >
                    {challenge.title}
                  </h2>

                  <div className="mb-4 flex items-center gap-2">
                    <span
                      className={cn(
                        'rounded-[6px] px-2.5 py-1 text-13-bold',
                        getFieldBadgeClass(challenge.field),
                      )}
                    >
                      {FIELD_LABEL_MAP[challenge.field] ?? challenge.field}
                    </span>
                    <span className="rounded-[6px] border border-gray-300 bg-white px-2.5 py-1 text-13-medium text-gray-600">
                      {DOC_TYPE_LABEL_MAP[challenge.docType] ??
                        challenge.docType}
                    </span>
                  </div>

                  <hr className="my-4 border-gray-200" />

                  <div className="flex items-center gap-6 text-14-regular text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Image
                        src={deadlineIcon}
                        alt="마감기한"
                        width={20}
                        height={20}
                      />
                      <span>
                        {challenge.deadline
                          ? `${formatDate(challenge.deadline)} 마감`
                          : '-'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Image
                        src={personIcon}
                        alt="참여인원"
                        width={20}
                        height={20}
                      />
                      <span className="text-14-medium text-gray-800">
                        {challenge.currentParticipants}/
                        {challenge.maxParticipants}{' '}
                        {isFull ? '참여 완료' : '참여중'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 0 && (
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
      </main>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onSubmit={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  );
}
