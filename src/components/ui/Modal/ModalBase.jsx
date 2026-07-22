'use client';

import { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

export default function ModalBase({
  title,
  onCloseIconClick,
  showCloseIcon = Boolean(title),
  children,
  className,
}) {
  const { closeModal } = useModal();

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') closeModal();
    },
    [closeModal],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [handleKeyDown]);

  if (typeof document === 'undefined') return null; // SSR 가드

  const handleBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50',
      )}
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        className={cn(
          'w-[min(90vw,327px)] max-h-[85vh,220px] overflow-y-auto rounded-lg border-2 border-gray-800 bg-white',
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {(title || showCloseIcon) && (
          <div
            className={cn('flex items-center justify-between px-6 pt-4 pb-6')}
          >
            {title && (
              <h2 className={cn('text-16-bold text-gray-800')}>{title}</h2>
            )}
            {showCloseIcon && (
              <button
                type="button"
                onClick={onCloseIconClick}
                aria-label="닫기"
                className={cn('text-gray-600')}
              >
                ✕
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}

/** 모달의 인풋/텍스트 영역 */
export function ModalContent({ children, className }) {
  return <div className={cn('px-6', className)}>{children}</div>;
}

/** 버튼이 1개일때, 2개일때 */
// export function ModalActions({ children, className }) {
//   return (
//     <div className={cn('flex gap-2 px-6 pb-6 [&>button]:flex-1', className)}>
//       {children}
//     </div>
//   );
// }
