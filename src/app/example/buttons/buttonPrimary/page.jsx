'use client';

import Image from 'next/image';

import IcGoogleLogo from '@/app/assets/icons/icon_google_logo.svg';

import ExContainer from '@/app/example/_components/ExContainer';
import ExLayout from '@/app/example/_components/ExLayout';
import HighlightedText from '@/app/example/_components/HighlightedText';

import { cn } from '@/utils/cn';

import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';

export default function ButtonPrimaryExPage() {
  return (
    <section className={cn('p-[50px]')}>
      <h1
        className={cn(
          'w-fit mb-[12px] py-[10px] px-[24px] text-24-bold bg-brand-black text-brand-yellow border-1 border-brand-black rounded-[12px]',
        )}
      >
        공통 Button 컴포넌트
      </h1>
      <h2 className={cn('mb-[24px] text-18-medium')}>
        - <HighlightedText text={`primary`} /> : 배경 O, border 없음
        <br />
        - <HighlightedText text={`secondary`} /> : 배경 X, border 1px
        <br />
        - <HighlightedText text={`tertiary`} /> : 배경 O, border 2px (yellow
        전용)
        <br />
        - <HighlightedText text={`size`} /> : sm, md, lg, xl, xxl, xxxl
        <br />
        - <HighlightedText text={`color`} /> : black, gray, yellow
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
          - ✅ <HighlightedText text={`ButtonPrimary`} />는 pc, tablet, mobile
          모든 디바이스에서 동일한 크기이며, 부모 요소에 따라 width 값이
          결정됩니다. 반응형 버튼은 <HighlightedText text={`ButtonSecondary`} />
          를 사용해 주세요.
        </span>
      </h2>

      <ExLayout flex="row" title="ButtonPrimary 컴포넌트">
        {/* Primary Size 별 */}
        <ExContainer
          flex="row"
          description={`🥕 기본(brand) 컬러 - variant="primary", color="black" 기본값, size="sm, md, lg, xl, xxl, xxxl"`}
        >
          <ButtonPrimary size="sm">수정 완료</ButtonPrimary>
          <ButtonPrimary size="md">원문 보기</ButtonPrimary>
          <ButtonPrimary size="lg">네</ButtonPrimary>
          <ButtonPrimary size="xl">신청하기</ButtonPrimary>
          <ButtonPrimary size="xxl">전송</ButtonPrimary>
          <ButtonPrimary size="xxxl">Google로 시작하기</ButtonPrimary>
        </ExContainer>

        {/* Secondary size 별 */}
        <ExContainer
          flex="row"
          description={`🥕 기본(brand) 컬러 - variant="secondary", color="black" 기본값, size="sm, md, lg, xl, xxl, xxxl"`}
        >
          <ButtonPrimary variant="secondary" size="sm">
            임시저장
          </ButtonPrimary>
          <ButtonPrimary variant="secondary" size="md">
            아니오
          </ButtonPrimary>
          <ButtonPrimary variant="secondary" size="lg">
            수정 완료
          </ButtonPrimary>
          <ButtonPrimary variant="secondary" size="xl">
            수정 완료
          </ButtonPrimary>
          <ButtonPrimary variant="secondary" size="xxl">
            수정 완료
          </ButtonPrimary>
          <ButtonPrimary variant="secondary" size="xxxl">
            수정 완료
          </ButtonPrimary>
        </ExContainer>

        {/* Gray Color (OAuth) */}
        <ExContainer
          description={`🥕 gray 컬러 (OAuth 버튼만 사용) - variant="secondary", color="gray" 지정, size="xxxl"`}
        >
          <ButtonPrimary variant="secondary" color="gray" size="xxxl">
            <Image
              className={cn('mr-[8px]')}
              src={IcGoogleLogo}
              alt=""
              width={28}
              height={28}
            />
            Google로 시작하기
          </ButtonPrimary>
        </ExContainer>

        {/* Tertiary (원문 보기 버튼) */}
        <ExContainer description={`🥕 tertiary - , size="md"`}>
          <ButtonPrimary variant="tertiary" color="yellow" size="md">
            원문 보기
          </ButtonPrimary>
        </ExContainer>

        {/* button + disabled 상태 */}
        <ExContainer
          description={`🥕 disabled - 클릭 불가 + disabled 스타일 적용`}
        >
          <ButtonPrimary size="xl" disabled={true}>
            신청하기
          </ButtonPrimary>
        </ExContainer>

        {/* <Link> 버튼 */}
        <ExContainer
          description={`🥕 href만 넘기면 자동으로 Next.js <Link>로 렌더링`}
        >
          <ButtonPrimary href="/">수정하러 가기</ButtonPrimary>
        </ExContainer>

        {/* width : 고정된 width 값 사용 */}
        <ExContainer description={`🥕 width - px 문자열 그대로 style에 적용`}>
          <ButtonPrimary width="252px">스터디 만들기</ButtonPrimary>
        </ExContainer>

        {/* <Link> + disabled */}
        <ExContainer
          description={`🥕 링크인데 비활성화 - 클릭해도 이동 안 되고 스타일도 disabled 상태로 표시`}
        >
          <ButtonPrimary href="/example" disabled={true}>
            수정하러 가기
          </ButtonPrimary>
        </ExContainer>

        {/* ✅ 사용 예시 ✅ */}
        <ExContainer description={`✅ 사용 예시 ✅`}>
          <div className={cn('flex gap-[12px]')}>
            <ButtonPrimary size="sm">불러오기</ButtonPrimary>
            <ButtonPrimary size="sm">수정완료</ButtonPrimary>
          </div>
          <div className={cn('flex gap-[12px]')}>
            <ButtonPrimary
              className="flex-1"
              variant="tertiary"
              color="yellow"
              size="md"
            >
              원문 보기
            </ButtonPrimary>
            <ButtonPrimary className="flex-1" size="md">
              작업 도전하기
            </ButtonPrimary>
          </div>
          <div className={cn('flex gap-[12px]')}>
            <ButtonPrimary variant="secondary" size="lg">
              아니오
            </ButtonPrimary>
            <ButtonPrimary size="lg">네</ButtonPrimary>
          </div>
          <ButtonPrimary size="xl">신청하기</ButtonPrimary>
          <ButtonPrimary
            size="xxl"
            onClick={() => {
              alert('전송완료!');
            }}
          >
            전송
          </ButtonPrimary>
          <ButtonPrimary variant="secondary" color="gray" size="xxxl">
            <Image
              className={cn('mr-[8px]')}
              src={IcGoogleLogo}
              alt=""
              width={28}
              height={28}
            />
            Google로 시작하기
          </ButtonPrimary>
        </ExContainer>
      </ExLayout>
    </section>
  );
}
