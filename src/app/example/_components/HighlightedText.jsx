import { cn } from '@/utils/cn';

export default function HighlightedText({ text = '' }) {
  return (
    <span
      className={cn(
        'inline-flex py-[2px] px-[4px] rounded-[5px] bg-brand-yellow',
      )}
    >
      {text}
    </span>
  );
}
