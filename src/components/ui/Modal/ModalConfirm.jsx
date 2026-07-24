'use client';

import Image from 'next/image';

import CheckIcon from '@/app/assets/icons/icon_check.svg';

import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';

import ModalBase from './ModalBase';

/**
 * 체크표시가 들어간 모달들 (단일버튼/2개버튼)
 * @example
 * - 단일 버튼
 * openModal(
      <ModalConfirm
        message={'로그인이 필요한 기능이에요\n로그인 하시겠어요?'}
        confirmText="로그인하러 가기"
        onConfirm={closeModal}
      />,
    );
 * 
    - 버튼 2개
 * const { openModal, closeModal } = useModal();
 * openModal(
 *   <ModalConfirm
 *     message={"정말 삭제하시겠어요?"}
 *     cancelText="아니오"
 *     confirmText="네"
 *     onConfirm={() => { handleDelete(); closeModal(); }}
 *   />
 * );
 */
export default function ModalConfirm({
  icon = <Image src={CheckIcon} alt="" width={24} height={24} />,
  message,
  cancelText,
  confirmText = '확인',
  onCancel,
  onConfirm,
}) {
  const { closeModal } = useModal();

  return (
    <ModalBase className={cn('flex flex-col p-6')}>
      <div className={cn('flex flex-col items-center')}>
        <div className={cn('flex justify-center')}>{icon}</div>
        <p
          className={cn(
            'whitespace-pre-line text-center mt-[24px] mb-[32px] text-16-medium',
          )}
        >
          {message}
        </p>
      </div>

      {!cancelText ? (
        <div className={cn('flex justify-center items-center')}>
          <ButtonPrimary size="lg" onClick={onConfirm}>
            {confirmText}
          </ButtonPrimary>
        </div>
      ) : (
        <div className={cn('flex items-center justify-center gap-2 ')}>
          <ButtonPrimary
            variant="secondary"
            size="lg"
            onClick={onCancel ?? closeModal}
          >
            {cancelText}
          </ButtonPrimary>
          <ButtonPrimary size="lg" onClick={onConfirm}>
            {confirmText}
          </ButtonPrimary>
        </div>
      )}
    </ModalBase>
  );
}
