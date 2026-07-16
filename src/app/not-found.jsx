import React from 'react';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-[150px] text-[18px]">
      <h2 className="text-[32px] font-bold">404 Not Found</h2>
      <p className="mb-[20px]">요청한 페이지를 찾을 수 없습니다.</p>
      <p>
        <Link href="/">홈으로 이동</Link>
      </p>
    </div>
  );
}
