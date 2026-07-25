/** 작업 도전하기 페이지 */
'use client';

import React, { useEffect, useState } from 'react';

import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import iconList from '@/app/assets/icons/ic_list.svg';
import iconAlignCenter from '@/app/assets/icons/icon_font_alignment_center.svg';
import iconAlignLeft from '@/app/assets/icons/icon_font_alignment_left.svg';
import iconAlignRight from '@/app/assets/icons/icon_font_alignment_right.svg';
import iconBold from '@/app/assets/icons/icon_font_bold.svg';
import iconBullet from '@/app/assets/icons/icon_font_bullet.svg';
import iconColor from '@/app/assets/icons/icon_font_color.svg';
import iconItalic from '@/app/assets/icons/icon_font_italic.svg';
import iconNumbering from '@/app/assets/icons/icon_font_numbering.svg';
import iconUnderline from '@/app/assets/icons/icon_font_underline.svg';

import { getSubmission } from '@/lib/submissionNew';

import { cn } from '@/utils/cn';

import OriginalUrlPanel from '@/components/submissions/OriginalUrlPanel';
import Toast from '@/components/ui/Toast';

// TODO: 챌린지 원문 URL API
// TODO: iframe 에러 분기 처리
const ORIGINAL_URL =
  'https://ko.wikipedia.org/wiki/%EC%9C%84%ED%82%A4%EB%B0%B1%EA%B3%BC:%EB%8C%80%EB%AC%B8';

const MIN_PANEL_WIDTH = 320; // 원문 최소 폭(px)
const MIN_EDITOR_WIDTH = 320; // 에디터 최소 폭(px)
// 드래그로 조절하기 전 기본 폭: 화면의 절반, vw 기반이라 창 크기 바뀌어도 JS 계산 없이 자동으로 따라감
const DEFAULT_PANEL_WIDTH_CSS = `clamp(${MIN_PANEL_WIDTH}px, 50vw, calc(100vw - ${MIN_EDITOR_WIDTH}px))`;

/** 툴바 버튼 하나 */
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

export default function NewSubmissionPage() {
  // TODO: 참여(participations) 연동 후 실제 submissionId 확보 방식으로 교체
  // 지금은 임시로 쿼리스트링(?id=)에서 읽음 (예: /submissions/new?id=1)
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: '번역 내용을 적어주세요.' }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: cn(
          'min-h-[200px] outline-none break-words',
          'text-body-16-160 text-gray-800',
          '[&_ul]:list-disc [&_ul]:pl-5',
          '[&_ol]:list-decimal [&_ol]:pl-5',
          '[&_li]:my-1',
          '[&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]',
          '[&_p.is-editor-empty:first-child]:before:pointer-events-none',
          '[&_p.is-editor-empty:first-child]:before:float-left',
          '[&_p.is-editor-empty:first-child]:before:h-0',
          '[&_p.is-editor-empty:first-child]:before:text-gray-400',
        ),
      },
    },
    immediatelyRender: false,
  });
  const [title, setTitle] = useState('');
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  // null이면 CSS 기본값(화면 절반, 반응형) 사용 중, 드래그 시작하면 px로 고정됨
  const [panelWidth, setPanelWidth] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  // TODO: 실제로는 저장된 임시글이 있을 때만 true -> toast 띄우기
  const [isToastOpen, setIsToastOpen] = useState(true);

  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // 화면 리사이징
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

  // 글자 색상 변경 함수
  function changeTextColor(color) {
    if (!color) {
      editor?.chain().focus().unsetColor().run();
      return;
    }
    editor?.chain().focus().setColor(color).run();
  }

  async function handleLoadDraft() {
    if (!submissionId) {
      setIsToastOpen(false);
      return;
    }

    try {
      const submission = await getSubmission(submissionId);
      setTitle(submission?.draft?.title ?? '');
      // TODO: 백엔드가 draft.content를 내려주기 전까진 항상 빈 값으로 채워짐
      editor?.commands.setContent(submission?.draft?.content ?? '');
    } catch (error) {
      // TODO: 실패 시 사용자에게 보여줄 UI (에러 토스트 등) 정하기
      console.error('임시저장 불러오기 실패:', error);
    } finally {
      setIsToastOpen(false);
    }
  }

  return (
    <div className={cn('mt-6 flex min-h-screen w-full flex-col')}>
      {isResizing && (
        <div className={cn('fixed inset-0 z-100 cursor-col-resize')} />
      )}
      <div
        className={cn('flex w-full flex-col', 'tablet:flex-row')}
        style={{
          '--panel-width':
            panelWidth !== null ? `${panelWidth}px` : DEFAULT_PANEL_WIDTH_CSS,
        }}
      >
        <OriginalUrlPanel
          isOpen={isOriginalOpen}
          url={ORIGINAL_URL}
          onClose={() => setIsOriginalOpen(false)}
          onResizeStart={handleResizeStart}
        />
        {/* TODO: <Header /> 버튼도 내가 만들어야하나... */}
        <div
          className={cn(
            'flex w-full flex-col p-[16px]',
            'tablet:p-[24px]',
            !isOriginalOpen && 'desktop:mx-auto desktop:max-w-[890px]',
            isOriginalOpen && 'mt-[16px]',
            isOriginalOpen &&
              'tablet:mt-0 tablet:mr-[calc(var(--panel-width)+18px)]',
            isOriginalOpen && 'desktop:mr-[calc(var(--panel-width)+24px)]',
          )}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요"
            className={cn(
              'w-full text-20-semibold text-gray-900 outline-none',
              'placeholder:text-gray-400',
            )}
          />
          {!isOriginalOpen && (
            <button
              type="button"
              onClick={() => setIsOriginalOpen(true)}
              className={cn(
                'flex fixed items-center gap-1 rounded-l-3xl px-3 top-6 right-0 z-50 bg-white py-[14px] shadow-md',
                'text-14-semibold text-gray-500',
              )}
            >
              <Image src={iconList} alt="" width={16} height={16} />
              원문
            </button>
          )}

          <div className={cn('my-6 h-px w-full bg-gray-200')} />

          {editor && (
            <div className={cn('flex flex-1 flex-col')}>
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
                  onClick={() =>
                    editor.chain().focus().setTextAlign('left').run()
                  }
                />
                <ToolbarButton
                  label="Align center"
                  icon={iconAlignCenter}
                  onClick={() =>
                    editor.chain().focus().setTextAlign('center').run()
                  }
                />
                <ToolbarButton
                  label="Align right"
                  icon={iconAlignRight}
                  className={cn('mr-[13px]')}
                  onClick={() =>
                    editor.chain().focus().setTextAlign('right').run()
                  }
                />
                <ToolbarButton
                  label="Bullet list"
                  icon={iconBullet}
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                />
                <ToolbarButton
                  label="Numbered list"
                  icon={iconNumbering}
                  className={cn('mr-[13px]')}
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                />
                <div className={cn('relative items-center justify-center ')}>
                  <Image
                    src={iconColor}
                    alt="글자 색상"
                    width={24}
                    height={24}
                  />
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
              <EditorContent editor={editor} />
            </div>
          )}
        </div>
      </div>
      <Toast
        isOpen={isToastOpen}
        onClose={() => setIsToastOpen(false)}
        onLoad={handleLoadDraft}
      />
    </div>
  );
}
