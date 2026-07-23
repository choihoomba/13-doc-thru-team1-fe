import ExContainer from '@/app/example/_components/ExContainer';
import ExLayout from '@/app/example/_components/ExLayout';

import { cn } from '@/utils/cn';

import ButtonChallenge from '@/components/ui/Button/ButtonChallenge';
import ButtonChallengeApply from '@/components/ui/Button/ButtonChallengeApply';
import ButtonCircle from '@/components/ui/Button/ButtonCircle';
import ButtonExternalLink from '@/components/ui/Button/ButtonExternalLink';
import ButtonLoadMore from '@/components/ui/Button/ButtonLoadMore';
import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';
import ButtonQuit from '@/components/ui/Button/ButtonQuit';
import ButtonText from '@/components/ui/Button/ButtonText';

export default function ButtonsExPage() {
  return (
    <section className={cn('p-[50px]')}>
      <h1
        className={cn(
          'w-fit mb-[12px] py-[10px] px-[24px] text-24-bold bg-brand-black text-brand-yellow border-1 border-brand-black rounded-[12px]',
        )}
      >
        공통 Button 컴포넌트 리스트
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

      <ExLayout
        flex="row"
        title="🥕 사용 예시 - ButtonQuit, ButtonLoadMore, ButtonChallenge, ButtonChallengeApply, ButtonCircle, ButtonExternalLink, ButtonText 컴포넌트"
      >
        <ExContainer flex="row" description={`🥕 포기 버튼`}>
          <ButtonQuit />
          <ButtonQuit disabled={true} />
        </ExContainer>

        <ExContainer flex="row" description={`🥕 더보기 버튼`}>
          <ButtonLoadMore />
        </ExContainer>

        <ExContainer
          flex="row"
          description={`🥕 도전 계속하기 / 내 작업물 보기 버튼`}
        >
          <ButtonChallenge href="/" />
          <ButtonChallenge variant="submission" href="/" />
        </ExContainer>

        <ExContainer flex="row" description={`🥕 신규 챌린지 신청 버튼`}>
          <ButtonChallengeApply href="/" />
        </ExContainer>

        <ExContainer flex="row" description={`🥕 원형 버튼`}>
          <ButtonCircle />
          <ButtonCircle disabled={true} />
          <ButtonCircle variant="secondary" />
        </ExContainer>

        <ExContainer flex="row" description={`🥕 링크 열기 버튼`}>
          <ButtonExternalLink href="/" />
        </ExContainer>

        <ExContainer flex="row" description={`🥕 텍스트 링크 버튼`}>
          <ButtonText text="로그인하기" href="/" />
        </ExContainer>
      </ExLayout>
    </section>
  );
}
