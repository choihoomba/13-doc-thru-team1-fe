'use client';

import Image from 'next/image';

import CheckIcon from '@/app/assets/icons/icon_check.svg';
import Ellipse from '@/app/assets/icons/icon_check_bg.svg';

import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';

import ModalBase from './ModalBase';

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
  icon = <CheckCircleIcon />,
  message,
  cancelText,
  confirmText = '확인',
  onCancel,
  onConfirm,
}) {
  const { closeModal } = useModal();

  return (
    <ModalBase className={cn('flex flex-col gap-11')}>
      <div className={cn('flex flex-col items-center gap-8  pt-6')}>
        <div className={cn('flex justify-center')}>{icon}</div>
        <p className={cn('whitespace-pre-line text-center text-16-medium')}>
          {message}
        </p>
      </div>

      {!cancelText ? (
        <div className={cn('flex justify-center px-6 pb-6')}>
          <ButtonPrimary size="lg" onClick={onConfirm}>
            {confirmText}
          </ButtonPrimary>
        </div>
      ) : (
        <div className={cn('flex gap-2 px-15 pb-6')}>
          <ButtonPrimary
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={onCancel ?? closeModal}
          >
            {cancelText}
          </ButtonPrimary>
          <ButtonPrimary size="lg" className="flex-1" onClick={onConfirm}>
            {confirmText}
          </ButtonPrimary>
        </div>
      )}
    </ModalBase>
  );
}
