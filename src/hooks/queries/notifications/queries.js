import { useQuery } from '@tanstack/react-query';

import { getNotifications } from '@/lib/api/notifications';

import { notificationKeys } from './keys';

/**
 * Header가 사용하는 챌린지 알림만 반환합니다.
 *
 * 백엔드는 사용자의 모든 도메인 알림을 반환하므로 Header 단계에서
 * targetType이 CHALLENGE인 항목만 선별합니다.
 */
export function useChallengeNotifications({ enabled = true } = {}) {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: getNotifications,
    enabled,
    select: (notifications) =>
      notifications.filter(
        (notification) => notification.targetType === 'CHALLENGE',
      ),
  });
}
