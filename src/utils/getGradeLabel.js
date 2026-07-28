import { GRADE_LABELS, ROLE_LABELS } from '@/lib/constants/user';

/**
 * 사용자 role/grade 응답에 맞는 화면 표시용 등급 라벨을 반환합니다.
 *
 * 관리자는 grade와 관계없이 관리자 역할을 표시합니다.
 * 회원의 grade가 없거나 알려지지 않은 값이면 일반 등급으로 대체합니다.
 *
 * @param {{ role?: string, grade?: string } | null | undefined} user
 * @returns {string}
 */
export default function getGradeLabel(user) {
  if (user?.role === 'ADMIN') return ROLE_LABELS.ADMIN;

  return GRADE_LABELS[user?.grade] ?? GRADE_LABELS.GENERAL;
}
