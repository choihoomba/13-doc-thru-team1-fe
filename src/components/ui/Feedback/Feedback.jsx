'use client';

import { useState } from 'react';

import Image from 'next/image';

import IcProfile from '@/app/assets/icons/ic_profile.png';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import ButtonKebab from '@/components/ui/Button/ButtonKebab';
import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';

/**
 * 피드백 1건 표시
 *
 * 수정하기를 누르면 내용이 편집 상태로 바뀐다. 편집 상태는 이 컴포넌트가 직접 관리하고,
 * 저장 시 onEdit으로 내용을 부모에 전달한다. (실제 API 호출은 부모 책임)
 *
 * @param feedback   피드백 데이터 { id, content, createdAt, user: { id, nickname, grade } }
 * @param canManage  수정/삭제 권한 여부. 계산 결과만 받는다 (권한 판단은 부모 책임)
 * @param onEdit     수정 완료 시 실행. (feedback, 수정된 내용)을 인자로 넘김
 * @param onDelete   삭제하기 클릭 시 실행. 해당 feedback을 인자로 넘김
 */
export default function Feedback({
  feedback,
  canManage = false,
  onEdit,
  onDelete,
  className,
}) {
  const { user, content, createdAt } = feedback;

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(content);

  // 공백만 남은 경우도 빈 값으로 취급 (백엔드 zod의 .trim().min(1)과 동일 기준)
  const isDraftEmpty = draft.trim().length === 0;

  const startEditing = () => {
    setDraft(content); // 이전 편집 내용이 남지 않도록 원본으로 초기화
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const submitEditing = () => {
    if (isDraftEmpty) return;
    onEdit?.(feedback, draft.trim());
    // 서버 응답을 기다리지 않고 편집 모드를 닫는다. 목록 갱신은 부모가 처리
    setIsEditing(false);
  };

  // Enter = 저장, Shift+Enter = 줄바꿈 (작성 입력창과 동일한 규칙)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitEditing();
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-[12px] bg-gray-50 p-[16px]',
        className,
      )}
    >
      <div className="flex gap-[8px]">
        {/* 기본 프로필 아이콘. User 모델에 이미지 필드가 없어 모든 사용자 공통 */}
        <Image
          src={IcProfile}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 flex-none rounded-full"
        />

        <div className="flex w-full items-start justify-between gap-2">
          <div>
            <p className="mb-[4px] text-14-medium text-gray-800">
              {user.nickname}
            </p>
            <p className="text-12-medium text-gray-400">
              {/* 두 번째 인자 true = 시간까지 표시 */}
              {formatDate(createdAt, true)}
            </p>
          </div>

          {/* 편집 중에는 메뉴를 숨긴다 (취소/수정 완료 버튼으로 대체) */}
          {canManage && !isEditing && (
            <ButtonKebab
              onEdit={startEditing}
              onDelete={() => onDelete?.(feedback)}
              className="shrink-0"
            />
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="mt-[12px] flex flex-col gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            autoFocus
            className={cn(
              'w-full resize-none rounded-[12px] border border-gray-200 bg-white p-[16px]',
              'text-14-regular text-gray-800 tablet:text-16-regular',
              'outline-none focus:border-brand-yellow',
            )}
          />
          <div className="flex justify-end gap-2">
            <ButtonPrimary
              variant="secondary"
              color="gray"
              size="sm"
              onClick={cancelEditing}
            >
              취소
            </ButtonPrimary>
            <ButtonPrimary
              size="sm"
              disabled={isDraftEmpty}
              onClick={submitEditing}
            >
              수정 완료
            </ButtonPrimary>
          </div>
        </div>
      ) : (
        /* whitespace-pre-wrap: 사용자가 입력한 줄바꿈 보존 */
        /* break-words: 띄어쓰기 없는 긴 문자열(URL 등)이 레이아웃을 넘치지 않게 */
        <p className="mt-[12px] whitespace-pre-wrap break-words text-14-regular text-gray-700 tablet:text-16-regular">
          {content}
        </p>
      )}
    </div>
  );
}
