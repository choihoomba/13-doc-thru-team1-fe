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

  if (typeof document === 'undefined') return null; // SSR 가드 undefined는 서버에서 쓰는거 아니면 처리할 필요가 없음

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
          'w-[min(90vw,327px)] max-h-[85vh,220px]',
          'overflow-y-auto rounded-lg border-2 border-gray-800 bg-white',
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
