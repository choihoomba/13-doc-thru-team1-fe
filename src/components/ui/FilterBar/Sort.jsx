'use client';

import { useState, useRef, useEffect } from 'react';

import Image from 'next/image';

import iconToggleDown from '@/app/assets/icons/icon_toggle_down.svg';

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

export default function SortDropdown({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState(challengeSortOptions[0]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (onSelect) {
      onSelect(option);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className={cn(
          'flex items-center justify-between w-40 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none transition-colors',
        )}
      >
        <span>{selectedOption.label}</span>

        <Image src={iconToggleDown} alt="toggle arrow" width={24} height={24} />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-10 w-40 mt-2 bg-white border border-[#E5E5E5] rounded-md shadow-sm overflow-hidden">
          <ul className="flex flex-col">
            {challengeSortOptions.map((option, index) => {
              const isNotLast = index !== challengeSortOptions.length - 1;

              return (
                <li
                  key={option.id}
                  onClick={() => handleOptionClick(option)}
                  className={cn(
                    'px-4 py-3 text-sm text-[#555555] cursor-pointer bg-white hover:bg-gray-50 transition-colors',
                    isNotLast && 'border-b border-[#E5E5E5]',
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
