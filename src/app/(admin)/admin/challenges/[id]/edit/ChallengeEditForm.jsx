import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';
import InputBase from '@/components/ui/Form/InputBase';
import InputCalendar from '@/components/ui/Form/InputCalendar';
import Select from '@/components/ui/Form/Select';
import Textarea from '@/components/ui/Form/Textarea';

import {
  DOCUMENT_TYPE_OPTIONS,
  FIELD_OPTIONS,
  getMaximumDeadlineValue,
  getMinimumDeadlineValue,
  MAX_PARTICIPANTS,
} from './challengeEditFormUtils';

/**
 * 수정 페이지의 입력 화면만 담당하는 컴포넌트입니다.
 * 데이터 조회와 API 요청은 page.jsx가 담당하고, 이 컴포넌트는 받은 값과
 * 이벤트를 공통 Form 컴포넌트에 연결합니다.
 */
export default function ChallengeEditForm({
  values,
  errors,
  submitError,
  currentParticipants,
  isUpdating,
  isSubmitDisabled,
  onChange,
  onSubmit,
}) {
  const minimumDeadline = getMinimumDeadlineValue();
  const maximumDeadline = getMaximumDeadlineValue();

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
          onSubmit={onSubmit}
          className="mx-auto w-full max-w-[590px]"
        >
          <h1
            className="
              text-18-bold leading-[26px] text-gray-800
              tablet:text-20-semibold tablet:leading-[24px]
              desktop:flex desktop:h-[40px] desktop:items-center
            "
          >
            챌린지 수정하기
          </h1>

          <div className="mt-[12px] flex flex-col gap-[24px] tablet:mt-[24px]">
            <InputBase
              required
              showRequired={Boolean(errors.title)}
              label="제목"
              name="title"
              value={values.title}
              error={errors.title}
              maxLength={100}
              onChange={onChange}
              placeholder="제목을 입력해주세요"
            />

            <InputBase
              required
              showRequired={Boolean(errors.originalUrl)}
              label="원문 링크"
              name="originalUrl"
              type="url"
              value={values.originalUrl}
              error={errors.originalUrl}
              maxLength={2048}
              onChange={onChange}
              placeholder="원문 링크를 입력해주세요"
            />

            <Select
              required
              showRequired={Boolean(errors.field)}
              label="분야"
              name="field"
              value={values.field}
              error={errors.field}
              options={FIELD_OPTIONS}
              onChange={onChange}
              placeholder="카테고리"
            />

            <Select
              required
              showRequired={Boolean(errors.docType)}
              label="문서 타입"
              name="docType"
              value={values.docType}
              error={errors.docType}
              options={DOCUMENT_TYPE_OPTIONS}
              onChange={onChange}
              placeholder="카테고리"
            />

            <InputCalendar
              required
              showRequired={Boolean(errors.deadline)}
              label="마감일"
              name="deadline"
              value={values.deadline}
              error={errors.deadline}
              helperText="마감일은 오늘부터 21일 이내의 날짜로 변경할 수 있습니다."
              min={minimumDeadline}
              max={maximumDeadline}
              onChange={onChange}
            />

            <InputBase
              required
              showRequired={Boolean(errors.maxParticipants)}
              className="tablet:mt-[8px]"
              inputClassName="h-[57px]"
              label="최대 인원"
              name="maxParticipants"
              type="number"
              min={Math.max(currentParticipants, 1)}
              max={MAX_PARTICIPANTS}
              step="1"
              borderRadius={8}
              value={values.maxParticipants}
              error={errors.maxParticipants}
              onChange={onChange}
              placeholder="인원을 입력해주세요"
            />

            <Textarea
              required
              showRequired={Boolean(errors.content)}
              className="tablet:mt-[8px]"
              textareaClassName="h-[228px]"
              label="내용"
              name="content"
              value={values.content}
              error={errors.content}
              maxLength={5000}
              onChange={onChange}
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
              disabled={isSubmitDisabled}
            >
              {isUpdating ? '수정 중...' : '수정하기'}
            </ButtonPrimary>
          </div>
        </form>
      </main>
    </div>
  );
}
