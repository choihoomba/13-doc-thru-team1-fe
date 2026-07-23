'use client';

import { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

export default function ModalBase({ children, className }) {
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

  if (typeof document === 'undefined') return null;

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
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
