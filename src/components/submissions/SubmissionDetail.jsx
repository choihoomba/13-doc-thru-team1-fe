'use client';

import Image from 'next/image';

import IcProfile from '@/app/assets/icons/ic_profile.png';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import ButtonKebab from '@/components/ui/Button/ButtonKebab';
import ButtonLike from '@/components/ui/Button/ButtonLike';
import FeedbackList from '@/components/ui/Feedback/FeedbackList';

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
 * @param submission          작업물 데이터 { id, content, createdAt, isLiked, user, challenge, _count }
 * @param currentUser         로그인 사용자 { id, role }
 * @param feedbacks           피드백 배열
 * @param hasNext             피드백 다음 페이지 존재 여부
 * @param isSubmitting        피드백 전송 중 여부
 * @param onToggleLike        하트 클릭 시 실행
 * @param onEdit              작업물 수정하기 클릭 시 실행
 * @param onDelete            작업물 삭제하기 클릭 시 실행
 * @param onFeedbackSubmit    피드백 작성 시 실행
 * @param onFeedbackLoadMore  피드백 더보기 클릭 시 실행
 * @param onFeedbackEdit      피드백 수정하기 클릭 시 실행
 * @param onFeedbackDelete    피드백 삭제하기 클릭 시 실행
 */
export default function SubmissionDetail({
  submission,
  currentUser,
  feedbacks = [],
  hasNext = false,
  isSubmitting = false,
  onToggleLike,
  onEdit,
  onDelete,
  onFeedbackSubmit,
  onFeedbackLoadMore,
  onFeedbackEdit,
  onFeedbackDelete,
  className,
}) {
  const { content, createdAt, isLiked, user, challenge, _count } = submission;
  const likeCount = _count.likes;
  const isClosed = isChallengeClosed(challenge);

  // 하트 상태는 서버(React Query 캐시) 값을 그대로 그린다.
  // 낙관적 업데이트는 useToggleLike 뮤테이션이 캐시를 직접 갱신하는 방식으로 처리한다.
  const handleToggleLike = () => {
    onToggleLike?.(isLiked);
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
        'mx-auto w-full max-w-[866px] px-4 py-6 tablet:py-8',
        className,
      )}
    >
      {/* gap-4(16px)는 피그마 제목 영역 간격 기준 */}
      <header className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-20-semibold text-gray-800 tablet:text-24-semibold">
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

        {/* 칩 크기는 피그마 기준 radius 8 / padding 3·12 */}
        {/* 현재 Submission API 응답에 field/docType이 없어 값이 있을 때만 렌더 */}
        {/* TODO: ChipCategory / ChipFiled 구현되면 교체 */}
        {(challenge.field || challenge.docType) && (
          <div className="flex gap-2">
            {challenge.field && (
              <span className="rounded-[8px] bg-brand-black px-[12px] py-[3px] text-14-medium text-white">
                {challenge.field}
              </span>
            )}
            {challenge.docType && (
              <span className="rounded-[8px] bg-brand-light px-[12px] py-[3px] text-14-medium text-gray-600">
                {challenge.docType}
              </span>
            )}
          </div>
        )}

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
            <span className="text-14-medium text-gray-700">
              {user.nickname}
            </span>
            <ButtonLike
              size="sm"
              count={likeCount}
              status={isLiked ? 'active' : 'inactive'}
              onClick={handleToggleLike}
            />
          </div>

          <span className="text-14-medium text-gray-400">
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

      {/* 피드백 영역 */}
      <section className="mt-10">
        <FeedbackList
          feedbacks={feedbacks}
          currentUser={currentUser}
          isClosed={isClosed}
          hasNext={hasNext}
          isSubmitting={isSubmitting}
          onSubmit={onFeedbackSubmit}
          onLoadMore={onFeedbackLoadMore}
          onEdit={onFeedbackEdit}
          onDelete={onFeedbackDelete}
        />
      </section>
    </div>
  );
}
