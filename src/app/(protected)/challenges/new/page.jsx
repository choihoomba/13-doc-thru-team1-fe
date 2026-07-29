//챌린지 신청하기 페이지

'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/lib/providers/AuthProvider';

import { useModal } from '@/hooks/modal/useModal';
import { useCreateChallenge } from '@/hooks/queries/challenges/mutations';

import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';
import InputBase from '@/components/ui/Form/InputBase';
import InputCalendar from '@/components/ui/Form/InputCalendar';
import Select from '@/components/ui/Form/Select';
import Textarea from '@/components/ui/Form/Textarea';
import ModalConfirm from '@/components/ui/Modal/ModalConfirm';

const FIELD_OPTIONS = [
  { value: 'NEXTJS', label: 'Next.js' },
  { value: 'REACT', label: 'React' },
  { value: 'MODERNJS', label: 'Modern JS' },
  { value: 'TYPESCRIPT', label: 'TypeScript' },
  { value: 'API', label: 'API' },
  { value: 'WEB', label: 'Web' },
  { value: 'CAREER', label: 'Career' },
];

const DOCUMENT_TYPE_OPTIONS = [
  { value: 'OFFICIAL', label: '공식문서' },
  { value: 'BLOG', label: '블로그' },
  { value: 'BOOK', label: '도서' },
  { value: 'ETC', label: '기타' },
];

const INITIAL_FORM_VALUES = {
  title: '',
  originalUrl: '',
  field: '',
  docType: '',
  deadline: '',
  maxParticipants: '',
  content: '',
};

const MINIMUM_DEADLINE_DAYS = 7;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const MAX_PARTICIPANTS = 15;

// 선택한 날짜 전체를 마감일로 사용할 수 있도록 로컬 날짜의 마지막 시각으로 변환합니다.
function toDeadlineISOString(dateValue) {
  if (!dateValue) return '';

  const [year, month, day] = dateValue.split('-').map(Number);
  const deadline = new Date(year, month - 1, day, 23, 59, 59, 999);

  return deadline.toISOString();
}

// 커스텀 Form 컴포넌트가 같은 방식으로 오류를 표시하도록 페이지에서 값을 검증합니다.
function validateForm(values) {
  const errors = {};
  const trimmedTitle = values.title.trim();
  const trimmedUrl = values.originalUrl.trim();
  const trimmedContent = values.content.trim();
  const participantCount = Number(values.maxParticipants);

  if (!trimmedTitle) {
    errors.title = '* 제목을 입력해주세요.';
  } else if (trimmedTitle.length > 100) {
    errors.title = '* 제목은 100자 이하로 입력해주세요.';
  }

  if (!trimmedUrl) {
    errors.originalUrl = '* 원문 링크를 입력해주세요.';
  } else {
    try {
      const parsedUrl = new URL(trimmedUrl);

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        errors.originalUrl = '* 올바른 원문 링크를 입력해주세요.';
      }
    } catch {
      errors.originalUrl = '* 올바른 원문 링크를 입력해주세요.';
    }
  }

  if (!values.field) {
    errors.field = '* 분야를 선택해주세요.';
  }

  if (!values.docType) {
    errors.docType = '* 문서 타입을 선택해주세요.';
  }

  if (!values.deadline) {
    errors.deadline = '* 마감일을 선택해주세요.';
  } else {
    const selectedDeadline = new Date(toDeadlineISOString(values.deadline));
    const minimumDeadline = new Date(
      Date.now() + MINIMUM_DEADLINE_DAYS * MILLISECONDS_PER_DAY,
    );

    if (selectedDeadline.getTime() < minimumDeadline.getTime()) {
      errors.deadline = '* 마감일은 신청일 기준 최소 7일 이후로 선택해주세요.';
    }
  }

  if (!values.maxParticipants) {
    errors.maxParticipants = '* 최대 인원을 입력해주세요.';
  } else if (!Number.isInteger(participantCount) || participantCount < 1) {
    errors.maxParticipants = '* 최대 인원은 1명 이상부터 지정 할 수 있습니다.';
  } else if (participantCount > MAX_PARTICIPANTS) {
    errors.maxParticipants = '* 최대 인원은 15명까지 지정할 수 있습니다.';
  }

  if (!trimmedContent) {
    errors.content = '* 챌린지 내용을 입력해주세요.';
  } else if (trimmedContent.length > 5000) {
    errors.content = '* 챌린지 내용은 5000자 이하로 입력해주세요.';
  }

  return errors;
}

/**
 * 로그인한 회원과 관리자가 함께 사용하는 신규 챌린지 신청 페이지입니다.
 * (protected) layout이 로그인 여부를 확인하고 Header는 user.role에 맞는 형태를 표시합니다.
 */
