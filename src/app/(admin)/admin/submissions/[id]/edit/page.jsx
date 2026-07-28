'use client';

import React, { useEffect, useState } from 'react';

import { EditorContent } from '@tiptap/react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import iconList from '@/app/assets/icons/ic_list.svg';
import logo from '@/app/assets/images/img_logo.svg';

import {
  getChallenge,
  getSubmission,
  updateSubmission,
} from '@/lib/api/submissionNew';

import { useModal } from '@/hooks/modal/useModal';
import useResizablePanel from '@/hooks/submission/useResizablePanel';
import useSubmissionEditor from '@/hooks/submission/useSubmissionEditor';

import { cn } from '@/utils/cn';

import OriginalUrlPanel from '@/components/submissions/OriginalUrlPanel';
import SubmissionEditorToolbar from '@/components/submissions/SubmissionEditorToolbar';
import ButtonSecondary from '@/components/ui/Button/ButtonSecondary';
import ModalConfirm from '@/components/ui/Modal/ModalConfirm';

// TODO: 지우기 임시 originalUrl
const ORIGINAL_URL = 'https://github.com/choihoomba/13-doc-thru-team1-fe/pulls';

export default function AdminSubmissionEditPage() {
  const params = useParams();
  const submissionId = params?.id;

  const router = useRouter();

  // originalUrl / challengeTitle / 기존 제출 내용 가져오기
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

  const editor = useSubmissionEditor();

  // 기존 작업물 내용을 에디터에 최초 1회 채워넣기
  useEffect(() => {
    if (!editor || initialContent === null) return;
    editor.commands.setContent(initialContent);
  }, [editor, initialContent]);

  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const { isResizing, panelWidthCss, handleResizeStart } = useResizablePanel();

  const { openModal, closeModal } = useModal();

  // 취소하기 버튼 누르면:
  function handleCancel() {
    openModal(
      <ModalConfirm
        message={'작성 중인 내용이 있습니다.\n 정말 취소하시겠습니까?'}
        cancelButtonText="아니오"
        confirmButtonText="네"
        onCancel={closeModal}
        onConfirm={() => {
          closeModal();
          router.push(`/admin/submissions/${submissionId}`);
        }}
      />,
    );
  }

  // 수정하기 버튼 누르면:
  function handleEdit() {
    openModal(
      <ModalConfirm
        message="작업물을 수정하시겠어요?"
        cancelButtonText="아니오"
        confirmButtonText="네"
        onCancel={closeModal}
        onConfirm={async () => {
          try {
            await updateSubmission(submissionId, editor?.getHTML() ?? '');
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
        style={{ '--panel-width': panelWidthCss }}
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
                onClick={handleCancel}
              >
                취소하기
              </ButtonSecondary>
              <ButtonSecondary
                size={isOriginalOpen ? 'sm' : 'md'}
                className={cn(isOriginalOpen && 'rounded-[10px]')}
                onClick={handleEdit}
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
