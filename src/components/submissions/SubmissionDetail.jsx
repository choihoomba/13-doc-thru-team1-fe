'use client';

import { useState } from 'react';

import Image from 'next/image';

import IcProfile from '@/app/assets/icons/ic_profile.png';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import ButtonKebab from '@/components/ui/Button/ButtonKebab';
import ButtonLike from '@/components/ui/Button/ButtonLike';

/** 챌린지 마감 여부. 크론이 아직 status를 바꾸지 않았을 수 있어 deadline도 함께 확인 */
function isChallengeClosed(challenge) {
  return (
    challenge.status === 'CLOSED' || new Date(challenge.deadline) < new Date()
  );
}

/**
 * 작업물 상세 내용 (일반/어드민 페이지 공통)
 *
 * 데이터와 동작을 prop으로 받아 화면만 구성한다.
 * API 호출은 이 컴포넌트를 사용하는 페이지에서 처리한다.
 *
 * @param submission   작업물 데이터 { id, content, createdAt, isLiked, user, challenge, _count }
 * @param currentUser  로그인 사용자 { id, role }
 * @param onToggleLike 하트 클릭 시 실행
 * @param onEdit       작업물 수정하기 클릭 시 실행
 * @param onDelete     작업물 삭제하기 클릭 시 실행
 */
export default function SubmissionDetail({
  submission,
  currentUser,
  onToggleLike,
  onEdit,
  onDelete,
  className,
}) {
  const { content, createdAt, user, challenge, _count } = submission;
  const isClosed = isChallengeClosed(challenge);

  // 하트는 서버 값으로 시작하고, 클릭 시 응답을 기다리지 않고 화면에 먼저 반영한다
  const [isLiked, setIsLiked] = useState(submission.isLiked);
  const [likeCount, setLikeCount] = useState(_count.likes);

  const handleToggleLike = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    onToggleLike?.(!isLiked);
  };

  // 작업물 수정/삭제 권한: 작성자 본인 또는 어드민
  // 마감된 챌린지의 작업물은 수정/삭제 불가 (요구사항)
  const canManage =
    !isClosed &&
    !!currentUser &&
    (currentUser.id === user.id || currentUser.role === 'ADMIN');

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[826px] px-4 py-6 tablet:py-8',
        className,
      )}
    >
      <header className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-18-bold text-gray-800 tablet:text-20-bold">
            {challenge.title}
          </h1>

          {/* 권한이 있을 때만 노출 (기획: 권한 있는 경우에만 버튼 표시) */}
          {canManage && (
            <ButtonKebab
              onEdit={() => onEdit?.(submission)}
              onDelete={() => onDelete?.(submission)}
              className="shrink-0"
            />
          )}
        </div>

        {/* TODO: ChipCategory / ChipFiled 구현되면 교체 */}
        <div className="flex gap-2">
          <span className="rounded-full bg-brand-black px-3 py-1 text-12-medium text-white">
            {challenge.field}
          </span>
          <span className="rounded-full bg-brand-light px-3 py-1 text-12-medium text-gray-600">
            {challenge.docType}
          </span>
        </div>

        {/* 작성자 · 하트 · 작성일 */}
        <div className="flex items-center justify-between gap-2 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <Image
              src={IcProfile}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 flex-none rounded-full"
            />
            <span className="text-13-medium text-gray-700">
              {user.nickname}
            </span>
            <ButtonLike
              size="sm"
              count={likeCount}
              status={isLiked ? 'active' : 'inactive'}
              onClick={handleToggleLike}
            />
          </div>

          <span className="text-13-regular text-gray-400">
            {formatDate(createdAt)}
          </span>
        </div>
      </header>

      {/* 번역 본문 — 작성자가 입력한 줄바꿈 보존 */}
      <article
        className={cn(
          'mt-6 whitespace-pre-wrap break-words',
          'text-body-14-160 text-gray-700 tablet:text-body-16-160',
        )}
      >
        {content}
      </article>

      {/* TODO: 공통 컴포넌트 PR(#49) 머지 후 FeedbackList 연결
          <FeedbackList
            feedbacks={feedbacks}
            currentUser={currentUser}
            isClosed={isClosed}
            hasNext={hasNext}
            onSubmit={...} onLoadMore={...} onEdit={...} onDelete={...}
          />
      */}
      <section className="mt-10 rounded-[12px] border border-dashed border-gray-300 p-8 text-center text-14-regular text-gray-400">
        피드백 영역 (공통 컴포넌트 머지 후 연결 예정)
      </section>
    </div>
  );
}
