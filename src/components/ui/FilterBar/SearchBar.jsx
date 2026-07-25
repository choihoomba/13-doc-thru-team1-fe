'use client';
import { useState } from 'react';

import Image from 'next/image';

import iconOut from '@/app/assets/icons/icon_out.svg';
import iconSearch from '@/app/assets/icons/icon_search.svg';

import { cn } from '@/utils/cn';

export default function InputSearch({
  placeholder = '챌린지 이름을 검색해보세요',
  onSearch,
  className,
}) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(inputValue);
    }
  };

  const handleIconClick = () => {
    onSearch(inputValue);
  };

  // 검색어 초기화
  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <div
      className={cn(
        'relative flex-1 w-full max-w-210 h-10 flex items-center',
        className,
      )}
    >
      <button
        type="button"
        onClick={handleIconClick}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center focus:outline-none"
      >
        <Image
          src={iconSearch}
          alt="검색 아이콘"
          width={20}
          height={20}
          className="w-5 h-5 object-contain cursor-pointer"
        />
      </button>

      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full h-full pl-11 pr-10 text-14-regular text-gray-800 bg-white border border-gray-200 rounded-full',
          'focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all placeholder-gray-400',
        )}
      />

      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 flex items-center justify-center focus:outline-none"
        >
          <Image
            src={iconOut}
            alt="지우기 아이콘"
            width={16}
            height={16}
            className="w-4 h-4 object-contain"
          />
        </button>
      )}
    </div>
  );
}
