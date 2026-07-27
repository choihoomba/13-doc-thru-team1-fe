'use client';

import { useActionState } from 'react';

import Image from 'next/image';

import IcGoogleLogo from '@/app/assets/icons/icon_google_logo.svg';
import ImgLogo from '@/app/assets/images/img_logo.svg';

import { signupAction } from '@/lib/actions/auth';

import { useSignupForm } from '@/hooks/auth/useSignupForm';

import { cn } from '@/utils/cn';

import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';
import ButtonText from '@/components/ui/Button/ButtonText';
import InputBase from '@/components/ui/Form/InputBase';

const initialState = { error: null };

export default function SignupForm() {
  const [state, formAction] = useActionState(signupAction, initialState);
  const { values, errors, handleChange } = useSignupForm();

  const hasFieldError =
    errors.email ||
    errors.nickname ||
    errors.password ||
    errors.passwordConfirm;

  return (
    <div className={cn('flex flex-col items-center')}>
      <Image
        src={ImgLogo}
        alt="Docthru"

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
          error={errors.email}
        />
        <InputBase
          name="nickname"
          label="닉네임"
          placeholder="닉네임을 입력해주세요"
          value={values.nickname}
          onChange={handleChange('nickname')}
          error={errors.nickname}
        />
        <InputBase
          name="password"
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          value={values.password}
          onChange={handleChange('password')}
          error={errors.password}
        />
        <InputBase
          name="passwordConfirm"
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 한번 더 입력해 주세요"
          value={values.passwordConfirm}
          onChange={handleChange('passwordConfirm')}
          error={errors.passwordConfirm}
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
          disabled={hasFieldError}
        >
          회원가입
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
          회원이신가요?
          <ButtonText href="/signin" text="로그인하기" />
        </p>
      </form>
    </div>
  );
}