export default function ChallengeCreatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { openModal, closeModal } = useModal();
  const { mutateAsync: submitChallenge, isPending } = useCreateChallenge();

  const [values, setValues] = useState(INITIAL_FORM_VALUES);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const isAdmin = user?.role === 'ADMIN';

  function handleChange(event) {
    const { name, value } = event.target;

    // number input의 max 속성은 직접 입력을 막지 않으므로 15명을 넘는 값은 상태에 반영하지 않습니다.
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

  // userId, status, currentParticipants는 서버 관리 값이므로 요청에 포함하지 않습니다.
  function createPayload() {
    return {
      title: values.title.trim(),
      field: values.field,
      docType: values.docType,
      content: values.content.trim(),
      originalUrl: values.originalUrl.trim(),
      deadline: toDeadlineISOString(values.deadline),
      maxParticipants: Number(values.maxParticipants),
    };
  }

  async function handleConfirm() {
    closeModal();

    try {
      await submitChallenge(createPayload());

      router.push(isAdmin ? '/admin/challenges' : '/challenges/mine');
    } catch (error) {
      // clientFetch가 백엔드의 { message, code } 중 message를 Error로 변환합니다.
      setSubmitError(
        error.message ??
          '챌린지 신청 중 오류가 발생했습니다. 다시 시도해주세요.',
      );
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const confirmMessage = isAdmin ? (
      '챌린지를 신청하시겠습니까?'
    ) : (
      <span className="flex flex-col gap-[8px] leading-[24px]">
        <span>신청한 챌린지는 수정할 수 없습니다.</span>
        <span>챌린지를 신청하시겠습니까?</span>
      </span>
    );

    openModal(
      <ModalConfirm
        message={confirmMessage}
        cancelButtonText="취소"
        confirmButtonText="신청"
        onConfirm={handleConfirm}
      />,
    );
  }

  return (
    <div
      className="
        mx-auto min-h-[calc(100vh-56px)] w-full max-w-[1920px] bg-white
        tablet:min-h-[calc(100vh-60px)]
      "
    >
      <main className="px-[16px] pb-[37px] pt-[20px] tablet:pt-[24px]">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-[590px]"
        >
          <h1
            className="
              text-18-bold leading-[26px] text-gray-800
              tablet:text-20-semibold tablet:leading-[24px]
              desktop:flex desktop:h-[40px] desktop:items-center
            "
          >
            신규 챌린지 신청
          </h1>

          <div className="mt-[12px] flex flex-col gap-[24px] tablet:mt-[24px]">
            <InputBase
              required
              label="제목"
              name="title"
              value={values.title}
              error={errors.title}
              maxLength={100}
              onChange={handleChange}
              placeholder="제목을 입력해주세요"
            />

            <InputBase
              required
              label="원문 링크"
              name="originalUrl"
              type="url"
              value={values.originalUrl}
              error={errors.originalUrl}
              maxLength={2048}
              onChange={handleChange}
              placeholder="원문 링크를 입력해주세요"
            />

            <Select
              required
              label="분야"
              name="field"
              value={values.field}
              error={errors.field}
              options={FIELD_OPTIONS}
              onChange={handleChange}
              placeholder="카테고리"
            />

            <Select
              required
              label="문서 타입"
              name="docType"
              value={values.docType}
              error={errors.docType}
              options={DOCUMENT_TYPE_OPTIONS}
              onChange={handleChange}
              placeholder="카테고리"
            />

            <InputCalendar
              required
              label="마감일"
              name="deadline"
              value={values.deadline}
              error={errors.deadline}
              onChange={handleChange}
            />

            <InputBase
              required
              className="tablet:mt-[8px]"
              inputClassName="h-[57px]"
              label="최대 인원"
              name="maxParticipants"
              type="number"
              min="1"
              max={MAX_PARTICIPANTS}
              step="1"
              borderRadius={8}
              value={values.maxParticipants}
              error={errors.maxParticipants}
              onChange={handleChange}
              placeholder="인원을 입력해주세요"
            />

            <Textarea
              required
              className="tablet:mt-[8px]"
              textareaClassName="h-[228px]"
              label="내용"
              name="content"
              value={values.content}
              error={errors.content}
              maxLength={5000}
              onChange={handleChange}
              placeholder="내용을 입력해주세요"
            />

            {submitError && (
              <p role="alert" className="text-14-regular text-red-error">
                {submitError}
              </p>
            )}

            <ButtonPrimary
              type="submit"
              size="xl"
              width="100%"
              disabled={isPending}
            >
              {isPending ? '신청 중...' : '신청하기'}
            </ButtonPrimary>
          </div>
        </form>
      </main>
    </div>
  );
}
