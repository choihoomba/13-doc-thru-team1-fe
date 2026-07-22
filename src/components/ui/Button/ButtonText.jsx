import Link from 'next/link';

import { cn } from '@/utils/cn';

import { BUTTON_BASE_STYLE } from '@/components/ui/Button/buttonStyles';

/** 텍스트 스타일 버튼 */
export default function ButtonText({
  className = '',
  href,
  text = '',
  ...props
}) {
  return (
    <Link
      className={cn(
        BUTTON_BASE_STYLE,
        'block text-16-regular underline decoration-solid decoration-auto underline-offset-[3px]',
        className,
      )}
      href={href}
      {...props}
    >
      {text}
    </Link>
  );
}
