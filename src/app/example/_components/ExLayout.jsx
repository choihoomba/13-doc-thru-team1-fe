import { cn } from '@/utils/cn';

export default function ExLayout({ title = '', children }) {
  return (
    <section
      className={cn(
        'flex flex-col gap-[20px] pb-[24px] mb-[24px] p-[20px] border-1 rounded-[12px]',
      )}
    >
      <p className={cn('mb-[12px] text-22-bold')}>{title}</p>
      {children}
    </section>
  );
}
