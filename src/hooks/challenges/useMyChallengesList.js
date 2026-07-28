import { useCallback, useEffect, useState } from 'react';

import { getMyChallenges } from '@/lib/api/challengeMine';

const PAGE_SIZE = 10;

/**
 * 나의 챌린지(탭별) 무한스크롤 목록.
 * tab/search가 바뀌면 1페이지부터 다시 조회하고, loadMore로 다음 페이지를 이어붙인다.
 */
export default function useMyChallengesList({ tab, search }) {
  const [challenges, setChallenges] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getMyChallenges({ tab, page: 1, limit: PAGE_SIZE, search })
      .then((data) => {
        if (cancelled) return;
        setChallenges(data?.challenges ?? []);
        setHasNext(Boolean(data?.pagination?.hasNext));
        setPage(1);
        setIsError(false);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('나의 챌린지 조회 실패:', error);
        setIsError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab, search]);

  const loadMore = useCallback(() => {
    if (isFetchingMore || !hasNext) return;

    const nextPage = page + 1;
    setIsFetchingMore(true);

    getMyChallenges({ tab, page: nextPage, limit: PAGE_SIZE, search })
      .then((data) => {
        setChallenges((prev) => [...prev, ...(data?.challenges ?? [])]);
        setHasNext(Boolean(data?.pagination?.hasNext));
        setPage(nextPage);
      })
      .catch((error) => {
        console.error('나의 챌린지 추가 조회 실패:', error);
      })
      .finally(() => {
        setIsFetchingMore(false);
      });
  }, [tab, search, page, hasNext, isFetchingMore]);

  return { challenges, isLoading, isError, hasNext, isFetchingMore, loadMore };
}
