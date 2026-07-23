'use client';

import { useEffect } from 'react';

import localFont from 'next/font/local';
import Image from 'next/image';

import Logo from '@/app/assets/images/img_logo.svg';

import './globals.css';

const pretendard = localFont({
  src: './assets/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard-variable',
  weight: '45 920',
  display: 'swap',
});

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="h-[100vh] pt-[calc(50vh-250px)] min-h-full flex flex-col items-center font-pretendard">
        <Image
          src={Logo}
          alt="로고 이미지"
          width={300}
          height={100}
          sizes="(max-width: 1024px) 190px, 300px"
          className="mx-auto w-[190px] h-[64px] desktop:w-[300px] desktop:h-[100px]"
        />
        <h2 className="mb-[24px] text-20-medium text-gray-800">
          일시적인 오류가 발생했습니다.
        </h2>
        {/* TODO: 버튼 컴포넌트로 수정하기 */}
        <button type="button" onClick={() => reset()}>
          다시 시도하기
        </button>
      </body>
    </html>
  );
}
