'use client';

import React, { useEffect, useState } from 'react';

import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import iconList from '@/app/assets/icons/ic_list.svg';
import logo from '@/app/assets/images/img_logo.svg';

import {
  deleteDraft,
  getChallenge,
  getSubmission,
  saveDraft,
  updateSubmission,
} from '@/lib/api/submissionNew';

import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

import OriginalUrlPanel from '@/components/submissions/OriginalUrlPanel';
import SubmissionEditorToolbar from '@/components/submissions/SubmissionEditorToolbar';
import ButtonSecondary from '@/components/ui/Button/ButtonSecondary';
import ModalConfirm from '@/components/ui/Modal/ModalConfirm';

// 임시 originalUrl
const ORIGINAL_URL = 'https://github.com/choihoomba/13-doc-thru-team1-fe/pulls';

const MIN_PANEL_WIDTH = 320; // 원문 최소 폭(px)
const MIN_EDITOR_WIDTH = 320; // 에디터 최소 폭(px)
const DEFAULT_PANEL_WIDTH_CSS = `clamp(${MIN_PANEL_WIDTH}px, 50vw, calc(100vw - ${MIN_EDITOR_WIDTH}px))`;

export default function AdminSubmissionEditPage() {
  const params = useParams();
  const submissionId = params?.id;

  const [editorContent, setEditorContent] = useState('');

  const router = useRouter();

  // 원문 링크 / 챌린지 제목 / 기존 제출 내용 가져오기
  const [originalUrl, setOriginalUrl] = useState(null);
  const [challengeTitle, setChallengeTitle] = useState('');
  const [initialContent, setInitialContent] = useState(null);
  useEffect(() => {
    if (!submissionId) return;

    let cancelled = false;
    getSubmission(submissionId)
      .then((submission) => {
        if (cancelled) return null;
        setInitialContent(
          submission?.draft?.content ?? submission?.content ?? '',
        );
        if (!submission?.challengeId) return null;
        return getChallenge(submission.challengeId);
      })
      .then((challenge) => {
        if (cancelled || !challenge) return;
        if (challenge.originalUrl) setOriginalUrl(challenge.originalUrl);
        if (challenge.title) setChallengeTitle(challenge.title);
      })
      .catch((error) => {
        console.error('작업물 정보 조회 실패:', error);
      });

    return () => {
      cancelled = true;
    };
  }, [submissionId]);

  const [hasSaveError, setHasSaveError] = useState(false); // 서버 저장 실패 여부 판단

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
    immediatelyRender: false,
  });

  // 기존 작업물 내용을 에디터에 최초 1회 채워넣기
  // setContent는 기본적으로 update 이벤트를 emit하므로 onUpdate가 editorContent를 채워줌
  useEffect(() => {
    if (!editor || initialContent === null) return;
    editor.commands.setContent(initialContent);
  }, [editor, initialContent]);

  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(null);
  const [isResizing, setIsResizing] = useState(false);

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

  const { openModal, closeModal } = useModal();

  // 서버 저장 실패한 채로 브라우저 뒤로가기를 시도하면 ModalConfirm으로 임시저장 여부 확인
  useEffect(() => {
    if (!hasSaveError) return;
    window.history.pushState(null, '', window.location.href);

    function handlePopState() {
      openModal(
        <ModalConfirm
          message="수정 중인 내용이 있습니다. 임시저장하시겠습니까?"
          cancelButtonText="아니오"
          confirmButtonText="네"
          onCancel={() => {
            window.history.pushState(null, '', window.location.href);
            closeModal();
          }}
          onConfirm={async () => {
            try {
              await saveDraft(submissionId, {
                title: challengeTitle,
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
  }, [
    hasSaveError,
    submissionId,
    challengeTitle,
    editorContent,
    openModal,
    closeModal,
  ]);

  // 임시저장 버튼 누르면:
  function handleSaveDraft() {
    if (!submissionId) return;
    if (!editorContent.trim()) return; // content가 비어있으면 서버(draft) 저장은 항상 400이라 아예 시도 안 함

    saveDraft(submissionId, {
      title: challengeTitle,
      content: editorContent,
    })
      .then(() => {
        setHasSaveError(false);
        router.push(`/admin/submissions/${submissionId}`);
      })
      .catch((error) => {
        setHasSaveError(true);
        console.error('임시저장 실패:', error);
      });
  }

  // 수정하기 버튼 누르면:
  function handleSubmit() {
    if (!submissionId) return;

    openModal(
      <ModalConfirm
        message="작업물을 수정하시겠어요?"
        cancelButtonText="아니오"
        confirmButtonText="네"
        onCancel={closeModal}
        onConfirm={async () => {
          try {
            await updateSubmission(submissionId, editor?.getHTML() ?? '');
            deleteDraft(submissionId).catch((error) => {
              console.error('임시저장 삭제 실패:', error);
            });
            router.push(`/admin/submissions/${submissionId}`);
          } catch (error) {
            console.error('수정 실패:', error);
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
            isOriginalOpen &&
              'tablet:mt-0 tablet:pr-0 tablet:ml-auto tablet:max-w-[890px] tablet:mr-[calc(var(--panel-width)+18px)]',
            isOriginalOpen && 'desktop:mr-[calc(var(--panel-width)+24px)]',
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
              <ButtonSecondary
                variant="secondary"
                size={isOriginalOpen ? 'sm' : 'md'}
                className={cn(isOriginalOpen && 'rounded-[10px]')}
                onClick={handleSaveDraft}
              >
                임시저장
              </ButtonSecondary>
              <ButtonSecondary
                size={isOriginalOpen ? 'sm' : 'md'}
                className={cn(isOriginalOpen && 'rounded-[10px]')}
                onClick={handleSubmit}
              >
                수정하기
              </ButtonSecondary>
            </div>
          </div>
          <p
            className={cn('w-full break-words text-20-semibold text-gray-900')}
          >
            {challengeTitle}
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
              <SubmissionEditorToolbar editor={editor} />
              <EditorContent editor={editor} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
