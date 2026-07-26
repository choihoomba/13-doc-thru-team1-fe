/** 작업 도전하기 페이지 */
'use client';

import React, { useEffect, useRef, useState } from 'react';

import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

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
import logo from '@/app/assets/images/img_logo.svg';

import {
  cancelParticipation,
  deleteDraft,
  getChallenge,
  getSubmission,
  getSubmissionDetail,
  saveDraft,
  updateSubmission,
} from '@/lib/api/submissionNew';

import useDebounce from '@/hooks/common/useDebounce';
import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

import OriginalUrlPanel from '@/components/submissions/OriginalUrlPanel';
import ButtonQuit from '@/components/ui/Button/ButtonQuit';
import ButtonSecondary from '@/components/ui/Button/ButtonSecondary';
import ModalConfirm from '@/components/ui/Modal/ModalConfirm';
import Toast from '@/components/ui/Toast';

// 임시 originalUrl
const ORIGINAL_URL = 'https://github.com/choihoomba/13-doc-thru-team1-fe/pulls';

const MIN_PANEL_WIDTH = 320; // 원문 최소 폭(px)
const MIN_EDITOR_WIDTH = 320; // 에디터 최소 폭(px)
const DEFAULT_PANEL_WIDTH_CSS = `clamp(${MIN_PANEL_WIDTH}px, 50vw, calc(100vw - ${MIN_EDITOR_WIDTH}px))`;

const SAVE_DEBOUNCE_MS = 500;
const TITLE_MAX_LENGTH = 50; // challenge.title 제한은 BE에서 100자인데 draft는 그렇게까지? 싶어서 50으로..

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

/**
 * - 편집 중 새로고침: 로컬에 남아있는 값을 묻지 않고 바로 복원 (같은 세션 연속)
 * - 새로 진입(로컬 비어있음): 저장된 임시글이 있는지는 서버 기준 Toast로 물어봄
 */
const LOCAL_DRAFT_KEY = 'submissionNew:draft';

function saveDraftToLocal({ title, content }) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(
    LOCAL_DRAFT_KEY,
    JSON.stringify({ title, content, updatedAt: new Date().toISOString() }),
  );
}

