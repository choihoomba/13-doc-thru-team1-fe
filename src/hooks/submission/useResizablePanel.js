import { useEffect, useState } from 'react';

const MIN_PANEL_WIDTH = 320; // 원문 최소 폭(px)
const MIN_EDITOR_WIDTH = 320; // 에디터 최소 폭(px)
const DEFAULT_PANEL_WIDTH_CSS = `clamp(${MIN_PANEL_WIDTH}px, 50vw, calc(100vw - ${MIN_EDITOR_WIDTH}px))`;

/** 원문 패널 드래그 리사이즈 - --panel-width CSS 변수에 바로 쓸 수 있는 값까지 반환 */
export default function useResizablePanel() {
  const [panelWidth, setPanelWidth] = useState(null);
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      const nextWidth = window.innerWidth - e.clientX;
      const maxWidth = window.innerWidth - MIN_EDITOR_WIDTH;
      setPanelWidth(Math.min(Math.max(nextWidth, MIN_PANEL_WIDTH), maxWidth));
    };

    const handleMouseUp = () => setIsResizing(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const panelWidthCss =
    panelWidth !== null ? `${panelWidth}px` : DEFAULT_PANEL_WIDTH_CSS;

  return { isResizing, panelWidthCss, handleResizeStart };
}
