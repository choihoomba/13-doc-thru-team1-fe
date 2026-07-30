'use client';

import { useEffect, useState } from 'react';

import { checkEmbeddable } from '@/lib/actions/embeddable';

const IFRAME_LOAD_TIMEOUT_MS = 5000;

/**
 * iframe으로 url을 띄울 수 있는지 판단한다.
 * 1) 서버에서 X-Frame-Options/CSP 헤더를 먼저 확인하고
 * 2) 그걸로 판단이 안 되면(null) onLoad + 타임아웃 휴리스틱으로 보완한다.
 *
 * @param {string} url
 * @param {boolean} isActive - false면 체크를 시작하지 않음(패널이 닫혀있는 등)
 * @returns {{ status: 'loading' | 'loaded' | 'blocked', handleIframeLoad: (e: Event) => void }}
 */
export function useEmbeddableIframe(url, isActive = true) {
  const [status, setStatus] = useState('loading');
  // 서버 헤더 체크 결과: true(임베드 가능) | false(차단) | null(판단 불가/체크 전)
  const [embeddable, setEmbeddable] = useState(null);

  // 서버에서 X-Frame-Options/CSP 헤더를 먼저 확인해, 확실히 차단된 경우
  // iframe이 브라우저 자체 에러 페이지를 띄우기 전에 바로 fallback으로 전환한다.
  useEffect(() => {
    if (!isActive || !url) return;

    let cancelled = false;

    checkEmbeddable(url).then((result) => {
      if (cancelled) return;
      setEmbeddable(result);
      if (result === true) setStatus('loaded');
      if (result === false) setStatus('blocked');
    });

    return () => {
      cancelled = true;
    };
  }, [isActive, url]);

  useEffect(() => {
    if (!isActive || embeddable === true) return;

    const timer = setTimeout(() => {
      setStatus((prev) => (prev === 'loaded' ? prev : 'blocked'));
    }, IFRAME_LOAD_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [isActive, embeddable]);

  function handleIframeLoad(e) {
    // 서버 헤더 체크로 이미 확실히 판단됐으면 onLoad 휴리스틱으로 덮어쓰지 않는다
    if (embeddable === true || embeddable === false) return;

    const frame = e.currentTarget;
    try {
      frame.contentWindow.location.href;
      setStatus('blocked');
    } catch {
      setStatus('loaded');
    }
  }

  return { status, handleIframeLoad };
}
