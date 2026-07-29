import { useEffect, useRef, useState } from 'react';

/**
 * "더보기/접기" 토글에 필요한 콘텐츠 높이 측정 로직을 묶어둔 훅
 *
 * contentRef를 실제 콘텐츠 DOM에 연결하면
 * - watch 값이 바뀔 때(예: API 데이터 도착) scrollHeight를 미리 측정해두고
 *   ("더보기" 버튼 노출 여부를 토글 클릭 없이도 바로 판단할 수 있음)
 * - 펼치는 순간에도 다시 측정해서 height를 갱신
 *
 * @param {*} watch 콘텐츠 길이가 바뀔 수 있는 의존값 (예: API로 받아온 데이터)
 */
export function useExpandableHeight(watch) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [watch]);

  const toggleOpen = () => {
    if (!open && contentRef.current) {
      setHeight(contentRef.current.scrollHeight); // 펼치기 직전에 실제 높이 측정
    }
    setOpen((prev) => !prev);
  };

  return { contentRef, open, height, toggleOpen };
}
