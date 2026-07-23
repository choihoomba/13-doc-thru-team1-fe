/** 작업 도전하기 페이지 */
'use client';

import React, { useEffect, useState } from 'react';

import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from 'next/image';

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
import iconOutCircle from '@/app/assets/icons/icon_out_circle.svg';

import { cn } from '@/utils/cn';

import OriginalUrlPanel from '@/components/submissions/OriginalUrlPanel';

const title = '나중에 api 연결할 에정입니다 길게길게 제목을 써보자 ';

// TODO: 챌린지 원문 URL API
const ORIGINAL_URL =
  'https://ko.wikipedia.org/wiki/%EC%9C%84%ED%82%A4%EB%B0%B1%EA%B3%BC:%EB%8C%80%EB%AC%B8';

const MIN_PANEL_WIDTH = 320; // 원문 최소 폭(px)
const MIN_EDITOR_WIDTH = 320; // 에디터 최소 폭(px)
// 드래그로 조절하기 전 기본 폭: 화면의 절반, vw 기반이라 창 크기 바뀌어도 JS 계산 없이 자동으로 따라감
const DEFAULT_PANEL_WIDTH_CSS = `clamp(${MIN_PANEL_WIDTH}px, 50vw, calc(100vw - ${MIN_EDITOR_WIDTH}px))`;

const INITIAL_DRAFTS = [
  { id: 1, title: '개발자로써 브랜드 구축하기', date: '2024.12.24.' },
  { id: 2, title: '기술 블로그부터 오픈소스까지', date: '2024.10.02.' },
  { id: 3, title: '제목 없음', date: '2024.06.27.' },
  { id: 4, title: '제목 없음', date: '2024.06.24.' },
];
const TOOLBAR_BUTTON_CLASS = cn(
  'flex h-[2em] w-[2em] items-center justify-center rounded',
);

/** 툴바 버튼 하나 (아이콘 + 활성 상태 표시) */
function ToolbarButton({ label, icon, isActive, onClick, className }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(TOOLBAR_BUTTON_CLASS, isActive && 'bg-gray-100', className)}
    >
      <Image src={icon} alt={label} width={20} height={20} />
    </button>
  );
}

