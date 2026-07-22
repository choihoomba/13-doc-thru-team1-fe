'use client';

import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';

import ModalBase, { ModalContent } from './ModalBase';

/**
 * 피그마상 Popup 컴포넌트
 * @example
 * const { openModal } = useModal();
 * openModal(<ModalNotice message={"가입이 완료되었습니다!"} />);
 * TODO: 버튼 컴포넌트 rebase후 반응형으로 버튼이 한쪽으로 치우쳐지는지 확인 필요
 */
export default function ModalNotice({
  message,
  confirmText = '확인',
  onConfirm,
}) {
  const { closeModal } = useModal();

  const handleConfirm = () => {
    onConfirm?.();
    closeModal();
  };

  return (
    <ModalBase>
      <ModalContent className={cn('flex flex-col items-center pt-20 pb-11')}>
        <p className={cn('text-center text-16-semibold')}>{message}</p>
      </ModalContent>
      <div className={cn('flex justify-center desktop:justify-end px-25 pb-7')}>
        <ButtonPrimary size="xxl" onClick={handleConfirm}>
          {confirmText}
        </ButtonPrimary>
      </div>
    </ModalBase>
  );
}
