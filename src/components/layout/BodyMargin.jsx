'use client';

import { usePathname } from 'next/navigation';

import { cn } from '@/utils/cn';

import Header from '@/components/ui/Header/Header';

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
  const excluded = isMarginExcluded(pathname);

  return (
    <>
      {!excluded && <Header />}
      <div className={cn(!excluded && 'mt-[56px] tablet:mt-[60px]')}>
        {children}
      </div>
    </>
  );
}
