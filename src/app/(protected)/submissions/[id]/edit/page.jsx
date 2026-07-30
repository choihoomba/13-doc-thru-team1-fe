'use client';

import React, { useEffect, useRef, useState } from 'react';

import { EditorContent } from '@tiptap/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import iconList from '@/app/assets/icons/ic_list.svg';
import logo from '@/app/assets/images/img_logo.svg';

import { getChallenge } from '@/lib/api/challenges';
import {
  deleteDraft,
  getSubmission,
  saveDraft,
  updateSubmission,
} from '@/lib/api/submissions';

import useDebounce from '@/hooks/common/useDebounce';
import { useModal } from '@/hooks/modal/useModal';
import { useCancelParticipation } from '@/hooks/queries/participations/mutations';
import useResizablePanel from '@/hooks/submission/useResizablePanel';
import useSubmissionEditor from '@/hooks/submission/useSubmissionEditor';
import useUnsavedChangesGuard from '@/hooks/submission/useUnsavedChangesGuard';

import { cn } from '@/utils/cn';

import OriginalUrlPanel from '@/components/submissions/OriginalUrlPanel';
import SubmissionEditorToolbar from '@/components/submissions/SubmissionEditorToolbar';
import ButtonQuit from '@/components/ui/Button/ButtonQuit';
import ButtonSecondary from '@/components/ui/Button/ButtonSecondary';
import ModalConfirm from '@/components/ui/Modal/ModalConfirm';
import ModalNotice from '@/components/ui/Modal/ModalNotice';
import Toast from '@/components/ui/Toast';

const SAVE_DEBOUNCE_MS = 500;

function getLocalDraftKey(submissionId) {
  return `submissionEdit:draft:${submissionId}`;
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

// TipTap가 완전히 빈 상태에서도 getHTML()이 ''가 아니라 '<p></p>'를 반환해서 쓰는함수
function isEditorContentEmpty(html) {
  return !html || html.trim() === '<p></p>';
}

// 챌린지 마감 여부. 크론이 아직 status를 바꾸지 않았을 수 있어 deadline도 함께 확인
function isChallengeClosed(challenge) {
  return (
    challenge.status === 'CLOSED' || new Date(challenge.deadline) < new Date()
  );
}

export default function SubmissionEditPage() {
  const params = useParams();
  const submissionId = params?.id;

  const [editorContent, setEditorContent] = useState('');

  const router = useRouter();
  const { openModal, closeModal } = useModal();

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
        if (cancelled || !challenge) return;

        // 마감된 챌린지는 URL로 직접 들어와도 수정 화면 자체를 못 쓰게 막는다
        if (isChallengeClosed(challenge)) {
          openModal(
            <ModalNotice
              message="마감된 챌린지는 수정할 수 없습니다."
              onConfirm={() => {
                closeModal();
                router.push(`/submissions/${submissionId}`);
              }}
            />,
          );
          return;
        }

        if (challenge.originalUrl) setOriginalUrl(challenge.originalUrl);
        if (challenge.title) setChallengeTitle(challenge.title);
      })
      .catch((error) => {
        console.error('원문 링크 조회 실패:', error);
      });

    return () => {
      cancelled = true;
    };
  }, [submissionId, openModal, closeModal, router]);

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

    // content 가 있으면 로컬엔 항상 즉시 저장
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
    // - 로컬이 비어있으면 submission.content(현재 제출된 내용)를 기본값으로 채우고,
    //   그 위에 이어서 수정하던 임시저장(draft)이 있으면 Toast로 불러오기 제안
    onCreate: ({ editor }) => {
      const local = getDraftFromLocal(submissionId);
      if (local) {
        setEditorContent(local.content ?? '');
        editor.commands.setContent(local.content ?? '');
        return;
      }

      if (!submissionId) return;

      getSubmission(submissionId)
        .then((res) => res.data)
        .then((submission) => {
          const initialContent = submission?.content ?? '';
          setEditorContent(initialContent);
          editor.commands.setContent(initialContent);
          setIsToastOpen(Boolean(submission?.draft));
        })
        .catch((error) => {
          console.error('작업물 조회 실패:', error);
        });
    },
  });
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const { isResizing, panelWidthCss, handleResizeStart } = useResizablePanel();

  const { mutateAsync: cancelParticipation } = useCancelParticipation();

  useUnsavedChangesGuard({
    hasSaveError,
    setHasSaveError,
    submissionId,
    challengeTitle,
    editorContent,
  });

  // 작업물 불러오기 Modal로 '네' 클릭시:
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

  // 로컬은 비었을때, 서버에 draft가 있음 -> 불러오기 버튼 누르면:
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
            await cancelParticipation({
              participationId: submission.participationId,
              challengeId,
            });
            removeDraftFromLocal(submissionId);
            deleteDraft(submissionId).catch((error) => {
              console.error('임시저장 삭제 실패:', error);
            });
            closeModal();
            router.push(
              challengeId ? `/challenges/${challengeId}` : '/challenges',
            );
          } catch (error) {
            console.error('작업 포기 실패:', error);
            openModal(
              <ModalNotice message={error.message} onConfirm={closeModal} />,
            );
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
            <Link href="/challenges" aria-label="챌린지 목록으로 이동">
              <Image
                src={logo}
                alt="logo"
                width={120}
                height={27}
                className={cn(
                  'h-[18px] w-[80px]',
                  !isOriginalOpen && 'tablet:h-[27px] tablet:w-[120px]',
                )}
              />
            </Link>
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
