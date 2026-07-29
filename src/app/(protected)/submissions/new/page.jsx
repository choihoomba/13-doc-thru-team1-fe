/** 작업 도전하기 페이지 */
'use client';

import React, { useEffect, useRef, useState } from 'react';

import { EditorContent } from '@tiptap/react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import iconList from '@/app/assets/icons/ic_list.svg';
import logo from '@/app/assets/images/img_logo.svg';

import {
  cancelParticipation,
  deleteDraft,
  getChallenge,
  getSubmission,
  saveDraft,
  updateSubmission,
} from '@/lib/api/submissions';

import useDebounce from '@/hooks/common/useDebounce';
import { useModal } from '@/hooks/modal/useModal';
import useResizablePanel from '@/hooks/submission/useResizablePanel';
import useSubmissionEditor from '@/hooks/submission/useSubmissionEditor';
import useUnsavedChangesGuard from '@/hooks/submission/useUnsavedChangesGuard';

import { cn } from '@/utils/cn';

import OriginalUrlPanel from '@/components/submissions/OriginalUrlPanel';
import SubmissionEditorToolbar from '@/components/submissions/SubmissionEditorToolbar';
import ButtonQuit from '@/components/ui/Button/ButtonQuit';
import ButtonSecondary from '@/components/ui/Button/ButtonSecondary';
import ModalConfirm from '@/components/ui/Modal/ModalConfirm';
import Toast from '@/components/ui/Toast';

const SAVE_DEBOUNCE_MS = 500;

function getLocalDraftKey(submissionId) {
  return `submissionNew:draft:${submissionId}`;
}

function saveDraftToLocal(submissionId, { title, content }) {
  if (typeof window === 'undefined' || !submissionId) return;

  localStorage.setItem(
    getLocalDraftKey(submissionId),
    JSON.stringify({ title, content, updatedAt: new Date().toISOString() }),
  );
}

