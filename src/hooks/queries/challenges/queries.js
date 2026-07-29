import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

<<<<<<< HEAD
import {
  getChallenges,
  getChallenge,
  getMyChallenges,
} from '@/lib/api/challenges';
import { CHALLENGE_TAB_TO_VIEW } from '@/lib/constants/constants';

import { challengeKeys } from './keys';

const MY_CHALLENGES_PAGE_SIZE = 10;

=======
import { getChallenges, getChallenge } from '@/lib/api/challenges';

import { challengeKeys } from './keys';

>>>>>>> a124381 (챌린지 목록페이지 (#75))
// 검색 조건을 받아 챌린지 목록을 조회합니다.
export function useChallenges(params) {
  return useQuery({
    queryKey: challengeKeys.list(params),
    queryFn: () => getChallenges(params),
    retry: false,

    meta: {
      name: '챌린지 목록 조회',
    },
  });
}

/**
 * [챌린지 수정 페이지] URL의 challengeId에 해당하는 상세 데이터를 조회합니다.
 *
 * id가 준비되기 전에는 요청하지 않아 `/api/challenges/undefined` 호출을 막고,
 * 상세 전용 queryKey를 사용해 목록 캐시와 섞이지 않도록 합니다.
 */
export function useChallenge(challengeId) {
  return useQuery({
    queryKey: challengeKeys.detail(challengeId),
    queryFn: () => getChallenge(challengeId),
    enabled: Boolean(challengeId),
  });
}

/**
 * 나의 챌린지(탭별) 무한스크롤 목록.
 * tab/search가 바뀌면 1페이지부터 다시 조회하고, loadMore로 다음 페이지를 이어붙인다.
 */
export function useMyChallenges({ tab, search }) {
  const {
    data,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: challengeKeys.list({ view: CHALLENGE_TAB_TO_VIEW[tab], search }),
    queryFn: ({ pageParam }) =>
      getMyChallenges({
        tab,
        page: pageParam,
        limit: MY_CHALLENGES_PAGE_SIZE,
        search,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.pagination?.hasNext ? allPages.length + 1 : undefined,
  });

  const challenges =
    data?.pages.flatMap((page) => page?.challenges ?? []) ?? [];

  return {
    challenges,
    isPending,
    isError,
    hasNext: Boolean(hasNextPage),
    isFetchingMore: isFetchingNextPage,
    loadMore: fetchNextPage,
  };
}
