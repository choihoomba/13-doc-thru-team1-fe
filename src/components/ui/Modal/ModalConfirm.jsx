'use client';

import Image from 'next/image';

import Ellipse from '@/app/assets/icons/Ellipse 15.svg';
import CheckIcon from '@/app/assets/icons/icon_check.svg';

import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

import ModalBase, { getModalButtonClassName } from './ModalBase';

/** ModalConfirm 상단 기본 아이콘 (검정 원 + 흰색 체크) */
function CheckCircleIcon() {
  return (
    <span className={cn('relative flex h-10 w-10 items-center justify-center')}>
      <Image src={Ellipse} alt="" fill sizes="40px" />
      <Image
        src={CheckIcon}
        alt=""
        width={14}
        height={11}
        className="relative z-10"
      />
    </span>
  );
}

/**
 * 확인/취소형 모달 "내용" 컴포넌트. openModal(<ModalConfirm .../>)로 호출해서 사용.
 * cancelText를 넘기지 않으면 버튼 1개(단일 액션, 예: "로그인하러 가기")로 렌더링됨.
 * icon은 기본으로 체크 아이콘이 뜨고, icon={null}을 넘기면 아이콘 없이 렌더링됨.
 *
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
        <div className={cn('flex gap-2 px-6 pb-6')}>
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
