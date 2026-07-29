import { useInfiniteQuery } from '@tanstack/react-query';

import { getMyChallenges } from '@/lib/api/challenges';

import { challengeKeys } from '@/hooks/queries/challenges/keys';

const PAGE_SIZE = 10;

/**
 * 나의 챌린지(탭별) 무한스크롤 목록.
 * tab/search가 바뀌면 1페이지부터 다시 조회하고, loadMore로 다음 페이지를 이어붙인다.
 */
export default function useMyChallengesList({ tab, search }) {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: challengeKeys.participations(tab, { search }),
    queryFn: ({ pageParam }) =>
      getMyChallenges({ tab, page: pageParam, limit: PAGE_SIZE, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.pagination?.hasNext ? allPages.length + 1 : undefined,
  });

  const challenges =
    data?.pages.flatMap((page) => page?.challenges ?? []) ?? [];

  return {
    challenges,
    isLoading,
    isError,
    hasNext: Boolean(hasNextPage),
    isFetchingMore: isFetchingNextPage,
    loadMore: fetchNextPage,
  };
}
