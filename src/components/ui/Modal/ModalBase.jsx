'use client';

import { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

/**
 * 모달 "내용물"을 감싸는 흰색 박스 뼈대 + backdrop/ESC 닫기/딤드 클릭 닫기/portal 렌더링까지 함께 담당하는 컴포넌트.
 *
 * ModalConfirm/ModalRejectReason/Popup처럼 openModal(<X />)로 호출되는 컴포넌트들이
 * 내부에서 감싸 쓰는 컴포넌트. 이 컴포넌트가 마운트되어 있는 것 자체가 "모달이 열려있음"을
 * 의미하므로(ModalProvider가 content가 있을 때만 렌더링) 별도 isOpen prop은 받지 않음.
 * ESC/딤드 클릭 닫기는 useModal()의 closeModal을 직접 사용하고, 우측 상단 ✕ 아이콘은
 * onCloseIconClick prop으로 개별 제어함.
 */
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
export function ModalActions({ children, className }) {
  return (
    <div className={cn('flex gap-2 px-6 pb-6 [&>button]:flex-1', className)}>
      {children}
    </div>
  );
}

/**
 * 공용 버튼 클래스. variant별 색상만 공통으로 관리하고, height/width는 모달마다
 * 디자인이 달라서 호출부에서 className으로 직접 넘김.
 */
export function getModalButtonClassName(variant = 'primary', className) {
  return cn(
    'rounded-xl text-14-semibold transition-colors disabled:cursor-not-allowed',
    variant === 'primary' && 'bg-brand-dark text-white',
    variant === 'secondary' && 'border border-gray-800 bg-white text-gray-800',
    className,
  );
}
