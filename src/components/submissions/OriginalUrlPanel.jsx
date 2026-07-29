'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import iconOutCircle from '@/app/assets/icons/icon_out_circle.svg';

import { checkEmbeddable } from '@/lib/actions/embeddable';

import { cn } from '@/utils/cn';

import ButtonExternalLink from '../../components/ui/Button/ButtonExternalLink';

const IFRAME_LOAD_TIMEOUT_MS = 5000;

export default function OriginalUrlPanel({
  isOpen,
  url,
  onClose,
  onResizeStart,
}) {
  // 'loading' | 'loaded' | 'blocked'
  const [status, setStatus] = useState('loading');
  // 서버 헤더 체크 결과: true(임베드 가능) | false(차단) | null(판단 불가/체크 전)
  const [embeddable, setEmbeddable] = useState(null);

  // 서버에서 X-Frame-Options/CSP 헤더를 먼저 확인해, 확실히 차단된 경우
  // iframe이 브라우저 자체 에러 페이지를 띄우기 전에 바로 fallback으로 전환한다.
  useEffect(() => {
    if (!isOpen || !url) return;

    let cancelled = false;

    checkEmbeddable(url).then((result) => {
      if (cancelled) return;
      setEmbeddable(result);
      if (result === false) setStatus('blocked');
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen, url]);

  useEffect(() => {
    // 서버 헤더 체크에서 임베드 가능이 확인된 사이트는 로딩이 오래 걸려도
    // 차단으로 오판하지 않는다 (무거운 페이지가 5초 넘게 걸릴 수 있음).
    if (!isOpen || embeddable === true) return;

    const timer = setTimeout(() => {
      setStatus((prev) => (prev === 'loaded' ? prev : 'blocked'));
    }, IFRAME_LOAD_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [isOpen, embeddable]);

  function handleIframeLoad(e) {
    const frame = e.currentTarget;
    try {
      // 접근이 성공하고 여전히 about:blank라면 임베드가 차단되어 실제 이동이 안 된 것
      const isStillBlank = frame.contentWindow.location.href === 'about:blank';
      setStatus(isStillBlank ? 'blocked' : 'loaded');
    } catch {
      // cross-origin 접근이 막혔다는 건 실제로 외부 사이트로 정상 이동했다는 뜻
      setStatus('loaded');
    }
  }

  if (!isOpen) return null;

  const isBlocked = status === 'blocked';

  return (
    <div
      className={cn(
        'relative z-40 flex h-[320px] w-full flex-col bg-white',
        'tablet:fixed tablet:inset-y-0 tablet:right-0 tablet:left-auto tablet:h-auto tablet:w-(--panel-width)',
        'tablet:shadow-[-4px_0_16px_0_rgba(0,0,0,0.08)]',
      )}
    >
      <div
        onMouseDown={onResizeStart}
        className={cn(
          'hidden',
          'tablet:absolute tablet:inset-y-0 tablet:left-0 tablet:z-10 tablet:block tablet:w-2 tablet:-translate-x-1/2 tablet:cursor-col-resize',
        )}
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="원문 닫기"
        className={cn('absolute top-2 left-4 z-20', 'desktop:top-3')}
      >
        <Image src={iconOutCircle} alt="" width={32} height={32} />
      </button>
      <ButtonExternalLink
        href={url}
        className={cn('absolute top-2 right-4 z-20', 'desktop:top-3')}
      />
      {isBlocked ? (
        <div
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center',
          )}
        >
          <p className={cn('text-14-medium text-gray-500')}>
            이 사이트는 미리보기를 지원하지 않아요
          </p>
          <ButtonExternalLink href={url} className={cn('static w-auto')} />
        </div>
      ) : (
        <iframe
          src={url}
          title="원문"
          onLoad={handleIframeLoad}
          className={cn('h-full w-full border-none')}
        />
      )}
    </div>
  );
}
