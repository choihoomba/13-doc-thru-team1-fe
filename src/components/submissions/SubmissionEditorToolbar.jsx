'use client';

import { useRef, useState } from 'react';

import Image from 'next/image';

import iconAlignCenter from '@/app/assets/icons/icon_font_alignment_center.svg';
import iconAlignLeft from '@/app/assets/icons/icon_font_alignment_left.svg';
import iconAlignRight from '@/app/assets/icons/icon_font_alignment_right.svg';
import iconBold from '@/app/assets/icons/icon_font_bold.svg';
import iconBullet from '@/app/assets/icons/icon_font_bullet.svg';
import iconCode from '@/app/assets/icons/icon_font_code.svg';
import iconColor from '@/app/assets/icons/icon_font_color.svg';
import iconItalic from '@/app/assets/icons/icon_font_italic.svg';
import iconNumbering from '@/app/assets/icons/icon_font_numbering.svg';
import iconUnderline from '@/app/assets/icons/icon_font_underline.svg';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';

import { cn } from '@/utils/cn';

const TEXT_COLOR_OPTIONS = [
  { label: '검은색', value: '#171717' },
  { label: '회색', value: '#737373' },
  { label: '빨간색', value: '#EB3E3E' },
  { label: '주황색', value: '#F97316' },
  { label: '노란색', value: '##FFC117' },
  { label: '초록색', value: '#22C55E' },
  { label: '파란색', value: '#3B82F6' },
  { label: '보라색', value: '#A855F7' },
];

function ToolbarButton({ label, icon, onClick, className, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'flex h-6 w-6 cursor-pointer items-center justify-center rounded',
        className,
      )}
    >
      {icon ? (
        <Image src={icon} alt={label} width={24} height={24} />
      ) : (
        children
      )}
    </button>
  );
}

function TextColorPicker({ editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useOutsideClick(containerRef, () => setIsOpen(false), {
    enabled: isOpen,
    detectFocus: true,
    closeOnEscape: true,
  });

  function changeTextColor(color) {
    if (!color) {
      editor?.chain().focus().unsetColor().run();
    } else {
      editor?.chain().focus().setColor(color).run();
    }
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={cn('relative')}>
      <button
        type="button"
        aria-label="글자 색상"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex h-6 w-6 cursor-pointer items-center justify-center',
        )}
      >
        <Image src={iconColor} alt="" width={24} height={24} />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute left-0 top-[calc(100%+4px)] z-dropdown flex overflow-hidden border border-solid border-gray-200 shadow-md',
            'mobile:top-[calc(100%+1px)]',
          )}
        >
          {TEXT_COLOR_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              aria-label={label}
              title={label}
              onClick={() => changeTextColor(value)}
              className={cn('h-4.5 w-6 cursor-pointer')}
              style={{ backgroundColor: value }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SubmissionEditorToolbar({ editor }) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-[2px] mb-[16px]',
        'tablet:mb-[24px]',
      )}
    >
      <ToolbarButton
        label="Bold"
        icon={iconBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        label="Italic"
        icon={iconItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        label="Underline"
        icon={iconUnderline}
        className={cn('mr-[13px]')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        label="Align left"
        icon={iconAlignLeft}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      />
      <ToolbarButton
        label="Align center"
        icon={iconAlignCenter}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      />
      <ToolbarButton
        label="Align right"
        icon={iconAlignRight}
        className={cn('mr-[13px]')}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      />
      <ToolbarButton
        label="Bullet list"
        icon={iconBullet}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        label="Numbered list"
        icon={iconNumbering}
        className={cn('mr-[13px]')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <TextColorPicker editor={editor} />
      <ToolbarButton
        label="Code"
        icon={iconCode}
        className={cn('ml-[2px]')}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />
    </div>
  );
}
