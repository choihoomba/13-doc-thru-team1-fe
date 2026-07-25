import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';
import InputBase from '@/components/ui/Form/InputBase';
import InputCalendar from '@/components/ui/Form/InputCalendar';
import Select from '@/components/ui/Form/Select';
import Textarea from '@/components/ui/Form/Textarea';

/*
@ 신규 챌린지 페이지 전용 옵션
- 공통 Form 스타일 파일에 도메인 데이터를 섞지 않고 이 페이지에서만 관리합니다.
- label은 화면 표시 문구, value는 Prisma enum/API 요청 값입니다.
*/
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

export default function FormsExPage() {
  return (
    <main className="min-h-screen bg-white px-[16px] pt-[96px] pb-[37px]">
      <form className="mx-auto w-full max-w-[590px]">
        <h1 className="text-20-semibold text-gray-800">신규 챌린지 신청</h1>

        <div className="mt-[28px] flex flex-col gap-[24px]">
          <InputBase
            label="제목"
            name="title"
            placeholder="제목을 입력해주세요"
          />

          <InputBase
            label="원문 링크"
            name="originalUrl"
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
            name="docType"
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

          <Textarea
            className="mt-[25px]"
            label="내용"
            name="content"
            placeholder="내용을 입력해주세요"
          />

          <ButtonPrimary type="submit" size="xl" width="100%">
            신청하기
          </ButtonPrimary>
        </div>
      </form>
    </main>
  );
}
