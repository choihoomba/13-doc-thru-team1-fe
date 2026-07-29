'use client';

import { useEffect, useRef, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useModal } from '@/hooks/modal/useModal';
import { useUpdateChallenge } from '@/hooks/queries/challenges/mutations';
import { useChallenge } from '@/hooks/queries/challenges/queries';

import ErrorDisplay from '@/components/ui/ErrorDisplay';
import LoadingDisplay from '@/components/ui/LoadingDisplay';
import ModalRejectReason from '@/components/ui/Modal/ModalRejectReason';

import ChallengeEditForm from './ChallengeEditForm';
import {
  createChangedChallengeFields,
  createInitialValues,
  EMPTY_FORM_VALUES,
  MAX_PARTICIPANTS,
  validateChallengeEditForm,
} from './challengeEditFormUtils';

/**
 * 관리자 전용 챌린지 수정 페이지입니다.
 *
 * 상위 `(admin)` layout이 ADMIN 권한을 검사하고 루트에서 Header를 렌더링하므로,
 * 이 파일은 상세 조회·수정 요청·수정 사유 모달 등 페이지 흐름만 담당합니다.
 */
export default function AdminChallengeEditPage() {
  const params = useParams();
  const router = useRouter();
  const { openModal } = useModal();
  const challengeId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const {
    data: challenge,
    isPending: isLoadingChallenge,
    isError,
    error: challengeError,
  } = useChallenge(challengeId);
  const { mutateAsync: submitUpdate, isPending: isUpdating } =
    useUpdateChallenge(challengeId);

  const initializedChallengeIdRef = useRef(null);
  const [initialValues, setInitialValues] = useState(null);
  const [values, setValues] = useState(EMPTY_FORM_VALUES);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  // 캐시가 다시 갱신돼도 작성 중인 입력값을 덮지 않도록 id별 한 번만 초기화합니다.
  useEffect(() => {
    if (!challenge || initializedChallengeIdRef.current === challengeId) return;

    const nextValues = createInitialValues(challenge);
    initializedChallengeIdRef.current = challengeId;
    setInitialValues(nextValues);
    setValues(nextValues);
  }, [challenge, challengeId]);

  function handleChange(event) {
    const { name, value } = event.target;

    // input의 max 속성으로 막을 수 없는 키보드 직접 입력도 제한합니다.
    if (
      name === 'maxParticipants' &&
      value !== '' &&
      Number(value) > MAX_PARTICIPANTS
    ) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        maxParticipants: '* 최대 인원은 15명까지 지정할 수 있습니다.',
      }));
      return;
    }

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }));
    setSubmitError('');
  }

  async function handleUpdate(changedFields, reason) {
    try {
      await submitUpdate({
        ...changedFields,
        reason: reason.trim(),
      });

      router.push(`/admin/challenges/${challengeId}`);
    } catch (error) {
      // clientFetch가 변환한 백엔드 검증 메시지를 사용자에게 그대로 안내합니다.
      setSubmitError(
        error.message ??
          '챌린지 수정 중 오류가 발생했습니다. 다시 시도해주세요.',
      );
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!initialValues || !challenge) return;

    const nextErrors = validateChallengeEditForm(
      values,
      challenge.currentParticipants ?? 0,
    );
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const changedFields = createChangedChallengeFields(values, initialValues);

    if (Object.keys(changedFields).length === 0) {
      setSubmitError('수정된 챌린지 정보가 없습니다.');
      return;
    }

    setSubmitError('');
    openModal(
      <ModalRejectReason
        title="수정 사유"
        label="내용"
        placeholder="수정 사유를 입력해주세요"
        submitText="수정"
        onSubmit={(reason) => handleUpdate(changedFields, reason)}
      />,
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        message={
          challengeError?.message ??
          '챌린지 정보를 불러오는 중 오류가 발생했습니다.'
        }
      />
    );
  }

  if (isLoadingChallenge || !initialValues) {
    return (
      <LoadingDisplay className="min-h-[calc(100vh-56px)] tablet:min-h-[calc(100vh-60px)]" />
    );
  }

  return (
    <ChallengeEditForm
      values={values}
      errors={errors}
      submitError={submitError}
      currentParticipants={challenge.currentParticipants ?? 0}
      isUpdating={isUpdating}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
