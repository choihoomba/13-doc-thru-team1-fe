import { useEffect, useRef } from 'react';

/**
 * sentinel 엘리먼트가 뷰포트에 들어오면 onIntersect를 호출한다.
 * 반환된 ref를 목록 맨 아래 sentinel div에 붙여서 사용한다.
 */
export default function useInfiniteScroll(
  onIntersect,
  { enabled = true } = {},
) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersect();
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [onIntersect, enabled]);

  return sentinelRef;
}
