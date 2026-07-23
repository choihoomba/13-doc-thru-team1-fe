'use client';

import { useState } from 'react';

import { cn } from '@/utils/cn';

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
      e.preventDefault(); // 기본 줄바꿈 방지
      handleSubmit();
    }
  };

  return (
    <div
      className={cn(
        // relative: 전송 버튼(absolute)의 기준점
        'relative w-full rounded-lg border border-gray-200 bg-gray-50',
        // 입력창 내부에 포커스가 있으면 테두리 강조
        'focus-within:border-brand',
        className,
      )}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className={cn(
          // pr-12: 전송 버튼과 텍스트가 겹치지 않도록 오른쪽 여백 확보
          'w-full resize-none bg-transparent px-4 py-3 pr-12',
          'text-14-regular text-gray-800 placeholder:text-gray-400',
          'outline-none disabled:cursor-not-allowed',
        )}
      />

      {/* 전송 버튼: 우측 하단 고정 */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isEmpty || disabled}
        aria-label="피드백 등록"
        className={cn(
          'absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full transition-colors',
          'bg-brand text-white',
        )}
      >
        {/* 전송 아이콘. assets/icons에 전송 아이콘 추가되면 교체 */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
      </button>
    </div>
  );
}
