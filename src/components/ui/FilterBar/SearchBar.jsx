'use client';

import { useState, useEffect, useRef } from 'react';

import Image from 'next/image';

import iconOut from '@/app/assets/icons/icon_out.svg';
import iconSearch from '@/app/assets/icons/icon_search.svg';

import useDebounce from '@/hooks/common/useDebounce';

import { cn } from '@/utils/cn';

export default function InputSearch({
  placeholder = '챌린지 이름을 검색해보세요',
  onSearch,
  className,
}) {
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 500);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const trimmed = debouncedValue.trim();
    onSearch?.(trimmed);
  }, [debouncedValue, onSearch]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <div
      className={cn(
        'relative flex-1 w-full max-w-full tablet:max-w-52.5 h-10 flex items-center',
        className,
      )}
    >
      <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center focus:outline-none pointer-events-none">
        <Image
          src={iconSearch}
          alt="검색 아이콘"
          width={20}
          height={20}
          className="w-5 h-5 object-contain"
        />
      </div>

      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className={cn(
          'w-full h-full pl-10 pr-9 text-14-regular text-gray-800 bg-white border border-gray-200 rounded-full',
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
