import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';
import InputBase from '@/components/ui/Form/InputBase';
import InputCalendar from '@/components/ui/Form/InputCalendar';
import Select from '@/components/ui/Form/Select';
import Textarea from '@/components/ui/Form/Textarea';

const FIELD_OPTIONS = ['Next.js', 'API', 'Career', 'Modern JS', 'Web'];
const DOCUMENT_TYPE_OPTIONS = ['공식 문서', '블로그', '기타'];

/*
@ Form 공통 컴포넌트 사용 예시
- Figma의 신규 챌린지 신청 페이지에 나온 필드 순서와 문구를 사용합니다.
- Header는 별도 이슈에서 작업하므로 제외하고, 본문 시작 위치만 유지합니다.
- 폼은 최대 590px이며 모바일에서는 좌우 16px을 제외한 너비로 줄어듭니다.
*/
export default function FormsExPage() {
  return (
    <main className="min-h-screen bg-white px-[16px] pt-[96px] pb-[37px]">
      <form className="mx-auto w-full max-w-[590px]">
        <h1 className="text-20-semibold text-gray-800">신규 챌린지 신청</h1>

        {/* Figma의 첫 필드 시작 위치(148px)에 맞춘 제목 아래 간격입니다. */}
        <div className="mt-[28px] flex flex-col gap-[24px]">
          <InputBase
            label="제목"
            name="title"
            placeholder="제목을 입력해주세요"
          />
          <InputBase
            label="원문 링크"
            name="sourceUrl"
            type="url"
            placeholder="원문 링크를 입력해주세요"
          />
          <Select
            label="분야"
            name="field"
            placeholder="카테고리"
            options={FIELD_OPTIONS}
          />
          <Select
            label="문서 타입"
            name="documentType"
            placeholder="카테고리"
            options={DOCUMENT_TYPE_OPTIONS}
          />
          <InputCalendar label="마감일" name="deadline" />
          <InputBase
            label="최대 인원"
            name="maxParticipants"
            type="number"
            min="1"
            placeholder="인원을 입력해주세요"
          />

          {/* 실제 페이지 프레임에서 확인한 Textarea 시작 위치를 유지합니다. */}
          <Textarea
            className="mt-[25px]"
            label="내용"
            name="content"
            placeholder="내용을 입력해주세요"
          />

          {/* 버튼 담당자의 사용 규칙에 따라 신청하기는 xl 크기를 사용합니다. */}
          <ButtonPrimary type="submit" size="xl" width="100%">
            신청하기
          </ButtonPrimary>
        </div>
      </form>
    </main>
  );
}
