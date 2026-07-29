import { cn } from '@/utils/cn';

/**
 * 챌린지 목록이 비어 있을 때 보여주는 안내 컴포넌트입니다.
 *
 * API 요청 실패가 아니라 정상적으로 챌린지가 0개인 상태이므로
 * ErrorDisplay와 분리해서 사용합니다.
 *
 * 사용 예시:
 * <ChallengeEmptyState />
 */
export default function ChallengeEmptyState({ className = '', ...props }) {
  return (
    <div
      role="status"
      className={cn(
        // 모바일 Figma 크기: 184px × 34px
        'w-[184px] text-center text-14-regular text-gray-500',

        // 태블릿과 데스크톱: 210px × 38px
        'tablet:w-[210px] tablet:text-16-regular',

        className,
      )}
      {...props}
    >
      <p>
        아직 챌린지가 없어요,
        <br />
        지금 바로 챌린지를 신청해보세요!
      </p>
    </div>
  );
}
