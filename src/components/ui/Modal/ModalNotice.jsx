'use client';

import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

import ModalBase, {
  ModalContent,
  ModalActions,
  getModalButtonClassName,
} from './ModalBase';

/**
 * 단순 안내 팝업 "내용" 컴포넌트. openModal(<ModalNotice .../>)로 호출해서 사용.
 *
 * @example
 * const { openModal } = useModal();
 * openModal(<ModalNotice message={"가입이 완료되었습니다!"} />);
 */
export default function ModalNotice({
  icon = null,
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
      <ModalContent className={cn('flex flex-col items-center pt-6')}>
        {icon && <div className={cn('mb-3 flex justify-center')}>{icon}</div>}
        <p
          className={cn(
            'whitespace-pre-line text-center text-16-semibold text-gray-900',
          )}
        >
          {message}
        </p>
      </ModalContent>
      <ModalActions
        className={cn(
          'justify-center bd:justify-end pb-7 [&>button]:flex-none!',
        )}
      >
        <button
          type="button"
          className={getModalButtonClassName('primary', 'h-10 px-5')}
          onClick={handleConfirm}
        >
          {confirmText}
        </button>
      </ModalActions>
    </ModalBase>
  );
}