function getDraftFromLocal(submissionId) {
  if (typeof window === 'undefined' || !submissionId) return null;
  const raw = localStorage.getItem(getLocalDraftKey(submissionId));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function removeDraftFromLocal(submissionId) {
  if (typeof window === 'undefined' || !submissionId) return;
  localStorage.removeItem(getLocalDraftKey(submissionId));
}

// TipTap가 완전히 빈 상태에서도 getHTML()이 ''가 아니라 '<p></p>'를 반환해서 만든 함수
function isEditorContentEmpty(html) {
  return !html || html.trim() === '<p></p>';
}

export default function NewSubmissionPage() {
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  // 챌린지 상세페이지에서 ?id= 형식으로 받기
  const [editorContent, setEditorContent] = useState('');

  const router = useRouter();

  // originalUrl, challenge.title
  const [originalUrl, setOriginalUrl] = useState(null);
  const [challengeId, setChallengeId] = useState(null);
  const [challengeTitle, setChallengeTitle] = useState('');
  useEffect(() => {
    if (!submissionId) return;

    let cancelled = false;
    getSubmission(submissionId)
      .then((res) => res.data)
      .then((submission) => {
        if (!submission?.challengeId) return null;
        if (!cancelled) setChallengeId(submission.challengeId);
        return getChallenge(submission.challengeId);
      })
      .then((challenge) => {
        if (cancelled) return;
        if (challenge?.originalUrl) setOriginalUrl(challenge.originalUrl);
        if (challenge?.title) setChallengeTitle(challenge.title);
      })
      .catch((error) => {
        console.error('원문 링크 조회 실패:', error);
      });

    return () => {
      cancelled = true;
    };
  }, [submissionId]);

  // debounce
  const debouncedContent = useDebounce(editorContent, SAVE_DEBOUNCE_MS);
  const [hasSaveError, setHasSaveError] = useState(false); // 서버 저장 실패 여부 판단

  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    // content가 비어있으면 로컬/서버 둘 다 저장 안 함
    if (isEditorContentEmpty(debouncedContent)) return;

    // content가 있으면 로컬엔 항상 즉시 저장
    saveDraftToLocal(submissionId, {
      title: challengeTitle,
      content: debouncedContent,
    });

    if (!submissionId) return;
    saveDraft(submissionId, {
      title: challengeTitle,
      content: debouncedContent,
    })
      .then(() => setHasSaveError(false))
      .catch((error) => {
        setHasSaveError(true);
        console.error('임시저장(서버) 실패:', error);
      });
  }, [debouncedContent, submissionId, challengeTitle]);

  const editor = useSubmissionEditor({
    onUpdate: ({ editor }) => setEditorContent(editor.getHTML()),
    // - 로컬에 있으면 묻지 않고 바로 채움 -> 적다가 모르고 새로고침함
    // - 로컬이 비어있으면 서버 기준으로 Toast 노출
    onCreate: ({ editor }) => {
      const local = getDraftFromLocal(submissionId);
      if (local) {
        setEditorContent(local.content ?? '');
        editor.commands.setContent(local.content ?? '');
        return;
      }

      if (!submissionId) return;

      getSubmission(submissionId)
        .then((res) => setIsToastOpen(Boolean(res?.data?.draft)))
        .catch((error) => {
          console.error('임시저장 존재 확인 실패:', error);
        });
    },
  });
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const { isResizing, panelWidthCss, handleResizeStart } = useResizablePanel();

  const { openModal, closeModal } = useModal();

  useUnsavedChangesGuard({
    hasSaveError,
    setHasSaveError,
    submissionId,
    challengeTitle,
    editorContent,
  });

  async function attemptLoadDraft() {
    try {
      const submission = (await getSubmission(submissionId)).data;
      const loadedContent = submission?.draft?.content ?? '';
      setEditorContent(loadedContent);
      editor?.commands.setContent(loadedContent);
      saveDraftToLocal(submissionId, {
        title: challengeTitle,
        content: loadedContent,
      });
      closeModal();
    } catch (error) {
      console.error('임시저장 불러오기(서버) 실패:', error);
      openModal(
        <ModalConfirm
          message={'불러오기가 실패하였습니다.\n다시 시도하시겠습니까?'}
          cancelButtonText="아니오"
          confirmButtonText="네"
          onCancel={closeModal}
          onConfirm={attemptLoadDraft}
        />,
      );
    }
  }

  function handleLoadDraft() {
    setIsToastOpen(false);
    openModal(
      <ModalConfirm
        message="이전 작업물을 불러오시겠어요?"
        cancelButtonText="아니오"
        confirmButtonText="네"
        onCancel={closeModal}
        onConfirm={attemptLoadDraft}
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
            const submission = (await getSubmission(submissionId)).data;
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
          const content = editor?.getHTML() ?? '';
          if (isEditorContentEmpty(content)) {
            console.error('제출 실패: 에디터가 아직 준비되지 않았습니다.');
            closeModal();
            return;
          }

          try {
            await updateSubmission(submissionId, content);
            removeDraftFromLocal(submissionId);
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
        style={{ '--panel-width': panelWidthCss }}
      >
        <OriginalUrlPanel
          key={originalUrl}
          isOpen={isOriginalOpen}
          url={originalUrl}
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
                disabled={!editor}
                onClick={() => {
                  if (!submissionId) return;
                  if (isEditorContentEmpty(editorContent)) return;
                  saveDraft(submissionId, {
                    title: challengeTitle,
                    content: editorContent,
                  })
                    .then(() => setHasSaveError(false))
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
                disabled={!editor}
                onClick={handleSubmit}
              >
                제출하기
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
                'flex fixed items-center gap-1 rounded-l-3xl px-3 top-[144px] right-0 z-50 bg-white py-[14px] shadow-md cursor-pointer',
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
      <Toast
        isOpen={isToastOpen}
        onClose={() => setIsToastOpen(false)}
        onLoad={handleLoadDraft}
      />
    </div>
  );
}
