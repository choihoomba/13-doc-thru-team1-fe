'use client';

import { usePathname } from 'next/navigation';

import { cn } from '@/utils/cn';

const EXCLUDED_PATHS = [
  '/signin',
  '/signup',
  '/submissions/new',
  /^\/submissions\/[^/]+\/edit$/,
  /^\/admin\/submissions\/[^/]+\/edit$/,
];

function isMarginExcluded(pathname) {
  return EXCLUDED_PATHS.some((matcher) =>
    typeof matcher === 'string' ? matcher === pathname : matcher.test(pathname),
  );
}

// mobile:mt-[56px] tablet:mt-[60px]
export default function BodyMargin({ children }) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        !isMarginExcluded(pathname) && 'mt-[56px] tablet:mt-[60px]',
      )}
    >
      {children}
    </div>
  );
}
