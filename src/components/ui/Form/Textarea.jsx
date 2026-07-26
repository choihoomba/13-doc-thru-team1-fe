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

/*
@ Form/Textarea 전용 외형

Figma CSS:
height: 219px;
padding: 16px 20px;
border-radius: 6px;
border: 1px solid #D4D4D4;
background: #FFF;

- InputBase와 달리 여러 줄 입력을 받으므로 높이와 radius가 별도입니다.
- resize-none으로 사용자가 임의로 크기를 바꿔 페이지 레이아웃이 달라지는 것을 막습니다.
- textarea 자체에는 flex의 align-items와 gap이 실제 배치에 큰 영향을 주지 않으므로
  필요한 크기, padding, border 중심으로 작성했습니다.
*/
const TEXTAREA_CONTROL_STYLE = [
  'h-[219px]',
  'resize-none',
  'px-[20px]',
  'py-[16px]',
  'rounded-[6px]',
  'border-gray-300',
].join(' ');

/*
@ Textarea

- 신규 챌린지의 내용 입력과 같이 긴 문장을 작성하는 영역에 사용합니다.
- label, error, required 구조는 InputBase와 동일하게 유지합니다.
*/
export default function Textarea({
  id,
  className = '',
  textareaClassName = '',
  labelClassName = '',
  label,
  error,
  required = false,
  ...props
}) {
  /*
  Label, textarea, 오류 메시지를 같은 id 기준으로 연결합니다.
  */
  const generatedId = useId();
  const textareaId = id || generatedId;
  const errorId = error ? `${textareaId}-error` : undefined;

  return (
    <div className={cn(FORM_GROUP_STYLE, className)}>
      {label && (
        <Label
          htmlFor={textareaId}
          required={required}
          className={labelClassName}
        >
          {label}
        </Label>
      )}

      <textarea
        id={textareaId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={cn(
          // 모든 Form 입력이 공유하는 텍스트, focus, disabled 상태
          FORM_CONTROL_STYLE,

          // Textarea 전용 219px, padding 16px 20px, radius 6px
          TEXTAREA_CONTROL_STYLE,

          error && FORM_ERROR_STYLE,

          // 페이지별 추가 스타일이 필요한 경우 마지막에 덮어쓸 수 있습니다.
          textareaClassName,
        )}
        {...props}
      />

      {error && (
        <p id={errorId} className={FORM_MESSAGE_STYLE}>
          {error}
        </p>
      )}
    </div>
  );
}
