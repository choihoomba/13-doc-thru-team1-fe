import { useState } from 'react';

import {
  validateEmail,
  validateNickname,
  validatePassword,
  validatePasswordConfirm,
} from '@/lib/validations/signupValidation';

export function useSignupForm() {
  const [values, setValues] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    nickname: false,
    password: false,
    passwordConfirm: false,
  });

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // 제출 시 모든 필드를 touched 처리
  const touchAll = () => {
    setTouched({
      email: true,
      nickname: true,
      password: true,
      passwordConfirm: true,
    });
  };

  const errors = {
    email: touched.email ? validateEmail(values.email) : null,
    nickname: touched.nickname ? validateNickname(values.nickname) : null,
    password: touched.password ? validatePassword(values.password) : null,
    passwordConfirm: touched.passwordConfirm
      ? validatePasswordConfirm(values.password, values.passwordConfirm)
      : null,
  };

  return { values, errors, handleChange, touchAll };
}
