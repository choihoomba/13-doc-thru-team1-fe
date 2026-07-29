import ChallengeCreatePage from '@/app/(protected)/challenges/new/page';

/**
 * 관리자 신규 챌린지 신청 페이지
 *
 * 관리자와 일반 회원이 입력하는 신청 항목은 동일하므로 회원용 신청 화면을
 * 재사용합니다. 이렇게 하면 Form 규격이나 유효성 검사 수정 시 두 페이지가
 * 서로 달라지는 문제를 막을 수 있습니다.
 *
 * 관리자 권한 확인은 상위 `(admin)` 라우트 그룹의 layout에서 처리하므로
 * 이 페이지에서 같은 인증 요청과 리다이렉트 로직을 중복하지 않습니다.
 */
export default function AdminNewChallengePage() {
  return <ChallengeCreatePage />;
}
