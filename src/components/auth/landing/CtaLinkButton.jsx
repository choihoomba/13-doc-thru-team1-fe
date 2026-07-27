'use client';

import Link from 'next/link';

import ButtonSecondary from '@/components/ui/Button/ButtonSecondary';

// - 서버 컴포넌트(LandingPage)에서 as={Link} 형태로 함수를 prop 전달 시 에러 발생
// - 버튼만 별도 클라이언트 컴포넌트로 분리해 LandingPage는 서버 컴포넌트로 유지
export default function CtaLinkButton({ className }) {
  return (
    <ButtonSecondary as={Link} href="/signin" className={className}>
      번역 시작하기
    </ButtonSecondary>
  );
}
