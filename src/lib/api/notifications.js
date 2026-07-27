import clientFetch from './clientFetch';
import { ENDPOINTS } from './endpoints';

/** 로그인 사용자의 전체 알림을 최신순으로 조회합니다. */
export async function getNotifications() {
  const response = await clientFetch(ENDPOINTS.notifications);

  // 백엔드 공통 응답 { success, data }에서 알림 배열만 query에 전달합니다.
  return response.data ?? [];
}

/** 선택한 알림을 읽음 상태로 변경합니다. */
export async function markNotificationAsRead(notificationId) {
  const response = await clientFetch(
    `${ENDPOINTS.notifications}/${notificationId}/read`,
    {
      method: 'PATCH',
    },
  );

  // mutation 캐시에는 응답 wrapper가 아닌 갱신된 알림 객체가 필요합니다.
  return response.data;
}
