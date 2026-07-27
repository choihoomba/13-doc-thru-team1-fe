import ExContainer from '@/app/example/_components/ExContainer';
import ExLayout from '@/app/example/_components/ExLayout';

import ChipCategory from '@/components/ui/Chip/ChipCategory';
import ChipField from '@/components/ui/Chip/ChipField';
import ChipStatus from '@/components/ui/Chip/ChipStatus';

export default function ChipsExPage() {
  return (
    <main className="min-h-screen bg-white p-[16px] tablet:p-[40px]">
      <h1 className="mb-[24px] text-24-bold text-gray-800">
        공통 Chip 컴포넌트
      </h1>

      <ExLayout title="ChipCategory">
        <ExContainer
          flex="row"
          description="문서 카테고리를 표시하는 Chip입니다."
        >
          <ChipCategory variant="OFFICIAL" />
          <ChipCategory variant="BLOG" />
          <ChipCategory />
        </ExContainer>
      </ExLayout>

      <ExLayout title="ChipField">
        <ExContainer
          flex="row"
          description="variant에 따라 분야와 배경색이 변경됩니다."
        >
          <ChipField variant="NEXTJS" />
          <ChipField variant="REACT" />
          <ChipField variant="MODERNJS" />
          <ChipField variant="TYPESCRIPT" />
          <ChipField variant="API" />
          <ChipField variant="WEB" />
          <ChipField variant="CAREER" />
        </ExContainer>
      </ExLayout>

      <ExLayout title="ChipStatus">
        <ExContainer
          flex="row"
          description="status에 따라 신청 상태와 배경색이 변경됩니다."
        >
          <ChipStatus status="PENDING" />
          <ChipStatus status="REJECTED" />
          <ChipStatus status="APPROVED" />
          <ChipStatus status="DELETED" />
        </ExContainer>
      </ExLayout>
    </main>
  );
}
