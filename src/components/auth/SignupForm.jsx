'use client';

import { useActionState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import IcGoogleLogo from '@/app/assets/icons/icon_google_logo.svg';
import ImgLogo from '@/app/assets/images/img_logo.svg';

import { signupAction } from '@/lib/actions/auth';
import {
  validateEmail,
  validateNickname,
  validatePassword,
  validatePasswordConfirm,
} from '@/lib/validations/signupValidation';

import { useSignupForm } from '@/hooks/auth/useSignupForm';
import { useModal } from '@/hooks/modal/useModal';

import { cn } from '@/utils/cn';

import ButtonPrimary from '@/components/ui/Button/ButtonPrimary';
import ButtonText from '@/components/ui/Button/ButtonText';
import InputBase from '@/components/ui/Form/InputBase';
import ModalNotice from '@/components/ui/Modal/ModalNotice';

const initialState = { error: null, success: false };

// 모달이 어떤 방식으로 닫히든(확인 버튼, 바깥 클릭, ESC) 언마운트 시
// onClose가 실행되어 페이지 이동이 보장됨
function SignupSuccessModal({ onClose }) {
  useEffect(() => {
    return () => {
      onClose();
    };
  }, [onClose]);

  return <ModalNotice message="가입이 완료되었습니다!" />;
}

export default function SignupForm() {
  const [state, formAction] = useActionState(signupAction, initialState);
  const { values, errors, handleChange, touchAll } = useSignupForm();
  const { openModal } = useModal();
  const router = useRouter();

  const hasFieldError =
    errors.email ||
    errors.nickname ||
    errors.password ||
    errors.passwordConfirm;

  useEffect(() => {
    if (state.error) {
      openModal(<ModalNotice message={state.error} />);
    }
  }, [state, openModal]);

  useEffect(() => {
    if (state.success) {
      openModal(<SignupSuccessModal onClose={() => router.push('/signin')} />);
    }
  }, [state, openModal, router]);

  function handleSubmit(e) {
    touchAll();

    const hasError =
      validateEmail(values.email) ||
      validateNickname(values.nickname) ||
      validatePassword(values.password) ||
      validatePasswordConfirm(values.password, values.passwordConfirm);

    if (hasError) {
      e.preventDefault();
    }
  }

  return (
    <div className={cn('bg-gray-100 min-h-screen')}>
      <div
        className={cn(
          'flex flex-col items-center px-4 pt-[59.5px] pb-[103.5px]',
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

        <form
          action={formAction}
          onSubmit={handleSubmit}
          className={cn('flex w-full flex-col')}
        >
          <div className={cn('flex flex-col gap-6')}>
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

            <ButtonPrimary
              type="submit"
              variant="primary"
              color="black"
              size="xxxl"
              width="100%"
              disabled={hasFieldError}
              className={cn('mb-3', 'tablet:mb-4', 'desktop:mb-4.5')}
            >
              회원가입
            </ButtonPrimary>
          </div>

          <ButtonPrimary
            variant="secondary"
            color="gray"
            size="xxxl"
            width="100%"
            className={cn('mb-10', 'tablet:mb-6')}
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
            <p className={cn('text-16-regular text-gray-600')}>회원이신가요?</p>
            <ButtonText href="/signin" text="로그인하기" />
          </div>
        </form>
      </div>
    </div>
  );
}
