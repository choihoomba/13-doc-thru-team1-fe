'use client';

import Image from 'next/image';

import iconOutCircle from '@/app/assets/icons/icon_out_circle.svg';

import { cn } from '@/utils/cn';

import ButtonExternalLink from '../../components/ui/Button/ButtonExternalLink';

export default function OriginalUrlPanel({
  isOpen,
  url,
  onClose,
  onResizeStart,
}) {
  if (!isOpen) return null;

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
      {/* TODO: 이건 따로 버튼이 없는것같은데 찾아보기  */}
      <button
        type="button"
        onClick={onClose}
        aria-label="원문 닫기"
        className={cn('absolute top-2 left-4 z-20', 'desktop:top-3')}
      >
        <Image src={iconOutCircle} alt="" width={32} height={32} />
      </button>
      <ButtonExternalLink
        href="/"
        className={cn(
          'absolute top-2 right-4 z-20 flex items-center gap-0.5 rounded-xl bg-[rgba(246,248,250,0.5)] px-3 py-[6.5px]',
          'desktop:top-3',
          'text-16-bold text-gray-700',
        )}
      />
      <iframe
        src={url}
        title="원문"
        className={cn('h-full w-full border-none')}
      />
    </div>
  );
}
