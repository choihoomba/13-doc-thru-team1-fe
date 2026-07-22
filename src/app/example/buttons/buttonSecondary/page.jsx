'use client';

import ExContainer from '@/app/example/_components/ExContainer';
import ExLayout from '@/app/example/_components/ExLayout';
import HighlightedText from '@/app/example/_components/HighlightedText';

import { cn } from '@/utils/cn';

import ButtonSecondary from '@/components/ui/Button/ButtonSecondary';

export default function ButtonSecondaryExPage() {
  return (
    <section className={cn('p-[50px]')}>
      <h1
        className={cn(
          'w-fit mb-[12px] py-[10px] px-[24px] text-24-bold bg-brand-black text-brand-yellow border-1 border-brand-black rounded-[12px]',
        )}
      >
        공통 ButtonSecondary 컴포넌트
      </h1>
      <h2 className={cn('mb-[24px] text-18-medium')}>
        - <HighlightedText text={`primary`} /> : 배경 O, border 없음
        <br />
        - <HighlightedText text={`secondary`} /> : 배경 X, border 1px
        <br />
        - <HighlightedText text={`size`} /> : sm, md
        <br />
        - <HighlightedText text={`color`} /> : black, red
        <br />
        <br />
        - 모든 버튼의 <HighlightedText text={`width`} />
        값은 <HighlightedText text={`auto`} />로 되어있습니다.
        <br />
        - 고정된 <HighlightedText text={`width`} /> 값이 필요할 때,{' '}
        <HighlightedText text={`props`} />
        로 <HighlightedText text={`width='120px'`} />
        으로 지정하시면 됩니다.
        <br />
        - 숫자
        <HighlightedText text={`(width={120})`} />로 넘겨도 자동으로{' '}
        <HighlightedText text={`px`} />
        가 붙습니다.
        <br />- 여러 개 버튼의 정렬이 필요하실 때에는 버튼을 감싼 요소에서{' '}
        <HighlightedText text={`flex`} />를 사용해 주세요.
        <br />
        <span className="text-red-error">
          - ✅ <HighlightedText text={`ButtonSecondary`} />는{' '}
          <HighlightedText text={`tablet`} /> 브레이크포인트를 기준으로 스타일이
          반응형으로 바뀝니다. (mobile: 작은 사이즈 → pc, tablet: 큰 사이즈)
          모든 디바이스에서 동일한 크기가 필요하면{' '}
          <HighlightedText text={`ButtonPrimary`} />를 사용해 주세요.
        </span>
      </h2>

      <ExLayout flex="row" title="ButtonSecondary 컴포넌트">
        {/* Primary size 별 */}
        <ExContainer
          flex="row"
          description={`🥕 기본(brand) 컬러 - variant="primary", color="black" 기본값, size="sm, md"`}
        >
          <ButtonSecondary size="sm">승인하기</ButtonSecondary>
          <ButtonSecondary size="md">번역 시작하기</ButtonSecondary>
        </ExContainer>

        {/* Secondary size 별 */}
        <ExContainer
          flex="row"
          description={`🥕 기본(brand) 컬러 - variant="secondary", color="black" 기본값, size="sm, md"`}
        >
          <ButtonSecondary variant="secondary" size="sm">
            임시저장
          </ButtonSecondary>
          <ButtonSecondary variant="secondary" size="md">
            거절하기
          </ButtonSecondary>
        </ExContainer>

        {/* Red Color */}
        <ExContainer
          flex="row"
          description={`🥕 red 컬러 - variant="primary", color="red" 지정, size="md"`}
        >
          <ButtonSecondary color="red" size="md">
            삭제하기
          </ButtonSecondary>
        </ExContainer>

        {/* button + disabled 상태 */}
        <ExContainer
          description={`🥕 disabled - 클릭 불가 + disabled 스타일 적용`}
        >
          <ButtonSecondary size="md" disabled={true}>
            승인하기
          </ButtonSecondary>
        </ExContainer>

        {/* <Link> 버튼 */}
        <ExContainer
          description={`🥕 href만 넘기면 자동으로 Next.js <Link>로 렌더링`}
        >
          <ButtonSecondary href="/">수정하러 가기</ButtonSecondary>
        </ExContainer>

        {/* width : 고정된 width 값 사용 */}
        <ExContainer description={`🥕 width - px 문자열 그대로 style에 적용`}>
          <ButtonSecondary width="252px">스터디 만들기</ButtonSecondary>
        </ExContainer>

        {/* <Link> + disabled */}
        <ExContainer
          description={`🥕 링크인데 비활성화 - 클릭해도 이동 안 되고 스타일도 disabled 상태로 표시`}
        >
          <ButtonSecondary href="/example" disabled={true}>
            수정하러 가기
          </ButtonSecondary>
        </ExContainer>

        {/* ✅ 사용 예시 ✅ */}
        <ExContainer description={`✅ 사용 예시 ✅`}>
          <div className={cn('flex justify-center')}>
            <ButtonSecondary
              size="md"
              className={cn('w-[120px] tablet:w-[153px]')}
            >
              번역 시작하기
            </ButtonSecondary>
          </div>
          <div className={cn('flex gap-[12px]')}>
            <ButtonSecondary variant="secondary" size="sm">
              임시저장
            </ButtonSecondary>
            <ButtonSecondary size="sm">제출하기</ButtonSecondary>
          </div>
          <div className={cn('flex gap-[12px]')}>
            <ButtonSecondary
              className="flex-1 tablet:flex-none tablet:w-[153px]"
              color="red"
              size="md"
            >
              거절하기
            </ButtonSecondary>
            <ButtonSecondary
              className="flex-1 tablet:flex-none tablet:w-[153px]"
              size="md"
              onClick={() => {
                alert('승인이 완료되었습니다.');
              }}
            >
              승인하기
            </ButtonSecondary>
          </div>
        </ExContainer>
      </ExLayout>
    </section>
  );
}
