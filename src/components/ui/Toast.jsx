'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

import Image from 'next/image';

import iconOutCircle from '@/app/assets/icons/icon_out_circle.svg';

import { cn } from '@/utils/cn';

import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';

/**.
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
 *     />
 *   </>
 * );
 */
export default function Toast({
  isOpen,
  onClose,
  message = `임시 저장된 작업물이 있어요.\n저장된 작업물을 불러오시겠어요?`,
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
        role="status" // 스크린리더가 읽을수있게함
        className={cn(
          'flex w-full min-w-[343px] max-w-[890px] justify-between gap-2.5 rounded-lg border-2 border-brand-black bg-[#F6F8FACC] p-2',
        )}
      >
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="shrink-0"
          >
            <Image src={iconOutCircle} alt="" width={24} height={24} />
          </button>
          <p
            className={cn(
              'whitespace-pre-line text-14-medium',
              'mobile:whitespace-normal',
            )}
          >
            {message}
          </p>
        </div>
        <ButtonPrimary variant="primary" size="sm">
          불러오기
        </ButtonPrimary>

        {/*   width="90px" F6F8FACC */}
      </div>
    </div>,
    document.body,
  );
}
