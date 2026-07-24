'use client';

import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';

import ModalBase from './ModalBase';

/**
 * 피그마상 Popup 컴포넌트
 * @example
 * const { openModal } = useModal();
 * openModal(<ModalNotice message={"가입이 완료되었습니다!"} />);
 *
 */
export default function ModalNotice({
  message,
  confirmButtonText = '확인',
  onConfirm,
}) {
  const { closeModal } = useModal();

  const handleConfirm = () => {
    onConfirm?.();
    closeModal();
  };

  return (
    <ModalBase
      className={cn(
        'w-[min(90vw,327px)] min-h-[220px]',
        'desktop:w-[540px] desktop:min-h-[250px]',
      )}
    >
      <div
        className={cn(
          'flex flex-col items-center px-6 pt-[81px] pb-[45px]',
          'desktop:pt-[108px]',
        )}
      >
        <p
          className={cn('text-center text-16-medium', 'desktop:text-18-medium')}
        >
          {message}
        </p>
      </div>
      <div
        className={cn(
          'flex justify-center pb-7',
          'desktop:mr-[28px] desktop:justify-end',
        )}
      >
        <ButtonPrimary width="120px" size="xxl" onClick={handleConfirm}>
          {confirmButtonText}
        </ButtonPrimary>
      </div>
    </ModalBase>
  );
}
