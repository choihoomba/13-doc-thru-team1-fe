import { redirect } from 'next/navigation';

/** 기존 경로 유지용. 신청한 챌린지 목록은 나의 챌린지 탭에서 보여준다 */
export default function AppliedChallengesPage() {
  redirect('/challenges/mine?tab=applied');
}
