'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

import Image from 'next/image';

import iconOutCircle from '@/app/assets/icons/icon_out_circle.svg';

import { cn } from '@/utils/cn';

/**
 * @example
 * const [isToastOpen, setIsToastOpen] = useState(false);
 *
 * const handleLoad = () => {
 *   setIsToastOpen(false);
 * };
 *
 * return (
 *   <>
 *     <button onClick={() => setIsToastOpen(true)}>토스트 열기</button>
 *
 *     <Toast
 *       isOpen={isToastOpen}
 *       onClose={() => setIsToastOpen(false)}
 *       onLoad={handleLoad}
 *     />
 *   </>
 * );
 */
export default function Toast({
  isOpen,
  onClose,
  onLoad,
  message = `임시 저장된 작업물이 있어요.\n저장된 작업물을 불러오시겠어요?`,
  loadText = '불러오기',
}) {
  const cardRef = useRef(null);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose?.();
    },
    [onClose],
  );

  const handleOutsideClick = useCallback(
    (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        onClose?.();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, handleKeyDown, handleOutsideClick]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-x-4 bottom-4 z-50 flex justify-center">
      <div
        ref={cardRef}
        role="status"
        className={cn(
          'flex w-85.75 justify-between gap-2.5 rounded-lg border-2 border-brand-dark bg-[#F6F8FACC] p-2',
          'tablet:w-170',
        )}
      >
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="shrink-0 p-1"
          >
            <Image src={iconOutCircle} alt="" width={24} height={24} />
          </button>

          <p
            className={cn(
              'whitespace-pre-line text-14-medium text-gray-900',
              'tablet:whitespace-normal',
            )}
          >
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onLoad}
          className="shrink-0 rounded-[10px] bg-brand-dark px-4 py-0.5 text-14-medium text-white"
        >
          {loadText}
        </button>
      </div>
    </div>,
    document.body,
  );
}
