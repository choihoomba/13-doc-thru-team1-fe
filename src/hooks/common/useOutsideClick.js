import { useEffect } from 'react';

/**
ref로 지정한 요소 바깥을 클릭하면 handler를 호출하는 훅
detectFocus: 키보드(Tab)로 포커스가 바깥으로 이동할 때도 감지. mousedown만으론
키보드 조작을 못 잡아서, 여러 드롭다운 중 하나만 열리게 하려면 필요
공통 훅이라 다른 곳에 영향 없게 기본값은 false, 필요한 곳만 켜서 사용
추가 기능: closeOnEscape: Esc 키 입력에도 handler 호출 
*/
export function useOutsideClick(
  ref,
  handler,
  { enabled = true, detectFocus = false, closeOnEscape = false } = {},
) {
  useEffect(() => {
    if (!enabled) return;

    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        handler(e);
      }
    }

    function handleEscape(e) {
      if (e.key === 'Escape') handler(e);
    }

    document.addEventListener('mousedown', handleOutside);
    if (detectFocus) {
      document.addEventListener('focusin', handleOutside);
    }
    if (closeOnEscape) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      if (detectFocus) {
        document.removeEventListener('focusin', handleOutside);
      }
      if (closeOnEscape) {
        document.removeEventListener('keydown', handleEscape);
      }
    };
  }, [ref, handler, enabled, detectFocus, closeOnEscape]);
}