function getDraftFromLocal() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(LOCAL_DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function NewSubmissionPage() {
  // TODO: 챌린지 상세페이지에서 도전하기버튼을 누르면 route로 submissionId받으면? 이렇게 구현?
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const titleTextareaRef = useRef(null);

  const router = useRouter();

  // originalUrl 가져오기
  const [originalUrl, setOriginalUrl] = useState(null);
  const [challengeId, setChallengeId] = useState(null);
  useEffect(() => {
    if (!submissionId) return;

    let cancelled = false;
    getSubmission(submissionId)
      .then((submission) => {
        if (!submission?.challengeId) return null;
        if (!cancelled) setChallengeId(submission.challengeId);
        return getChallenge(submission.challengeId);
      })
      .then((challenge) => {
        if (!cancelled && challenge?.originalUrl) {
          setOriginalUrl(challenge.originalUrl);
        }
      })
      .catch((error) => {
        console.error('원문 링크 조회 실패:', error);
      });

    return () => {
      cancelled = true;
    };
  }, [submissionId]);

  // debounce
  const draftSnapshot = JSON.stringify({ title, content: editorContent });
  const debouncedSnapshot = useDebounce(draftSnapshot, SAVE_DEBOUNCE_MS);
  const [hasSaveError, setHasSaveError] = useState(false); // 서버 저장 실패 여부 판단

  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const { title: debouncedTitle, content: debouncedContent } =
      JSON.parse(debouncedSnapshot);

    // 로컬엔 항상 즉시 저장
    saveDraftToLocal({ title: debouncedTitle, content: debouncedContent });

    if (!submissionId) return;
    saveDraft(submissionId, {
      title: debouncedTitle,
      content: debouncedContent,
    })
      .then(() => setHasSaveError(false))
      .catch((error) => {
        setHasSaveError(true);
        console.error('임시저장(서버) 실패:', error);
      });
  }, [debouncedSnapshot, submissionId]);

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
    onUpdate: ({ editor }) => setEditorContent(editor.getHTML()),
    // - 로컬에 있으면 묻지 않고 바로 채움 -> 적다가 모르고 새로고침함
    // - 로컬이 비어있으면 서버 기준으로 Toast 노출
    onCreate: ({ editor }) => {
      const local = getDraftFromLocal();
      if (local) {
        setTitle(local.title ?? '');
        setEditorContent(local.content ?? '');
        editor.commands.setContent(local.content ?? '');
        return;
      }

      if (!submissionId) return;

      getSubmission(submissionId)
        .then((submission) => setIsToastOpen(Boolean(submission?.draft)))
        .catch((error) => {
          console.error('임시저장 존재 확인 실패:', error);
        });
    },
    immediatelyRender: false,
  });
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);

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

  // 제목 textarea -> title, isOriginalOpen, panelWidth에 따라서 wrap
  useEffect(() => {
    const el = titleTextareaRef.current;
    if (!el) return;

    function resizeToFitContent() {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }

    resizeToFitContent();
    window.addEventListener('resize', resizeToFitContent);
    return () => window.removeEventListener('resize', resizeToFitContent);
  }, [title, isOriginalOpen, panelWidth]);

  // 글자 색상 변경 함수
  function changeTextColor(color) {
    if (!color) {
      editor?.chain().focus().unsetColor().run();
      return;
    }
    editor?.chain().focus().setColor(color).run();
  }
  const { openModal, closeModal } = useModal();

  // 서버 저장 실패한 채로 브라우저 뒤로가기를 시도하면 ModalConfirm으로 임시저장 여부 확인
  useEffect(() => {
    if (!hasSaveError) return;
    window.history.pushState(null, '', window.location.href);

    function handlePopState() {
      openModal(
        <ModalConfirm
          message="작성 중인 내용이 있습니다. 임시저장하시겠습니까?"
          cancelButtonText="아니오"
          confirmButtonText="네"
          onCancel={() => {
            window.history.pushState(null, '', window.location.href);
            closeModal();
          }}
          onConfirm={async () => {
            try {
              await saveDraft(submissionId, {
                title,
                content: editorContent,
              });
              setHasSaveError(false);
              closeModal();
              window.history.back(); // 저장 성공했을 때만 실제로 이전 페이지로 이동
            } catch (error) {
              console.error('임시저장(뒤로가기 시) 실패:', error);
              window.history.pushState(null, '', window.location.href);
              closeModal();
            }
          }}
        />,
      );
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [hasSaveError, submissionId, title, editorContent, openModal, closeModal]);

  // - 로컬은 비었고, 서버에는 draft가 있을때 Toast띄워서 임시저장 불러오기
  // - 서버 실패 시 로컬로 폴백 -> TODO: 일단 주석으로 남겨둠
  function handleLoadDraft() {
    setIsToastOpen(false);
    openModal(
      <ModalConfirm
        message="이전 작업물을 불러오시겠어요?"
        cancelButtonText="아니오"
        confirmButtonText="네"
        onCancel={closeModal}
        onConfirm={async () => {
          try {
            const submission = await getSubmission(submissionId);
            const loadedTitle = submission?.draft?.title ?? '';
            const loadedContent = submission?.draft?.content ?? '';
            setTitle(loadedTitle);
            setEditorContent(loadedContent);
            editor?.commands.setContent(loadedContent);
            saveDraftToLocal({ title: loadedTitle, content: loadedContent });
            // if (submission?.draft) {
            //   setTitle(submission.draft.title ?? '');
            //   editor?.commands.setContent(submission.draft.content ?? '');
            //   saveDraftToLocal({
            //     title: submission.draft.title ?? '',
            //     content: submission.draft.content ?? '',
            //   });
            //   return;
            // }
            // const local = getDraftFromLocal();
            // setTitle(local?.title ?? '');
            // editor?.commands.setContent(local?.content ?? '');
          } catch (error) {
            console.error('임시저장 불러오기(서버) 실패:', error);
            // const local = getDraftFromLocal();
            // setTitle(local?.title ?? '');
            // editor?.commands.setContent(local?.content ?? '');
          } finally {
            closeModal();
          }
        }}
      />,
    );
  }

  // 포기 버튼 누르면:
  function handleQuit() {
    if (!submissionId) return;

    openModal(
      <ModalConfirm
        message="정말로 포기하시겠어요?"
        cancelButtonText="아니오"
        confirmButtonText="네"
        onCancel={closeModal}
        onConfirm={async () => {
          try {
            const submission = await getSubmissionDetail(submissionId);
            if (!submission?.participationId) return;
            await cancelParticipation(submission.participationId);
            router.push(
              challengeId ? `/challenges/${challengeId}` : '/challenges',
            );
          } catch (error) {
            console.error('작업 포기 실패:', error);
          } finally {
            closeModal();
          }
        }}
      />,
    );
  }

  // 제출하기 버튼 누르면:
  function handleSubmit() {
    if (!submissionId) return;

    openModal(
      <ModalConfirm
        message="작업물을 제출하시겠어요?"
        cancelButtonText="아니오"
        confirmButtonText="네"
        onCancel={closeModal}
        onConfirm={async () => {
          try {
            await updateSubmission(submissionId, editor?.getHTML() ?? '');
            deleteDraft(submissionId).catch((error) => {
              console.error('임시저장 삭제 실패:', error);
            });
            router.push(`/submissions/${submissionId}`);
          } catch (error) {
            console.error('제출 실패:', error);
          } finally {
            closeModal();
          }
        }}
      />,
    );
  }

  return (
    <div className={cn('flex min-h-screen w-full flex-col')}>
      {isResizing && (
        <div className={cn('fixed inset-0 z-50 cursor-col-resize')} />
      )}
      <div
        className={cn('flex w-full flex-col', 'tablet:flex-row')}
        style={{
          '--panel-width':
            panelWidth !== null ? `${panelWidth}px` : DEFAULT_PANEL_WIDTH_CSS,
        }}
      >
        <OriginalUrlPanel
          key={originalUrl ?? ORIGINAL_URL}
          isOpen={isOriginalOpen}
          url={originalUrl ?? ORIGINAL_URL}
          onClose={() => setIsOriginalOpen(false)}
          onResizeStart={handleResizeStart}
        />
        <div
          className={cn(
            'flex min-w-0 w-full flex-col p-[16px]',
            'tablet:p-[24px]',
            !isOriginalOpen && 'desktop:mx-auto desktop:max-w-[890px]',
            isOriginalOpen && 'mt-[16px]',
            isOriginalOpen && 'tablet:mt-0 tablet:mr-[calc(var(--panel-width)]',
            isOriginalOpen && 'desktop:mr-[calc(var(--panel-width))]',
          )}
        >
          <div
            className={cn(
              'flex justify-between items-center mb-[16px]',
              'tablet:mb-[24px]',
            )}
          >
            <Image
              src={logo}
              alt="logo"
              width={120}
              height={27}
              className={cn(
                'h-[18px] w-[80px]',
                !isOriginalOpen && 'tablet:h-[27px] tablet:w-[120px]',
              )}
            ></Image>
            <div
              className={cn(
                'flex flex-row gap-[4px]',
                !isOriginalOpen && 'tablet:gap-[8px]',
              )}
            >
              <ButtonQuit
                className={cn(
                  isOriginalOpen &&
                    'tablet:h-[32px] tablet:px-[10px] tablet:[&>span]:hidden! tablet:[&_img]:w-[16px]!',
                )}
                onClick={handleQuit}
              />
              <ButtonSecondary
                variant="secondary"
                size={isOriginalOpen ? 'sm' : 'md'}
                className={cn(isOriginalOpen && 'rounded-[10px]')}
                onClick={() => {
                  if (!submissionId) return;
                  saveDraft(submissionId, {
                    title,
                    content: editorContent,
                  })
                    .then(() => {
                      setHasSaveError(false);
                      router.push(`/submissions/${submissionId}`);
                    })
                    .catch((error) => {
                      setHasSaveError(true);
                      console.error('임시저장(수동) 실패:', error);
                    });
                }}
              >
                임시저장
              </ButtonSecondary>
              <ButtonSecondary
                size={isOriginalOpen ? 'sm' : 'md'}
                className={cn(isOriginalOpen && 'rounded-[10px]')}
                onClick={handleSubmit}
              >
                제출하기
              </ButtonSecondary>
            </div>
          </div>
          <textarea
            ref={titleTextareaRef}
            value={title}
            onChange={(e) =>
              setTitle(e.target.value.slice(0, TITLE_MAX_LENGTH))
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
            placeholder="제목을 입력해주세요"
            maxLength={TITLE_MAX_LENGTH}
            rows={1}
            className={cn(
              'w-full resize-none overflow-hidden break-words text-20-semibold text-gray-900 outline-none',
              'placeholder:text-gray-400',
            )}
          />
          <p className={cn('text-right text-12-regular text-gray-400')}>
            {title.length}/{TITLE_MAX_LENGTH}
          </p>
          {!isOriginalOpen && (
            <button
              type="button"
              onClick={() => setIsOriginalOpen(true)}
              className={cn(
                'flex fixed items-center gap-1 rounded-l-3xl px-3 top-[144px] right-0 z-50 bg-white py-[14px] shadow-md',
                'tablet:top-[160px]',
                'desktop:top-[136px] desktop:flex-col desktop:gap-[8px]',
                'text-14-semibold text-gray-500',
                'desktop:text-16-semibold',
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
