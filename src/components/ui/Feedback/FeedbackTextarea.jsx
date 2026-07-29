'use client';

import { useState } from 'react';

import { cn } from '@/utils/cn';

import ButtonCircle from '@/components/ui/Button/ButtonCircle';

/**
 * 피드백 입력창
 *
 * 입력값은 내부 state로 관리하고, 전송 시점에만 onSubmit으로 부모에 전달한다.
 * (실제 저장/API 호출은 부모 책임)
 *
 * @param onSubmit     전송 시 실행. 입력 내용(문자열)을 인자로 넘김
 * @param placeholder  안내 문구
 * @param disabled     전송 중 등 입력을 막아야 할 때 true
 */
export default function FeedbackTextarea({
  onSubmit,
  placeholder = '피드백을 남겨주세요',
  disabled = false,
  className,
}) {
  const [value, setValue] = useState('');

  // 공백만 입력한 경우도 빈 값으로 취급 (백엔드 zod의 .trim().min(1)과 동일 기준)
  const isEmpty = value.trim().length === 0;

  const handleSubmit = () => {
    if (isEmpty || disabled) return;
    onSubmit?.(value.trim()); // 부모가 정의한 동작 실행
    setValue(''); // 전송 후 입력창 비우기
  };

  // Enter = 전송, Shift+Enter = 줄바꿈
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={cn('flex items-start gap-[17px] tablet:gap-[24px]', className)}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={2}
        className={cn(
          'min-h-[89px] rounded-[12px] border border-gray-200 p-[16px]',
          'w-full resize-none bg-white',
          'text-14-regular text-gray-800 placeholder:text-gray-400',
          'outline-none focus:border-brand-yellow disabled:cursor-not-allowed',
          'tablet:text-16-medium',
        )}
      />

      {/* 공통 원형 버튼. 활성/비활성 아이콘 전환은 ButtonCircle이 처리 */}
      <ButtonCircle
        variant="primary"
        onClick={handleSubmit}
        disabled={isEmpty || disabled}
        aria-label="피드백 등록"
        className="h-fit"
      />
    </div>
  );
}
