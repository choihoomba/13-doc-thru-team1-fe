'use client';

import { useState, useRef } from 'react';

import Image from 'next/image';

import iconFilterDisabled from '@/app/assets/icons/icon_filter_disabled.svg';
import iconFilterUndisabled from '@/app/assets/icons/icon_filter_undisabled.svg';
import iconOut from '@/app/assets/icons/icon_out.svg';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';

import { cn } from '@/utils/cn';

const filterOptions = {
  categories: [
    { id: 'NEXTJS', label: 'Next.js' },
    { id: 'REACT', label: 'REACT' },
    { id: 'MODERNJS', label: 'Modern JS' },
    { id: 'TYPESCRIPT', label: 'TYPESCRIPT' },
    { id: 'API', label: 'API' },
    { id: 'WEB', label: 'Web' },
    { id: 'CAREER', label: 'Career' },
  ],
  docTypes: [
    { id: 'OFFICIAL', label: '공식문서' },
    { id: 'BLOG', label: '블로그' },
    { id: 'BOOK', label: '도서' },
    { id: 'ETC', label: '기타' },
  ],
  statuses: [
    { id: 'IN_PROGRESS', label: '진행중' },
    { id: 'CLOSED', label: '마감' },
  ],
};

const DEFAULT_FILTERS = {
  categories: [],
  docType: null,
  status: null,
};

export default function Filter({
  appliedFilters = DEFAULT_FILTERS,
  onApply,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const safeAppliedFilters = {
    categories: appliedFilters?.categories ?? [],
    docType: appliedFilters?.docType ?? null,
    status: appliedFilters?.status ?? null,
  };

  const [localFilters, setLocalFilters] = useState(safeAppliedFilters);
  const filterRef = useRef(null);

  useOutsideClick(filterRef, () => setIsOpen(false), { closeOnEscape: true });

  const handleToggle = () =>
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setLocalFilters(safeAppliedFilters);
      }
      return next;
    });

  const activeCount =
    safeAppliedFilters.categories.length +
    (safeAppliedFilters.docType ? 1 : 0) +
    (safeAppliedFilters.status ? 1 : 0);

  const handleCategoryChange = (id) => {
    setLocalFilters((prev) => {
      const currentCategories = prev.categories || [];
      const isChecked = currentCategories.includes(id);
      return {
        ...prev,
        categories: isChecked
          ? currentCategories.filter((c) => c !== id)
          : [...currentCategories, id],
      };
    });
  };

  const handleReset = () => {
    setLocalFilters(DEFAULT_FILTERS);
    onApply?.(DEFAULT_FILTERS);
    setIsOpen(false);
  };

  const handleApply = () => {
    onApply?.(localFilters);
    setIsOpen(false);
  };

  return (
    <div
      className={cn('relative inline-block text-left', className)}
      ref={filterRef}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'flex items-center justify-between min-w-[112px]; h-10 py-2 px-4 border rounded-full transition-colors text-14-medium cursor-pointer',
          'tablet:px-5 desktop:px-5',
          activeCount > 0
            ? 'bg-brand-black text-white border-brand-black'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
        )}
      >
        <span>{activeCount > 0 ? `필터(${activeCount})` : '필터'}</span>
        <Image
          src={activeCount > 0 ? iconFilterDisabled : iconFilterUndisabled}
          alt="filter icon"
          width={16}
          height={16}
          className="ml-2 w-4 h-4"
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute left-0 mt-2 z-dropdown bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden flex flex-col text-gray-800',
            'w-72 tablet:w-80',
          )}
        >
          <div className="flex items-center justify-between p-4 tablet:p-5 pb-2">
            <h3 className="text-16-bold">필터</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-800 focus:outline-none transition-colors cursor-pointer"
            >
              <Image
                src={iconOut}
                alt="out_icon"
                width={20}
                height={20}
                className="w-5 h-5 ml-2"
              />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[50vh] tablet:max-h-[60vh] flex flex-col">
            <div className="p-4 tablet:p-5 pt-3">
              <h4 className="mb-3 tablet:mb-4 text-14-bold">분야</h4>
              <div className="space-y-2.5 tablet:space-y-3">
                {filterOptions.categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={localFilters.categories.includes(cat.id)}
                      onChange={() => handleCategoryChange(cat.id)}
                      className="w-4 h-4 tablet:w-5 tablet:h-5 text-brand-black bg-gray-50 border-gray-300 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="ml-2.5 tablet:ml-3 text-14-regular text-gray-700">
                      {cat.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 tablet:p-5 border-t border-gray-100">
              <h4 className="mb-3 tablet:mb-4 text-14-bold">문서 타입</h4>
              <div className="space-y-2.5 tablet:space-y-3">
                {filterOptions.docTypes.map((type) => (
                  <label
                    key={type.id}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="docType"
                      checked={localFilters.docType === type.id}
                      onChange={() =>
                        setLocalFilters({ ...localFilters, docType: type.id })
                      }
                      className="w-4 h-4 tablet:w-5 tablet:h-5 text-brand-black bg-gray-50 border-gray-300 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="ml-2.5 tablet:ml-3 text-14-regular text-gray-700">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 tablet:p-5 border-t border-gray-100">
              <h4 className="mb-3 tablet:mb-4 text-14-bold">상태</h4>
              <div className="space-y-2.5 tablet:space-y-3">
                {filterOptions.statuses.map((status) => (
                  <label
                    key={status.id}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="status"
                      checked={localFilters.status === status.id}
                      onChange={() =>
                        setLocalFilters({ ...localFilters, status: status.id })
                      }
                      className="w-4 h-4 tablet:w-5 tablet:h-5 text-brand-black bg-gray-50 border-gray-300 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="ml-2.5 tablet:ml-3 text-14-regular text-gray-700">
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex p-4 tablet:p-5 border-t border-gray-100 gap-2.5 tablet:gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-2.5 tablet:py-3 text-14-semibold text-gray-800 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 py-2.5 tablet:py-3 text-14-semibold text-white bg-brand-black rounded-xl hover:bg-black transition-colors cursor-pointer"
            >
              적용하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
