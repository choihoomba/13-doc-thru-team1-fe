/**
 * 상수 작성 가이드라인
 * 1. 상수(키) 이름은 대문자 스네이크 케이스로 작성한다. (예: CHALLENGE_TABS, ONGOING)
 * 2. 서로 관련된 상수는 낱개로 export하지 않고, 아래처럼 하나의 객체로 묶어서 export한다.
 * 3. 값(value)은 API 쿼리 파라미터 등 실제 사용처와 맞춰 소문자 문자열로 작성한다.
 */

// TODO: 예시 코드입니다. 추후 삭제 예정입니다.
export const CHALLENGE_TABS = {
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  APPLIED: 'applied',
};
