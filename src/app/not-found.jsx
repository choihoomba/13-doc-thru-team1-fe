import React from 'react';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-[150px] text-brand-black">
      <h2 className="mb-[10px] text-24-bold">404 Not Found</h2>
      <p className="mb-[20px] text-20-semibold">
        요청한 페이지를 찾을 수 없습니다.
      </p>
      <p>
        {/* TODO: Button 컴포넌트로 수정 */}
        <Link href="/">홈으로 이동</Link>
      </p>
    </div>
  );
}
