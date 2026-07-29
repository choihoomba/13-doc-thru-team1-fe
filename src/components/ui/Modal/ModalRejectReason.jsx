'use client';

import { useState } from 'react';

import Image from 'next/image';

import OutIcon from '@/app/assets/icons/icon_out.svg';

import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

import ButtonPrimary from '../Button/ButtonPrimary';
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
  maxLength = 100,
  onSubmit,
}) {
  const { closeModal } = useModal();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const isEmpty = !reason.trim();

  const handleSubmit = async () => {
    if (isEmpty || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await onSubmit?.(reason.trim());
      setReason('');
      closeModal();
    } catch (error) {
      setSubmitError(error.message ?? '거절 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalBase className={cn('w-[min(90vw,343px)]', 'tablet:w-[496px]')}>
      <div
        className={cn(
          'flex h-[407px] flex-col px-[16px] pt-[16px] pb-[24px]',
          'tablet:h-[423px] tablet:p-[24px]',
        )}
      >
        <div className={cn('flex items-center justify-between')}>
          <h2 className={cn('text-18-bold')}>{title}</h2>
          <button
            type="button"
            onClick={closeModal}
            aria-label="닫기"
            className={cn('cursor-pointer')}
          >
            <Image src={OutIcon} alt="" width={24} height={24} />
          </button>
        </div>
        <div className={cn('flex flex-1 flex-col mt-[24px]')}>
          <label
            htmlFor="reject-reason"
            className={cn('mb-2 block text-body-16-160 text-gray-900')}
          >
            {label}
          </label>
          {/* TODO: Form/Label 만들어지면 넣어야함 */}
          <textarea
            id="reject-reason"
            aria-describedby={submitError ? 'reject-reason-error' : undefined}
            maxLength={maxLength}
            disabled={isSubmitting}
            className={cn(
              'box-border w-full flex-1 resize-none rounded-md border border-gray-300 px-5 py-4 mb-4',
              'desktop:mb-6',
              'text-16-regular text-gray-900 placeholder:text-gray-500',
              'focus:border-gray-800 focus:outline-none',
            )}
            placeholder={placeholder}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setSubmitError('');
            }}
          />
          {/* TODO: Form/Textarea 만들어지면 넣어야함 */}
          {submitError && (
            <p
              id="reject-reason-error"
              role="alert"
              className="mb-[8px] text-12-regular text-red-error"
            >
              {submitError}
            </p>
          )}
          <ButtonPrimary
            size="xxl"
            onClick={handleSubmit}
            disabled={isEmpty || isSubmitting}
          >
            {isSubmitting ? '전송 중' : submitText}
          </ButtonPrimary>
        </div>
      </div>
    </ModalBase>
  );
}
