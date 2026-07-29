export const FIELD_OPTIONS = [
  { value: 'NEXTJS', label: 'Next.js' },
  { value: 'REACT', label: 'React' },
  { value: 'MODERNJS', label: 'Modern JS' },
  { value: 'TYPESCRIPT', label: 'TypeScript' },
  { value: 'API', label: 'API' },
  { value: 'WEB', label: 'Web' },
  { value: 'CAREER', label: 'Career' },
];

export const DOCUMENT_TYPE_OPTIONS = [
  { value: 'OFFICIAL', label: '공식문서' },
  { value: 'BLOG', label: '블로그' },
  { value: 'BOOK', label: '도서' },
  { value: 'ETC', label: '기타' },
];

export const EMPTY_FORM_VALUES = {
  title: '',
  originalUrl: '',
  field: '',
  docType: '',
  deadline: '',
  maxParticipants: '',
  content: '',
};

export const MAX_PARTICIPANTS = 15;
export const MAXIMUM_DEADLINE_DAYS = 21;

const TITLE_TEXT_PATTERN = /[\p{L}\p{N}]/u;

/**
 * API의 ISO 날짜를 InputCalendar가 사용하는 YYYY-MM-DD로 변환합니다.
 * 로컬 날짜를 직접 조합해 UTC 변환으로 하루가 달라지는 문제를 막습니다.
 */
function toDateInputValue(dateValue) {
  if (!dateValue) return '';

  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * 선택한 날짜 전체를 마감일로 사용할 수 있도록 로컬 23:59:59를 ISO로 변환합니다.
 */
function toDeadlineISOString(dateValue) {
  if (!dateValue) return '';

  const [year, month, day] = dateValue.split('-').map(Number);
  const deadline = new Date(year, month - 1, day, 23, 59, 59, 999);

  return deadline.toISOString();
}

/**
 * 관리자 수정에서는 신규 신청의 7일 제한을 다시 적용하지 않습니다.
 * 백엔드 수정 정책과 동일하게 오늘을 포함한 미래 날짜를 선택할 수 있도록
 * 현재 날짜를 최소 마감일로 반환합니다.
 * InputCalendar의 min prop이 사용하는 YYYY-MM-DD 형식으로 반환합니다.
 */
export function getMinimumDeadlineValue(baseDate = new Date()) {
  return toDateInputValue(baseDate);
}

/**
 * 관리자 수정에서도 요청일로부터 21일째 날짜까지만 선택할 수 있습니다.
 * InputCalendar의 max prop이 사용하는 YYYY-MM-DD 형식으로 반환합니다.
 */
export function getMaximumDeadlineValue(baseDate = new Date()) {
  const maximumDeadline = new Date(baseDate);
  maximumDeadline.setDate(maximumDeadline.getDate() + MAXIMUM_DEADLINE_DAYS);

  return toDateInputValue(maximumDeadline);
}

/**
 * 상세 조회 응답을 controlled Form이 사용하는 문자열 값으로 변환합니다.
 */
export function createInitialValues(challenge) {
  return {
    title: challenge.title ?? '',
    originalUrl: challenge.originalUrl ?? '',
    field: challenge.field ?? '',
    docType: challenge.docType ?? '',
    deadline: toDateInputValue(challenge.deadline),
    maxParticipants: String(challenge.maxParticipants ?? ''),
    content: challenge.content ?? '',
  };
}

/**
 * 관리자 수정에서는 오늘을 포함한 미래 날짜인지 검증합니다.
 * 신규 신청 단계에서 이미 7일 제한을 검증했으므로 수정 시 다시 적용하지 않습니다.
 * 달력의 min 제한을 우회해 값을 전달해도 제출 단계에서 다시 차단합니다.
 */
export function validateChallengeEditForm(values, currentParticipants) {
  const errors = {};
  const trimmedTitle = values.title.trim();
  const trimmedUrl = values.originalUrl.trim();
  const trimmedContent = values.content.trim();
  const participantCount = Number(values.maxParticipants);

  if (!trimmedTitle) {
    errors.title = '* 제목을 입력해주세요.';
  } else if (!TITLE_TEXT_PATTERN.test(trimmedTitle)) {
    errors.title = '* 제목은 문자 또는 숫자를 포함해주세요.';
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
    const maximumDeadline = new Date();
    maximumDeadline.setDate(maximumDeadline.getDate() + MAXIMUM_DEADLINE_DAYS);
    maximumDeadline.setHours(23, 59, 59, 999);

    if (
      selectedDeadline.getTime() <= Date.now() ||
      selectedDeadline.getTime() > maximumDeadline.getTime()
    ) {
      errors.deadline = '* 마감일은 오늘부터 21일 이내의 날짜로 선택해주세요.';
    }
  }

  if (!values.maxParticipants) {
    errors.maxParticipants = '* 최대 인원을 입력해주세요.';
  } else if (!Number.isInteger(participantCount) || participantCount < 1) {
    errors.maxParticipants = '* 최대 인원은 1명 이상부터 지정할 수 있습니다.';
  } else if (participantCount < currentParticipants) {
    errors.maxParticipants =
      '* 최대 인원은 현재 참여 인원보다 작게 지정할 수 없습니다.';
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
 * 실제로 달라진 값만 PATCH payload에 포함합니다.
 * 같은 값을 다시 보내 수정 알림이 불필요하게 생성되는 것을 방지합니다.
 */
export function createChangedChallengeFields(values, initialValues) {
  const changedFields = {};
  const normalizedValues = {
    ...values,
    title: values.title.trim(),
    originalUrl: values.originalUrl.trim(),
    content: values.content.trim(),
  };

  if (normalizedValues.title !== initialValues.title.trim()) {
    changedFields.title = normalizedValues.title;
  }

  if (normalizedValues.originalUrl !== initialValues.originalUrl.trim()) {
    changedFields.originalUrl = normalizedValues.originalUrl;
  }

  if (normalizedValues.field !== initialValues.field) {
    changedFields.field = normalizedValues.field;
  }

  if (normalizedValues.docType !== initialValues.docType) {
    changedFields.docType = normalizedValues.docType;
  }

  if (normalizedValues.deadline !== initialValues.deadline) {
    changedFields.deadline = toDeadlineISOString(normalizedValues.deadline);
  }

  if (
    Number(normalizedValues.maxParticipants) !==
    Number(initialValues.maxParticipants)
  ) {
    changedFields.maxParticipants = Number(normalizedValues.maxParticipants);
  }

  if (normalizedValues.content !== initialValues.content.trim()) {
    changedFields.content = normalizedValues.content;
  }

  return changedFields;
}
