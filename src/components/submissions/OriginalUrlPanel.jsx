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
        'fixed inset-0 z-40 flex w-(--panel-width) flex-col bg-white right-0 left-auto',
      )}
    >
      <div
        onMouseDown={onResizeStart}
        className={cn(
          'absolute inset-y-0 left-0 z-10 w-2 -translate-x-1/2 cursor-col-resize block',
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
