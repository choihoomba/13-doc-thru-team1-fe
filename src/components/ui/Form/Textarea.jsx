'use client';

import { useId } from 'react';

import { cn } from '@/utils/cn';

import {
  FORM_CONTROL_STYLE,
  FORM_ERROR_STYLE,
  FORM_GROUP_STYLE,
  FORM_MESSAGE_STYLE,
} from './formStyles';
import Label from './Label';

const TEXTAREA_CONTROL_STYLE = [
  'min-h-[228px]',
  'resize-none',
  'border-gray-300',
  'py-[14px]',
].join(' ');

/*
@ Textarea
- 신규 챌린지 내용과 거절 사유 화면에서 공통으로 확인한 228px 높이를 사용합니다.
- 사용자가 임의로 크기를 바꾸면 Figma 레이아웃이 달라지므로 resize를 막습니다.
- 나머지 focus, disabled, error 상태는 다른 Form 컴포넌트와 공유합니다.
*/
export default function Textarea({
  id,
  className = '',
  textareaClassName = '',
  label,
  error,
  required = false,
  ...props
}) {
  // Label, 오류 메시지, textarea를 같은 id 기준으로 연결합니다.
  const generatedId = useId();
  const textareaId = id || generatedId;
  const errorId = error ? `${textareaId}-error` : undefined;

  return (
    <div className={cn(FORM_GROUP_STYLE, className)}>
      {label && (
        <Label htmlFor={textareaId} required={required}>
          {label}
        </Label>
      )}

      <textarea
        id={textareaId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={cn(
          FORM_CONTROL_STYLE,
          TEXTAREA_CONTROL_STYLE,
          error && FORM_ERROR_STYLE,
          textareaClassName,
        )}
        {...props}
      />

      {/* 오류 메시지는 필요할 때만 렌더링하고 textarea와 연결합니다. */}
      {error && (
        <p id={errorId} className={FORM_MESSAGE_STYLE}>
          {error}
        </p>
      )}
    </div>
  );
}
