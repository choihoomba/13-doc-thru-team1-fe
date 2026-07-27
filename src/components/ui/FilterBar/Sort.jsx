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
      className={cn('relative w-fit text-left text-gray-400', className)}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'flex items-center justify-between w-25.75 h-10 pl-3 pr-2 py-2 text-14-regular bg-white border border-gray-300 rounded-4xl hover:bg-gray-50 focus:outline-none transition-colors cursor-pointer',
          'tablet:w-35',
        )}
      >
        <span className="truncate">{selectedOption.label}</span>
        <Image src={iconToggleDown} alt="toggle arrow" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-35 z-dropdown bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden">
          <ul className="flex flex-col">
            {challengeSortOptions.map((option, index) => {
              const isNotLast = index !== challengeSortOptions.length - 1;

              return (
                <li
                  key={option.id}
                  onClick={() => handleOptionClick(option)}
                  className={cn(
                    'px-3.5 py-2.5 text-14-regular cursor-pointer bg-white hover:bg-gray-50 transition-colors',
                    isNotLast && 'border-b border-gray-300',
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
