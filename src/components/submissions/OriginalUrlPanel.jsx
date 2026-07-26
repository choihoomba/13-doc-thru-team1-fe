'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import iconOutCircle from '@/app/assets/icons/icon_out_circle.svg';

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

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setStatus((prev) => (prev === 'loaded' ? prev : 'blocked'));
    }, IFRAME_LOAD_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [isOpen]);

  function handleIframeLoad(e) {
    const frame = e.currentTarget;
    try {
      const isStillBlank = frame.contentWindow.location.href === 'about:blank';
      setStatus(isStillBlank ? 'loaded' : 'blocked');
      console.log('loaded');
    } catch {
      setStatus('blocked');
      console.log('blocked');
    }
  }

  if (!isOpen) return null;

  const isBlocked = status === 'blocked';

  return (
    <div
      className={cn(
        'relative z-40 flex h-[320px] w-full flex-col bg-white',
        'tablet:fixed tablet:inset-y-0 tablet:right-0 tablet:left-auto tablet:h-auto tablet:w-(--panel-width)',
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
