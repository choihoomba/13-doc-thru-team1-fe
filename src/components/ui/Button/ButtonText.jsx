import Link from 'next/link';

import { cn } from '@/utils/cn';

import { BUTTON_BASE_STYLE } from '@/components/ui/Button/buttonStyles';

/** 텍스트 스타일 버튼 */
export default function ButtonText({
  as,
  className = '',
  href,
  text = '',
  ...props
}) {
  // href가 있으면 Link, 없으면 button으로 렌더링
  const Component = as || (href ? Link : 'button');
  const isNativeButton = Component === 'button';

  return (
    <Component
      className={cn(
        BUTTON_BASE_STYLE,
        'block text-16-regular underline decoration-solid decoration-auto underline-offset-[3px]',
        className,
      )}
      {...(href ? { href } : {})}
      {...(isNativeButton ? { type: 'button' } : {})}
      {...props}
    >
      {text}
    </Component>
  );
}
