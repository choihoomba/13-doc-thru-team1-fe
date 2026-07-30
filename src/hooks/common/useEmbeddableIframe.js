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
      if (result === false) setStatus('blocked');
    });

    return () => {
      cancelled = true;
    };
  }, [isActive, url]);

  useEffect(() => {
    // 서버 헤더 체크에서 임베드 가능이 확인된 사이트는 로딩이 오래 걸려도
    // 차단으로 오판하지 않는다 (무거운 페이지가 5초 넘게 걸릴 수 있음).
    if (!isActive || embeddable === true) return;

    const timer = setTimeout(() => {
      setStatus((prev) => (prev === 'loaded' ? prev : 'blocked'));
    }, IFRAME_LOAD_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [isActive, embeddable]);

  function handleIframeLoad(e) {
    const frame = e.currentTarget;
    try {
      // 실제로 목표 사이트로 정상 이동했다면 cross-origin 보안 정책 때문에
      // location.href 접근 자체가 예외를 던진다. 예외 없이 읽혔다는 건
      // about:blank(X-Frame-Options 차단)이든, DNS 실패/연결 거부로 뜬
      // 브라우저 자체 에러 페이지든 목표 사이트로 이동하지 못했다는 뜻이다.
      frame.contentWindow.location.href;
      setStatus('blocked');
    } catch {
      // cross-origin 접근이 막혔다는 건 실제로 외부 사이트로 정상 이동했다는 뜻
      setStatus('loaded');
    }
  }

  return { status, handleIframeLoad };
}
