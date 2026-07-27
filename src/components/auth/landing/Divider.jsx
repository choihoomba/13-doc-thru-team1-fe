import { cn } from '@/utils/cn.js';

// 구분선
export default function Divider({ className }) {
  return (
    <div
      className={cn(
        'px-4',
        'tablet:px-17',
        'desktop:w-247.75 desktop:mx-auto desktop:px-0',
        className,
      )}
    >
      <div
        className={cn('h-px w-full')}
        // border-dashed는 브라우저 기본 점선 간격이라 커스텀 불가
        // repeating-linear-gradient로 dash/gap 간격 직접 제어
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, var(--color-gray-450) 0 6px, transparent 6px 12px)',
        }}
      />
    </div>
  );
}
