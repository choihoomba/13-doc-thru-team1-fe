'use client';

import { useState, useRef, useEffect } from 'react';

import Image from 'next/image';

import iconToggleDown from '@/app/assets/icons/icon_toggle_down.svg';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';

import { cn } from '@/utils/cn';

const challengeSortOptions = [
  { id: 'PENDING', label: '승인 대기', type: 'status', value: 'PENDING' },
  { id: 'APPROVED', label: '신청 승인', type: 'status', value: 'APPROVED' },
  { id: 'REJECTED', label: '신청 거절', type: 'status', value: 'REJECTED' },
  {
    id: 'created_asc',
    label: '신청 시간 빠른순',
    type: 'sort',
    field: 'createdAt',
    order: 'asc',
  },
  {
    id: 'created_desc',
    label: '신청 시간 느린순',
    type: 'sort',
    field: 'createdAt',
    order: 'desc',
  },
  {
    id: 'deadline_asc',
    label: '마감 기한 빠른순',
    type: 'sort',
    field: 'deadline',
    order: 'asc',
  },
  {
    id: 'deadline_desc',
    label: '마감 기한 느린순',
    type: 'sort',
    field: 'deadline',
    order: 'desc',
  },
];

export default function SortDropdown({ onSelect, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(challengeSortOptions[0]);

  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => setIsOpen(false), { closeOnEscape: true });

  useEffect(() => {
    onSelect?.(selectedOption);
  }, [onSelect, selectedOption]);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onSelect?.(option);
    setIsOpen(false);
  };

  return (
    <div
      className={cn('relative inline-block text-left', className)}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'flex items-center justify-between w-36 mobile:w-40 px-3.5 mobile:px-4 py-2 text-14-regular text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none transition-colors',
        )}
      >
        <span className="truncate">{selectedOption.label}</span>
        <Image
          src={iconToggleDown}
          alt="toggle arrow"
          width={20}
          height={20}
          className="w-5 h-5 ml-1"
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-dropdown w-36 mobile:w-40 mt-2 bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
          <ul className="flex flex-col">
            {challengeSortOptions.map((option, index) => {
              const isNotLast = index !== challengeSortOptions.length - 1;

              return (
                <li
                  key={option.id}
                  onClick={() => handleOptionClick(option)}
                  className={cn(
                    'px-3.5 mobile:px-4 py-2.5 mobile:py-3 text-14-regular text-gray-700 cursor-pointer bg-white hover:bg-gray-50 transition-colors',
                    isNotLast && 'border-b border-gray-200',
                  )}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
