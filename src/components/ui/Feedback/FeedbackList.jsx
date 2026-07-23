'use client';

import { cn } from '@/utils/cn';

import ButtonLoadMore from '@/components/ui/Button/ButtonLoadMore';

import Feedback from './Feedback';
import FeedbackTextarea from './FeedbackTextarea';

/**
 * 피드백 목록 (입력창 + 목록 + 더보기)
 *
 * 데이터와 동작을 모두 prop으로 받아, 화면 구성만 담당한다.
 * API 호출은 이 컴포넌트를 사용하는 페이지/도메인 컴포넌트에서 처리한다.
 *
 * @param feedbacks     피드백 배열
 * @param currentUser   로그인 사용자 { id, role }. 권한 계산에 사용
 * @param hasNext       다음 페이지 존재 여부 (백엔드 응답의 hasNext)
 * @param isSubmitting  전송 중 여부. 입력창 비활성화에 사용
 * @param onSubmit      피드백 작성 시 실행
 * @param onLoadMore    더보기 클릭 시 실행
 * @param onEdit        수정하기 클릭 시 실행
 * @param onDelete      삭제하기 클릭 시 실행
 */
export default function FeedbackList({
  feedbacks = [],
  currentUser,
  hasNext = false,
  isSubmitting = false,
  onSubmit,
  onLoadMore,
  onEdit,
  onDelete,
  className,
}) {
  // 피드백별 수정/삭제 권한 판단
  // 백엔드 서비스의 권한 로직(isOwner || isAdmin)과 동일한 기준을 사용한다.
  // 프론트는 버튼을 숨기고, 실제 차단은 백엔드가 담당 (이중 방어)
  const canManageFeedback = (feedback) => {
    if (!currentUser) return false;
    return currentUser.id === feedback.user.id || currentUser.role === 'ADMIN';
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* 입력창은 목록 상단에 고정 */}
      <FeedbackTextarea onSubmit={onSubmit} disabled={isSubmitting} />

      {feedbacks.length === 0 ? (
        <p className="py-8 text-center text-14-regular text-gray-400">
          아직 등록된 피드백이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {feedbacks.map((feedback) => (
            <Feedback
              key={feedback.id}
              feedback={feedback}
              canManage={canManageFeedback(feedback)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* 커서 페이지네이션: 백엔드가 hasNext를 true로 줄 때만 노출 */}
      {hasNext && <ButtonLoadMore onClick={onLoadMore} className="mx-auto" />}
    </div>
  );
}
