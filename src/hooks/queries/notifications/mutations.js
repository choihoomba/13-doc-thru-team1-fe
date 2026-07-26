import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markNotificationAsRead } from '@/lib/api/notifications';

import { notificationKeys } from './keys';

/** 읽음 처리 성공 시 목록 캐시도 즉시 같은 상태로 맞춥니다. */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (updatedNotification) => {
      queryClient.setQueryData(notificationKeys.list(), (notifications = []) =>
        notifications.map((notification) =>
          notification.id === updatedNotification.id
            ? updatedNotification
            : notification,
        ),
      );
    },
  });
}
