import Link from 'next/link';

import { cn } from '@/utils/cn';

const ADMIN_NAV_ITEMS = [
  {
    key: 'manage',
    label: '챌린지 관리',
    href: '/admin/manage',
  },
  {
    key: 'list',
    label: '챌린지 목록',
    href: '/admin/challenges',
  },
];

/**
 * pathname을 기준으로 관리자 메뉴의 활성 상태를 계산합니다.
 * 예제 페이지는 activeAdminNav를 전달해 특정 상태를 고정할 수 있습니다.
 */
export function getActiveAdminNav(activeAdminNav, pathname) {
  if (activeAdminNav !== undefined) return activeAdminNav;

  const matchedItem = ADMIN_NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return matchedItem?.key ?? null;
}

export default function AdminNavigation({ activeAdminNav }) {
  return (
    <nav aria-label="관리자 메뉴" className="flex items-center">
      {ADMIN_NAV_ITEMS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          aria-current={activeAdminNav === item.key ? 'page' : undefined}
          className={cn(
            'flex w-[76px] items-center justify-center whitespace-nowrap text-center text-13-bold',
            'min-[600px]:w-[103px] min-[600px]:text-[15px] min-[600px]:leading-[18px] min-[600px]:font-bold',
            activeAdminNav === item.key ? 'text-gray-800' : 'text-gray-500',
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
