'use client';

import Image from 'next/image';

import IcProfile from '@/app/assets/icons/ic_profile.png';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import ButtonKebab from '@/components/ui/Button/ButtonKebab';

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
  const { user, content, createdAt } = feedback;

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

          {/* 권한이 있을 때만 노출 (기획: 권한 있는 경우에만 버튼 표시) */}
          {/* 공통 ButtonKebab이 열림/닫힘·바깥클릭·z-index를 자체 처리 */}
          {canManage && (
            <ButtonKebab
              onEdit={() => onEdit?.(feedback)}
              onDelete={() => onDelete?.(feedback)}
              className="shrink-0"
            />
          )}
        </div>
      </div>

      {/* whitespace-pre-wrap: 사용자가 입력한 줄바꿈 보존 */}
      {/* break-words: 띄어쓰기 없는 긴 문자열(URL 등)이 레이아웃을 넘치지 않게 */}
      <p className="mt-[12px] whitespace-pre-wrap break-words text-14-regular text-gray-700 tablet:text-16-regular">
        {content}
      </p>
    </div>
  );
}
