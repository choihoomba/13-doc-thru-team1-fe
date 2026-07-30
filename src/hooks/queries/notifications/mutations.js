import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markNotificationAsRead } from '@/lib/api/notifications';

import { notificationKeys } from './keys';

/** 읽음 처리 성공 시 목록 캐시도 즉시 같은 상태로 맞춥니다. */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (updatedNotification) => {
      queryClient.setQueryData(
        notificationKeys.list(),
        (notifications = []) => {
          /*
           * 서버의 알림 목록은 생성일 기준으로 정렬되어 있습니다.
           * 읽음 처리된 알림을 기존 날짜 위치에 그대로 교체하면 사용자가
           * 기대하는 "안 읽음 먼저, 읽음은 아래" 순서가 흐트러져 보일 수 있습니다.
           *
           * 따라서 방금 읽은 알림을 목록에서 먼저 제거한 뒤,
           * 안 읽은 알림 → 기존에 읽은 알림 → 방금 읽은 알림 순으로 재배치합니다.
           * 백엔드 재요청 없이 현재 화면의 알림 순서가 즉시 갱신됩니다.
           */
          const remainingNotifications = notifications.filter(
            (notification) => notification.id !== updatedNotification.id,
          );
          const unreadNotifications = remainingNotifications.filter(
            (notification) => !notification.isRead,
          );
          const readNotifications = remainingNotifications.filter(
            (notification) => notification.isRead,
          );

          return [
            ...unreadNotifications,
            ...readNotifications,
            updatedNotification,
          ];
        },
      );
    },
  });
}
