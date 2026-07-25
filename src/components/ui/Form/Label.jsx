import { cn } from '@/utils/cn';

/*
@ Label
- 모든 Form 컴포넌트가 globals.css의 동일한 14px 타이포 토큰을 사용합니다.
- htmlFor는 각 입력 요소의 id와 연결되어 라벨을 눌러도 입력창에 접근할 수 있습니다.
- 필수 표시는 화면과 스크린 리더 양쪽에 전달합니다.
*/
export default function Label({
  className = '',
  required = false,
  children,
  ...props
}) {
  return (
    <label className={cn('text-14-medium text-gray-900', className)} {...props}>
      {children}
      {required && (
        <>
          {/* 별표는 화면에만 보여주고 중복 낭독되지 않도록 숨깁니다. */}
          <span className="text-red-error" aria-hidden="true">
            {' '}
            *
          </span>

          {/* 스크린 리더에는 별표 대신 의미가 분명한 문장을 제공합니다. */}
          <span className="sr-only">필수 입력</span>
        </>
      )}
    </label>
  );
}
