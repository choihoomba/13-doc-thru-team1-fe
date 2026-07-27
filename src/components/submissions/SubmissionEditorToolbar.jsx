'use client';

import Image from 'next/image';

import iconAlignCenter from '@/app/assets/icons/icon_font_alignment_center.svg';
import iconAlignLeft from '@/app/assets/icons/icon_font_alignment_left.svg';
import iconAlignRight from '@/app/assets/icons/icon_font_alignment_right.svg';
import iconBold from '@/app/assets/icons/icon_font_bold.svg';
import iconBullet from '@/app/assets/icons/icon_font_bullet.svg';
import iconColor from '@/app/assets/icons/icon_font_color.svg';
import iconItalic from '@/app/assets/icons/icon_font_italic.svg';
import iconNumbering from '@/app/assets/icons/icon_font_numbering.svg';
import iconUnderline from '@/app/assets/icons/icon_font_underline.svg';

import { cn } from '@/utils/cn';

function ToolbarButton({ label, icon, onClick, className }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(className)}
    >
      <Image src={icon} alt={label} width={24} height={24} />
    </button>
  );
}

export default function SubmissionEditorToolbar({ editor }) {
  function changeTextColor(color) {
    if (!color) {
      editor?.chain().focus().unsetColor().run();
      return;
    }
    editor?.chain().focus().setColor(color).run();
  }

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
      <div className={cn('relative items-center justify-center ')}>
        <Image src={iconColor} alt="글자 색상" width={24} height={24} />
        {/* TODO: 밤티나는 디자인 수정 고려 or 컬러팔레트?  */}
        <select
          onChange={(e) => changeTextColor(e.target.value)}
          className={cn('absolute inset-0 cursor-pointer opacity-0')}
        >
          <option value="">색상 선택</option>
          <option value="red">빨간색</option>
          <option value="blue">파란색</option>
          <option value="green">초록색</option>
          <option value="black">검은색</option>
        </select>
      </div>
    </div>
  );
}
