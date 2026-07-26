import clientFetch from './clientFetch';
import { ENDPOINTS } from './endpoints';

/** 로그인 사용자의 전체 알림을 최신순으로 조회합니다. */
export function getNotifications() {
  return clientFetch(ENDPOINTS.notifications);
}

/** 선택한 알림을 읽음 상태로 변경합니다. */
export function markNotificationAsRead(notificationId) {
  return clientFetch(`${ENDPOINTS.notifications}/${notificationId}/read`, {
    method: 'PATCH',
  });
}
