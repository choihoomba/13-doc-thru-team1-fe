'use client';

import { useRef, useState } from 'react';

import Image from 'next/image';

import IcKebab from '@/app/assets/icons/icon_kebab.svg';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';

import { cn } from '@/utils/cn';

/**
 * 케밥(더보기) 버튼
 * - 열림/닫힘 상태는 컴포넌트 내부에서 관리
 * - 수정하기/삭제하기 클릭 시 각각 onEdit, onDelete 호출
 */
export default function ButtonKebab({
  onEdit = () => {},
  onDelete = () => {},
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useOutsideClick(containerRef, () => setIsOpen(false), {
    enabled: isOpen,
    detectFocus: true,
  });

  const handleEdit = () => {
    setIsOpen(false);
    onEdit();
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete();
  };

  return (
    <div ref={containerRef} className={cn('relative w-fit', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="더보기"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={cn('flex items-center justify-center cursor-pointer')}
      >
        <Image src={IcKebab} alt="" width={24} height={24} unoptimized />
      </button>

      {isOpen && (
        <ul
          className={cn(
            'absolute right-0 top-[calc(100%+8px)] z-20 w-[139px] h-[86px]',
          )}
        >
          <li className={cn('h-1/2')}>
            <button
              type="button"
              onClick={handleEdit}
              className={cn(
                'w-full h-full flex items-center justify-center text-16-regular text-gray-500 bg-white cursor-pointer',
                'rounded-t-[8px] border border-solid border-gray-300',
              )}
            >
              수정하기
            </button>
          </li>
          <li className={cn('h-1/2')}>
            <button
              type="button"
              onClick={handleDelete}
              className={cn(
                'w-full h-full flex items-center justify-center text-16-regular text-gray-500 bg-white cursor-pointer',
                'rounded-b-[8px] border-r border-b border-l border-solid border-gray-300',
              )}
            >
              삭제하기
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
