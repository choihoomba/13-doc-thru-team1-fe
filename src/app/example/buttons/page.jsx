import ExLayout from '@/app/example/_components/ExLayout';

import { cn } from '@/utils/cn';

import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';

export default function ButtonsExPage() {
  return (
    <section className={cn('p-[50px]')}>
      <h1
        className={cn(
          'w-fit mb-[12px] py-[10px] px-[24px] text-24-bold bg-brand-black text-brand-yellow border-1 border-brand-black rounded-[12px]',
        )}
      >
        공통 컴포넌트 리스트
      </h1>

      <ExLayout
        flex="row"
        title="🥕 페이지 하단에서 '사용 예시'를 보실수 있습니다."
      >
        <ButtonPrimary size="xl" href="/example/buttons/buttonPrimary">
          ButtonPrimary 컴포넌트 보러 가기
        </ButtonPrimary>
        <ButtonPrimary size="xl" href="/example/buttons/buttonSecondary">
          ButtonSecondary 컴포넌트 보러 가기
        </ButtonPrimary>
      </ExLayout>
    </section>
  );
}
