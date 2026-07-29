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
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
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
