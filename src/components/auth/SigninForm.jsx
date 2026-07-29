'use client';

import { useActionState, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import IcGoogleLogo from '@/app/assets/icons/icon_google_logo.svg';
import ImgLogo from '@/app/assets/images/img_logo.svg';

import { signinAction } from '@/lib/actions/auth';

import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';
import ButtonText from '@/components/ui/Button/ButtonText';
import InputBase from '@/components/ui/Form/InputBase';
import ModalNotice from '@/components/ui/Modal/ModalNotice';

const initialState = { error: null };

export default function SigninForm() {
  const [state, formAction] = useActionState(signinAction, initialState);
  const [values, setValues] = useState({ email: '', password: '' });
  const { openModal } = useModal();

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  useEffect(() => {
    if (state.error) {
      openModal(<ModalNotice message={state.error} />);
    }
  }, [state, openModal]);

  return (
    <div className={cn('bg-gray-100 min-h-screen')}>
      <div
        className={cn(
          'flex flex-col items-center px-4 pt-[59.5px] pb-[288.5px]',
          'tablet:px-28.25 tablet:pt-30 tablet:pb-89.5',
          'desktop:w-129.5 desktop:mx-auto desktop:px-0 desktop:pt-30 desktop:pb-75.75',
        )}
      >
        <Link href="/" aria-label="랜딩페이지로 이동" className={cn('mb-10')}>
          <Image
            src={ImgLogo}
            alt="Docthru 로고"
            width={240}
            height={54}
            className={cn(
              'w-60 h-13.5 object-cover',
              'tablet:w-80 tablet:h-18',
            )}
            unoptimized
          />
        </Link>

        <form action={formAction} className={cn('flex w-full flex-col')}>
          <div className={cn('flex flex-col gap-6')}>
            <InputBase
              name="email"
              type="email"
              label="이메일"
              placeholder="이메일을 입력해주세요"
              value={values.email}
              onChange={handleChange('email')}
            />
            <InputBase
              name="password"
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요"
              value={values.password}
              onChange={handleChange('password')}
            />

            <ButtonPrimary
              type="submit"
              variant="primary"
              color="black"
              size="xxxl"
              width="100%"
              className={cn('mb-3', 'tablet:mb-4', 'desktop:mb-4.5')}
            >
              로그인
            </ButtonPrimary>
          </div>

          <ButtonPrimary
            variant="secondary"
            color="gray"
            size="xxxl"
            width="100%"
            className={cn('mb-6', 'tablet:mb-6')}
          >
            <Image
              className={cn('mr-2')}
              src={IcGoogleLogo}
              alt="Google 로고"
              unoptimized
            />
            Google로 시작하기
          </ButtonPrimary>

          <div className={cn('flex items-center justify-center gap-2')}>
            <p className={cn('text-16-regular text-gray-600')}>
              회원이 아니신가요?
            </p>
            <ButtonText href="/signup" text="회원가입하기" />
          </div>
        </form>
      </div>
    </div>
  );
}
