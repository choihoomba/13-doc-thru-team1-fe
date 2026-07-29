import { cn } from '@/utils/cn';

/*
@ Label

- 모든 Form 컴포넌트가 동일한 라벨 스타일을 사용하도록 분리한 공통 컴포넌트입니다.
- htmlFor는 InputBase, Select, InputCalendar, Textarea의 id와 연결됩니다.
- 페이지별 label 문구는 children으로 전달받기 때문에 공통 컴포넌트에 고정되지 않습니다.
*/
export default function Label({
  className = '',
  required = false,
  children,
  ...props
}) {
  return (
    <label
      className={cn(
        // globals.css의 14px medium 타이포그래피와 gray-900 색상 토큰
        'text-14-medium text-gray-900',
        className,
      )}
      {...props}
    >
      {children}

      {required && (
        <>
          {/*
            화면에는 필수 항목임을 별표로 표시합니다.
            aria-hidden을 사용해 스크린 리더가 별표 문자를 불필요하게 읽지 않도록 합니다.
          */}
          <span className="text-red-error" aria-hidden="true">
            {' '}
            *
          </span>

          {/*
            스크린 리더에는 별표 대신 의미가 명확한 "필수 입력" 문구를 제공합니다.
          */}
          <span className="sr-only">필수 입력</span>
        </>
      )}
    </label>
  );
}
