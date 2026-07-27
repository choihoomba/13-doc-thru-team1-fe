'use client';

import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

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
  const isMobile = useMediaQuery({ maxWidth: 743 });

  const safeAppliedFilters = {
    categories: appliedFilters?.categories ?? [],
    docType: appliedFilters?.docType ?? null,
    status: appliedFilters?.status ?? null,
  };

  const [localFilters, setLocalFilters] = useState(safeAppliedFilters);
  const filterRef = useRef(null);

  useOutsideClick(filterRef, () => setIsOpen(false), { closeOnEscape: true });

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile]);

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
          'flex items-center justify-between w-24.75 h-10 py-2 px-3 border rounded-full transition-colors text-14-medium cursor-pointer hover:text-gray-800 focus:outline-none,',
          'tablet:w-26.5',
          'desktop:w-28',
          activeCount > 0
            ? 'bg-brand-black text-white border-brand-black'
            : 'bg-white text-gray-400 border-gray-300 hover:bg-gray-50',
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
            'fixed inset-0 z-dropdown bg-white border-2 border-gray-200 shadow-lg overflow-hidden flex flex-col text-gray-800',
            'tablet:absolute tablet:inset-auto tablet:left-0 tablet:mt-2 tablet:w-85.75 tablet:rounded-xl',
          )}
        >
          <div className="flex items-center justify-between p-4 tablet:p-5 pb-2 shrink-0">
            <h3 className="text-16-bold text-gray-800">필터</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer"
            >
              <Image src={iconOut} alt="닫기" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 tablet:flex-none tablet:max-h-[60vh] flex flex-col">
            <div className="p-4 tablet:p-5 pt-3">
              <h4 className="mb-3 tablet:mb-4 text-14-bold text-gray-800">
                분야
              </h4>
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
                      className="w-4 h-4 tablet:w-5 tablet:h-5 text-brand-black bg-gray-50 border-gray-800 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="ml-2.5 tablet:ml-3 text-14-regular text-gray-700">
                      {cat.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 tablet:p-5 border-t border-gray-200">
              <h4 className="mb-3 tablet:mb-4 text-14-bold text-gray-800">
                문서 타입
              </h4>
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
                      className="w-4 h-4 tablet:w-5 tablet:h-5 text-brand-black bg-gray-50 border-gray-800 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="ml-2.5 tablet:ml-3 text-14-regular text-gray-700">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 tablet:p-5 border-t border-gray-200">
              <h4 className="mb-3 tablet:mb-4 text-14-bold text-gray-800">
                상태
              </h4>
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
                      className="w-4 h-4 tablet:w-5 tablet:h-5 text-brand-black bg-gray-50 border-gray-800 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="ml-2.5 tablet:ml-3 text-14-regular text-gray-700">
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex p-4 tablet:p-5 border-t border-gray-200 gap-2.5 tablet:gap-3 shrink-0">
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
