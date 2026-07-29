import { useMediaQuery } from 'react-responsive';

/** 브레이크 포인트
 * - globals.css의 --breakpoint-* 와 동일
 */
const BREAKPOINTS = {
  tablet: 744,
  desktop: 1024,
};

/**
 * 현재 뷰포트(mobile/tablet/desktop)에 맞는 값을 반환
 *
 * @example
 * const height = useBreakpointValue({ mobile: 250, tablet: 244, desktop: 244 });
 */
export function useBreakpointValue(values) {
  const isDesktop = useMediaQuery({ minWidth: BREAKPOINTS.desktop });
  const isTablet = useMediaQuery({ minWidth: BREAKPOINTS.tablet });

  if (isDesktop) return values.desktop;
  if (isTablet) return values.tablet;

  return values.mobile;
}
