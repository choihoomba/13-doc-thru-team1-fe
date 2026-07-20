'use client';

import Image from 'next/image';

import CheckIcon from '@/app/assets/icons/icon_check.svg';
import Ellipse from '@/app/assets/icons/icon_check_bg.svg';

import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

import ModalBase, { getModalButtonClassName } from './ModalBase';

/** ModalConfirm 상단 기본 아이콘 (검정 원 + 흰색 체크) */
function CheckCircleIcon() {
  return (
    <span className={cn('relative flex h-6 w-6 items-center justify-center')}>
      <Image src={Ellipse} alt="" fill sizes="24px" />
      <Image
        src={CheckIcon}
        alt=""
        width={8.643}
        height={7.143}
        className="relative z-10"
      />
    </span>
  );
}

/**
 * @example
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
  icon = <CheckCircleIcon />,
  message,
  cancelText,
  confirmText = '확인',
  onCancel,
  onConfirm,
}) {
  const { closeModal } = useModal();
  const isSingleAction = !cancelText;

  return (
    <ModalBase className={cn('flex flex-col gap-11')}>
      <div
        className={cn(
          'flex flex-col items-center gap-6 px-6',
          icon ? 'pt-6' : 'pt-20.25',
        )}
      >
        {icon && <div className={cn('flex justify-center')}>{icon}</div>}
        <p
          className={cn(
            'whitespace-pre-line text-center text-16-medium text-gray-800',
          )}
        >
          {message}
        </p>
      </div>

      {isSingleAction ? (
        <div className={cn('flex justify-center px-6', icon ? 'pb-6' : 'pb-7')}>
          <button
            type="button"
            className={getModalButtonClassName(
              'primary',
              icon ? 'h-10 w-38.25' : 'h-12 w-30',
            )}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      ) : (
        <div className={cn('flex gap-2 px-15 pb-6')}>
          <button
            type="button"
            className={getModalButtonClassName('secondary', 'h-10 flex-1')}
            onClick={onCancel ?? closeModal}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={getModalButtonClassName('primary', 'h-10 flex-1')}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      )}
    </ModalBase>
  );
}