export default function NewSubmissionPage() {
  const [isEmpty, setIsEmpty] = useState(true);
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
    onUpdate: ({ editor }) => setIsEmpty(editor.isEmpty),
    editorProps: {
      attributes: {
        class: cn(
          'min-h-[200px] outline-none break-words',
          'text-body-16-160 text-gray-800',
          // Tailwind preflight가 ul/ol의 list-style을 지워버려서 직접 복원
          '[&_ul]:list-disc [&_ul]:pl-5',
          '[&_ol]:list-decimal [&_ol]:pl-5',
          '[&_li]:my-1',
        ),
      },
    },
    // Next.js SSR과 클라이언트 첫 렌더 결과가 달라 생기는 hydration mismatch 방지
    immediatelyRender: false,
  });
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  // null이면 CSS 기본값(화면 절반, 반응형) 사용 중, 드래그 시작하면 px로 고정됨
  const [panelWidth, setPanelWidth] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  // TODO: 실제로는 저장된 임시글이 있을 때만 true
  const [showDraftBanner, setShowDraftBanner] = useState(true);
  const [isDraftListOpen, setIsDraftListOpen] = useState(false);
  const [drafts] = useState(INITIAL_DRAFTS);

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

  // TODO: 헤더의 "임시저장" 버튼 클릭 시
  // 1) useModal().openModal(<ModalRejectReason title="임시저장" label="제목"
  //    placeholder="임시저장 제목을 입력해주세요" submitText="저장"
  //    onSubmit={(title) => setDrafts([{ title, date: 오늘 날짜 }, ...drafts])} />)
  // 2) 저장 성공 시 useModal().openModal(<ModalNotice message="임시저장되었습니다!" />)
  // 3) 확인 클릭 시 router.push(TODO: 작업물 상세페이지 경로, submissionId 없음 - 백엔드 연동 후 결정)

  // 글자 색상 변경 함수
  function changeTextColor(color) {
    if (!color) {
      editor?.chain().focus().unsetColor().run();
      return;
    }
    editor?.chain().focus().setColor(color).run();
  }

  // TODO: 선택한 draft 내용 불러와서 에디터에 반영
  // 1) 지금 INITIAL_DRAFTS는 목록용(title/date)이라 본문(content)이 없음
  //    → draft 상세 조회 API 필요: const { content } = await getDraftDetail(draft.id);
  // 2) 받아온 본문을 에디터에 그대로 넣으면 됨: editor?.commands.setContent(content);
  //    (지금은 임시로 draft.content가 있다고 가정하고 처리)
  function handleSelectDraft(draft) {
    editor?.commands.setContent(draft.content ?? ''); // api
    setIsDraftListOpen(false);
  }

  return (
    <div className={cn('mt-6 flex h-screen w-full flex-col', 'tablet:px-6')}>
      {isResizing && (
        <div className={cn('fixed inset-0 z-100 cursor-col-resize')} />
      )}
      <div
        className={cn('flex min-h-0 flex-1 gap-6')}
        style={{
          '--panel-width':
            panelWidth !== null ? `${panelWidth}px` : DEFAULT_PANEL_WIDTH_CSS,
        }}
      >
        {/* TODO: <Header /> */}
        <div
          className={cn(
            // 'flex items-center justify-between',
            'flex min-w-0 flex-1 flex-col',
            isOriginalOpen && 'mr-[calc(var(--panel-width)+24px)]',
          )}
        >
          <h1 className={cn('text-20-semibold')}>{title}</h1>
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
            <div className={cn('flex min-h-0 flex-1 flex-col')}>
              <div className={cn('flex flex-wrap items-center gap-0.5')}>
                <ToolbarButton
                  label="Bold"
                  icon={iconBold}
                  isActive={editor.isActive('bold')}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                />
                <ToolbarButton
                  label="Italic"
                  icon={iconItalic}
                  isActive={editor.isActive('italic')}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                />
                <ToolbarButton
                  label="Underline"
                  icon={iconUnderline}
                  isActive={editor.isActive('underline')}
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                />
                <ToolbarButton
                  label="Align left"
                  icon={iconAlignLeft}
                  isActive={editor.isActive({ textAlign: 'left' })}
                  className="ml-3.25"
                  onClick={() =>
                    editor.chain().focus().setTextAlign('left').run()
                  }
                />
                <ToolbarButton
                  label="Align center"
                  icon={iconAlignCenter}
                  isActive={editor.isActive({ textAlign: 'center' })}
                  onClick={() =>
                    editor.chain().focus().setTextAlign('center').run()
                  }
                />
                <ToolbarButton
                  label="Align right"
                  icon={iconAlignRight}
                  isActive={editor.isActive({ textAlign: 'right' })}
                  onClick={() =>
                    editor.chain().focus().setTextAlign('right').run()
                  }
                />
                <ToolbarButton
                  label="Bullet list"
                  icon={iconBullet}
                  isActive={editor.isActive('bulletList')}
                  className="ml-3.25"
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                />
                <ToolbarButton
                  label="Numbered list"
                  icon={iconNumbering}
                  isActive={editor.isActive('orderedList')}
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                />
                <Image src={iconColor} alt="글자 색상" width={20} height={20} />
                <select
                  onChange={(e) => changeTextColor(e.target.value)}
                  className={cn('absolute inset-0 cursor-pointer opacity-0')}
                >
                  {/* TODO: 밤티나는 dropdown 수정 필요  */}
                  <option value="">색상 선택</option>
                  <option value="red">빨간색</option>
                  <option value="blue">파란색</option>
                  <option value="green">초록색</option>
                  <option value="black">검은색</option>
                </select>
              </div>

              <div className={cn('min-h-0 flex-1 overflow-y-auto')}>
                {isEmpty && (
                  <p className={cn('text-body-16-160 text-gray-400 ')}>
                    번역 내용을 적어주세요.
                  </p>
                )}
                <EditorContent editor={editor} />
              </div>
            </div>
          )}
        </div>
        <OriginalUrlPanel
          isOpen={isOriginalOpen}
          url={ORIGINAL_URL}
          onClose={() => setIsOriginalOpen(false)}
          onResizeStart={handleResizeStart}
        />
      </div>
      {/* TODO: toast 공용컴포넌트로 바꿔야함  */}
      {showDraftBanner && (
        <div
          className={cn('fixed inset-x-4 bottom-4 z-30 flex justify-center')}
        >
          <div
            className={cn(
              'flex w-85.75 items-center justify-between gap-2.5 rounded-lg border-2 border-brand-dark bg-[#F6F8FACC] p-2',
              'tablet:w-170',
            )}
          >
            <div className={cn('flex items-center gap-2')}>
              <button
                type="button"
                onClick={() => setShowDraftBanner(false)}
                aria-label="닫기"
                className={cn('shrink-0 p-1')}
              >
                <Image src={iconOutCircle} alt="" width={24} height={24} />
              </button>
              <p
                className={cn(
                  'whitespace-pre-line text-14-medium text-gray-900',
                )}
              >
                {
                  '임시 저장된 작업물이 있어요.\n저장된 작업물을 불러오시겠어요??'
                }
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDraftListOpen(true)}
              className={cn(
                'shrink-0 rounded-[10px] bg-brand-dark px-4 py-0.5 text-14-medium text-white',
              )}
            >
              불러오기
            </button>
          </div>
        </div>
      )}
      {/* 임시저장 리스트 모달  */}
      {isDraftListOpen && (
        <div
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center bg-black/50',
          )}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsDraftListOpen(false);
          }}
        >
          <div
            className={cn(
              'w-[min(90vw,373px)] rounded-lg border-2 border-gray-800 bg-white p-6',
            )}
            role="dialog"
            aria-modal="true"
            aria-label="임시저장 글"
          >
            <div className={cn('mb-2 flex items-center justify-between')}>
              <h2 className={cn('text-16-bold text-gray-900')}>임시저장 글</h2>
              <button
                type="button"
                onClick={() => setIsDraftListOpen(false)}
                aria-label="닫기"
              >
                <Image src={iconOutCircle} alt="" width={24} height={24} />
              </button>
            </div>
            <p className={cn('mb-4 text-14-regular text-gray-500')}>
              총 {drafts.length}개
            </p>
            <ul>
              {drafts.map((draft, idx) => (
                <li key={draft.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectDraft(draft)}
                    className={cn(
                      'w-full py-4 text-left',
                      idx !== drafts.length - 1 && 'border-b border-gray-200',
                    )}
                  >
                    <p className={cn('text-16-semibold text-gray-900')}>
                      {draft.title}
                    </p>
                    <p className={cn('text-14-regular text-gray-500')}>
                      {draft.date}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
