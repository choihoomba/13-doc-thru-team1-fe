'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';
import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

export default function ModalBase({ children, className }) {
  const { closeModal } = useModal();
  const boxRef = useRef(null);

  useOutsideClick(boxRef, closeModal, { closeOnEscape: true });

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-modal',
        'flex items-center justify-center',
        'bg-black/50',
      )}
    >
      <div
        ref={boxRef}
        className={cn(
          'w-[min(90vw,327px)]',
          'rounded-lg border-2 border-gray-800 bg-white',
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
