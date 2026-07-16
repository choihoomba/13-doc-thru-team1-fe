'use client';

import { useEffect } from 'react';

import Image from 'next/image';

import Logo from '@/app/assets/images/img_logo.svg';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="h-[100vh] pt-[calc(50vh-250px)] min-h-full flex flex-col items-center font-pretendard">
        <Image
          src={Logo}
          alt="로고 이미지"
          width={320}
          height={72}
          sizes="(max-width: 744px) 196px, 396px"
          className="mx-auto w-[196px] h-[66px] md:w-[396px] md:h-[132px] mb-[24px] md:mb-[40px]"
        />
        <h2 className="mb-[24px] text-[20px] font-medium text-secondary-800">
          일시적인 오류가 발생했습니다.
        </h2>
        <button type="button" onClick={() => reset()}>
          다시 시도하기
        </button>
      </body>
    </html>
  );
}
