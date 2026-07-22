'use client';

import { useState } from 'react';

import Toast from '../../components/ui/Toast';

/**
 * TODO: 나중에 지우기
 */
export default function DevPlayground() {
  const [isToastOpen, setIsToastOpen] = useState(false);
  const handleLoad = () => {
    setIsToastOpen(false);
  };

  return (
    <div className="max-w-380 mx-auto my-10 rounded-2xl border border-gray-200 p-6">
      <h2 className="mb-4 text-18-bold text-gray-900">Toast 테스트</h2>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => setIsToastOpen(true)}>토스트 열기</button>
        <Toast
          isOpen={isToastOpen}
          onClose={() => setIsToastOpen(false)}
          onLoad={handleLoad}
        />
      </div>
    </div>
  );
}
