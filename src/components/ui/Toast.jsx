'use client';

import { useRef } from 'react';
import { createPortal } from 'react-dom';

import Image from 'next/image';

import iconOutCircle from '@/app/assets/icons/icon_out_circle.svg';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';

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
  onLoad,
  message = `임시 저장된 작업물이 있어요.\n저장된 작업물을 불러오시겠어요?`,
}) {
  const cardRef = useRef(null);

  useOutsideClick(cardRef, () => onClose?.(), {
    enabled: isOpen,
    closeOnEscape: true,
  });

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={cn(
        'fixed z-toast inset-x-4 bottom-4 flex justify-center p-[8px]',
        'tablet:bottom-6 tablet:inset-x-6',
        'desktop:bottom-8',
      )}
    >
      <div
        ref={cardRef}
        role="status" // 스크린리더가 읽을수있게함
        className={cn(
          'flex w-full min-w-[343px] max-w-[890px] justify-between gap-2.5 rounded-lg border-2 border-brand-black bg-[#F6F8FACC] p-2',
        )}
      >
        <div className={cn('flex items-center justify-center gap-2')}>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className={cn('shrink-0 cursor-pointer')}
          >
            <Image src={iconOutCircle} alt="" width={24} height={24} />
          </button>
          <p
            className={cn(
              'whitespace-pre-line text-14-medium',
              'tablet:whitespace-normal',
            )}
          >
            {message}
          </p>
        </div>
        <ButtonPrimary variant="primary" size="sm" onClick={onLoad}>
          불러오기
        </ButtonPrimary>
      </div>
    </div>,
    document.body,
  );
}
