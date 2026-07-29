'use client';

import { useState } from 'react';

import Image from 'next/image';

import OutIcon from '@/app/assets/icons/icon_out.svg';

import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';
import ModalBase from '@/components/ui/Modal/ModalBase';

// 어드민 챌린지 신청 거절 API를 처리하는 전용 모달입니다.
// 공통 모달을 변경하지 않고 비동기 전송 상태와 오류를 이곳에서 관리합니다.
export default function AdminChallengeRejectModal({
  title = '거절 사유',
  label = '내용',
  placeholder = '거절 사유를 입력해주세요',
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
        <div className="flex items-center justify-between">
          <h2 className="text-18-bold">{title}</h2>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={closeModal}
            aria-label="닫기"
            className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Image src={OutIcon} alt="" width={24} height={24} />
          </button>
        </div>

        <div className="mt-[24px] flex flex-1 flex-col">
          <label
            htmlFor="admin-challenge-reject-reason"
            className="mb-2 block text-body-16-160 text-gray-900"
          >
            {label}
          </label>

          <textarea
            id="admin-challenge-reject-reason"
            aria-describedby={
              submitError ? 'admin-challenge-reject-error' : undefined
            }
            maxLength={maxLength}
            disabled={isSubmitting}
            className={cn(
              'mb-4 box-border w-full flex-1 resize-none',
              'rounded-md border border-gray-300 px-5 py-4',
              'desktop:mb-6',
              'text-16-regular text-gray-900 placeholder:text-gray-500',
              'focus:border-gray-800 focus:outline-none',
              'disabled:cursor-not-allowed disabled:bg-gray-50',
            )}
            placeholder={placeholder}
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              setSubmitError('');
            }}
          />

          {submitError && (
            <p
              id="admin-challenge-reject-error"
              role="alert"
              className="mb-[8px] text-12-regular text-red-error"
            >
              {submitError}
            </p>
          )}

          <ButtonPrimary
            size="xxl"
            disabled={isEmpty || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? '전송 중' : submitText}
          </ButtonPrimary>
        </div>
      </div>
    </ModalBase>
  );
}
