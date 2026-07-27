'use client';

import { useActionState } from 'react';
import { useState } from 'react';

import Image from 'next/image';

import IcGoogleLogo from '@/app/assets/icons/icon_google_logo.svg';
import ImgLogo from '@/app/assets/images/img_logo.svg';

import { signinAction } from '@/lib/actions/auth';

import { cn } from '@/utils/cn';

import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';
import ButtonText from '@/components/ui/Button/ButtonText';
import InputBase from '@/components/ui/Form/InputBase';

const initialState = { error: null };

export default function SigninForm() {
  const [state, formAction] = useActionState(signinAction, initialState);
  const [values, setValues] = useState({ email: '', password: '' });

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className={cn('flex flex-col items-center')}>
      <Image
        src={ImgLogo}
        alt="Docthru"
        width={186}
        height={42}
        className={cn('mb-8')}
      />

      <form action={formAction} className={cn('flex w-full flex-col gap-6')}>
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

        {state.error && (
          <p className={cn('text-14-regular text-red-error')}>{state.error}</p>
        )}

        <ButtonPrimary
          type="submit"
          variant="primary"
          color="black"
          size="xxxl"
          width="100%"
        >
          로그인
        </ButtonPrimary>

        <ButtonPrimary
          variant="secondary"
          color="gray"
          size="xxxl"
          width="100%"
        >
          <Image
            className={cn('mr-2')}
            src={IcGoogleLogo}
            alt=""
            width={28}
            height={28}
            unoptimized
          />
          Google로 시작하기
        </ButtonPrimary>

        <p className={cn('flex justify-center gap-1 text-14-regular')}>
          회원이 아니신가요?
          <ButtonText href="/signup" text="회원가입하기" />
        </p>
      </form>
    </div>
  );
}
