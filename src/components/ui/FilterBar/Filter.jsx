'use client';

import { useState, useRef, useEffect } from 'react';

import Image from 'next/image';

import iconFilterDisabled from '@/app/assets/icons/icon_filter_disabled.svg';
import iconFilterUndisabled from '@/app/assets/icons/icon_filter_undisabled.svg';
import iconOut from '@/app/assets/icons/icon_out.svg';

import { cn } from '@/utils/cn';

const filterOptions = {
  categories: [
    { id: 'NEXTJS', label: 'Next. js' },
    { id: 'MODERNJS', label: 'Modern JS' },
    { id: 'API', label: 'API' },
    { id: 'WEB', label: 'Web' },
    { id: 'CAREER', label: 'Career' },
  ],
  docTypes: [
    { id: 'OFFICIAL', label: '공식문서' },
    { id: 'BLOG', label: '블로그' },
  ],
  statuses: [
    { id: 'IN_PROGRESS', label: '진행중' },
    { id: 'CLOSED', label: '마감' },
  ],
};

export default function Filter({ appliedFilters, onApply }) {
  const [isOpen, setIsOpen] = useState(false);

  const [localFilters, setLocalFilters] = useState({
    categories: [],
    docType: null,
    status: null,
  });

  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () =>
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setLocalFilters(appliedFilters);
      }
      return next;
    });

  const activeCount =
    appliedFilters.categories.length +
    (appliedFilters.docType ? 1 : 0) +
    (appliedFilters.status ? 1 : 0);

  const handleCategoryChange = (id) => {
    setLocalFilters((prev) => {
      const isChecked = prev.categories.includes(id);
      if (isChecked) {
        return { ...prev, categories: prev.categories.filter((c) => c !== id) };
      } else {
        return { ...prev, categories: [...prev.categories, id] };
      }
    });
  };

  const handleReset = () => {
    const resetState = { categories: [], docType: null, status: null };
    setLocalFilters(resetState);
    onApply(resetState);
    setIsOpen(false);
  };

  const handleApply = () => {
    onApply(localFilters);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={filterRef}>
      <button
        onClick={handleToggle}
        className={cn(
          'flex items-center justify-between px-4 py-2 border rounded-full transition-colors text-sm font-medium',
          activeCount > 0
            ? 'bg-[#2D2D2D] text-white border-[#2D2D2D]'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
        )}
      >
        <span>{activeCount > 0 ? `필터(${activeCount})` : '필터'}</span>
        <Image
          src={activeCount > 0 ? iconFilterDisabled : iconFilterUndisabled}
          alt="filter icon"
          width={16}
          height={16}
          className="ml-2"
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 bg-white border border-gray-200 shadow-lg rounded-xl w-[320px] overflow-hidden flex flex-col text-[#333333]">
          <div className="flex items-center justify-between p-5 pb-2">
            <h3 className="text-base font-semibold">필터</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-800 focus:outline-none transition-colors"
            >
              <Image
                src={iconOut}
                alt="out_icon"
                width={24}
                height={24}
                className="ml-2"
              />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[60vh] flex flex-col">
            <div className="p-5 pt-3">
              <h4 className="mb-4 text-sm font-bold">분야</h4>
              <div className="space-y-3">
                {filterOptions.categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={localFilters.categories.includes(cat.id)}
                      onChange={() => handleCategoryChange(cat.id)}
                      className="w-5 h-5 text-[#2D2D2D] bg-gray-50 border-gray-300 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {cat.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-5 border-t border-gray-100">
              <h4 className="mb-4 text-sm font-bold">문서 타입</h4>
              <div className="space-y-3">
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
                      className="w-5 h-5 text-[#2D2D2D] bg-gray-50 border-gray-300 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-5 border-t border-gray-100">
              <h4 className="mb-4 text-sm font-bold">상태</h4>
              <div className="space-y-3">
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
                      className="w-5 h-5 text-[#2D2D2D] bg-gray-50 border-gray-300 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex p-5 border-t border-gray-100 gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              초기화
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-3 text-sm font-semibold text-white bg-[#2D2D2D] rounded-xl hover:bg-black transition-colors"
            >
              적용하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
