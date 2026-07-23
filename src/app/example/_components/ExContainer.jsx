import { cn } from '@/utils/cn';

export default function ExContainer({
  flex = 'col',
  description = '',
  children,
}) {
  return (
    <article>
      <p className={cn('mb-[26px] text-16-semibold text-gray-700')}>
        {description}
      </p>
      <div
        className={cn(
          'flex flex-wrap gap-5',
          flex !== 'col' ? 'flex-row' : 'flex-col',
        )}
      >
        {children}
      </div>
    </article>
  );
}
