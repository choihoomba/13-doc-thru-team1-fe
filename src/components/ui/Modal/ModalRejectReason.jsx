'use client';

import { useState } from 'react';

import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

import ButtonSecondary from '@/components/ui/Button/ButtonSecondary';

import ModalBase from './ModalBase';

/**
 * 거절 사유 입력 모달
 *
 * @example
 * const { openModal } = useModal();
 * openModal(<ModalRejectReason onSubmit={(reason) => handleReject(reason)} />);
 */
export default function ModalRejectReason({
  title = '거절 사유',
  label = '내용',
  placeholder = '거절사유를 입력해주세요',
  submitText = '전송',
  onSubmit,
}) {
  const { closeModal } = useModal();
  const [reason, setReason] = useState('');
  const isEmpty = !reason.trim();

  const handleSubmit = () => {
    if (isEmpty) return; // 빈 사유 제출 방지
    onSubmit?.(reason);
    setReason('');
    closeModal();
  };

  return (
    <ModalBase title={title} onCloseIconClick={closeModal}>
      <div className={cn('px-6')}>
        <label className={cn('mb-4 block text-16-regular text-gray-900')}>
          {label}
        </label>
        <textarea
          className={cn(
            'box-border min-h-[219px] w-full resize-y rounded-md border border-gray-300 px-5 py-4',
            'text-16-regular text-gray-900 mb-4 placeholder:text-gray-500',
            'focus:border-gray-900 focus:outline-none',
          )}
          placeholder={placeholder}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={6}
        />
      </div>
      <div className={cn('flex gap-2 px-6 pb-6')}>
        <ButtonSecondary
          size="md"
          className="flex-1"
          onClick={handleSubmit}
          disabled={isEmpty}
        >
          {submitText}
        </ButtonSecondary>
      </div>
    </ModalBase>
  );
}
