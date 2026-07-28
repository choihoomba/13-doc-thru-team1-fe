'use client';

import { useEffect } from 'react';

import { saveDraft } from '@/lib/api/submissionNew';

import { useModal } from '@/hooks/modal/useModal';

import ModalConfirm from '@/components/ui/Modal/ModalConfirm';

/** 서버 저장 실패한 채로 브라우저 뒤로가기를 시도하면 ModalConfirm으로 임시저장 여부 확인 */
export default function useUnsavedChangesGuard({
  hasSaveError,
  setHasSaveError,
  submissionId,
  challengeTitle,
  editorContent,
}) {
  const { openModal, closeModal } = useModal();

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
    setHasSaveError,
    submissionId,
    challengeTitle,
    editorContent,
    openModal,
    closeModal,
  ]);
}
