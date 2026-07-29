export const notificationKeys = {
  /** 알림 Query의 최상위 Key */
  all: ['notifications'],

  /** 로그인 사용자의 전체 알림 목록 Key
   * - 필터/페이지 파라미터가 없어 all과 사실상 동일하지만, 목록 쿼리임을
   * 명시하고 향후 파라미터가 붙어도 all의 다른 하위 키와 안 섞이게 분리해둠)
   */
  list: () => [...notificationKeys.all, 'list'],
};
