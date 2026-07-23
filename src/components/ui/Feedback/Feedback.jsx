'use client';

import { useState, useRef, useEffect } from 'react';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

/**
 * 피드백 1건 표시
 *
 * @param feedback   피드백 데이터 { id, content, createdAt, user: { id, nickname, grade } }
 * @param canManage  수정/삭제 권한 여부. 계산 결과만 받는다 (권한 판단은 부모 책임)
 * @param onEdit     수정하기 클릭 시 실행. 해당 feedback을 인자로 넘김
 * @param onDelete   삭제하기 클릭 시 실행. 해당 feedback을 인자로 넘김
 */
export default function Feedback({
  feedback,
  canManage = false,
  onEdit,
  onDelete,
  className,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // 바깥 클릭 판별을 위해 메뉴 영역 DOM을 참조

  // 메뉴 바깥을 클릭하면 닫기
  // 메뉴는 스스로 닫힐 수단이 없으므로 document 전체의 클릭을 감시한다
  useEffect(() => {
    if (!isMenuOpen) return; // 닫혀 있으면 감시할 필요 없음

    function handleClickOutside(e) {
      // 클릭 지점이 메뉴 영역 밖이면 닫는다
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    // 메뉴가 닫히거나 컴포넌트가 사라질 때 이벤트 해제 (쌓이면 메모리 누수)
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const { user, content, createdAt } = feedback;

  return (
    <div className={cn('flex gap-3 rounded-lg bg-gray-50 p-4', className)}>
      {/* 아바타 자리. assets/icons에 프로필 아이콘 추가되면 교체 */}
      {/* 기본 프로필 아이콘. User 모델에 이미지 필드가 없어 모든 사용자 공통 */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-yellow">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white"
        >
          <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
          <path d="M12 14c-5 0-9 2.5-9 5.5V22h18v-2.5c0-3-4-5.5-9-5.5Z" />
        </svg>
      </div>

      {/* min-w-0: 긴 텍스트가 flex 컨테이너를 밀어내지 않도록 (break-words와 한 세트) */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-14-medium text-gray-800">{user.nickname}</p>
            <p className="text-12-regular text-gray-400">
              {/* 두 번째 인자 true = 시간까지 표시 */}
              {formatDate(createdAt, true)}
            </p>
          </div>

          {/* 권한이 있을 때만 ⋮ 노출 (기획: 권한 있는 경우에만 버튼 표시) */}
          {canManage && (
            <div ref={menuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="피드백 메뉴"
                aria-expanded={isMenuOpen}
                className="rounded p-1 text-gray-400 hover:bg-gray-100"
              >
                ⋮
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 w-28 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onEdit?.(feedback); // 실제 수정 동작은 부모가 정의
                    }}
                    className="block w-full px-4 py-2 text-left text-14-regular text-gray-700 hover:bg-gray-50"
                  >
                    수정하기
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDelete?.(feedback);
                    }}
                    className="block w-full px-4 py-2 text-left text-14-regular text-gray-700 hover:bg-gray-50"
                  >
                    삭제하기
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* whitespace-pre-wrap: 사용자가 입력한 줄바꿈 보존 */}
        {/* break-words: 띄어쓰기 없는 긴 문자열(URL 등)이 레이아웃을 넘치지 않게 */}
        <p className="mt-2 whitespace-pre-wrap break-words text-body-14-160 text-gray-700">
          {content}
        </p>
      </div>
    </div>
  );
}
