export function validateEmail(value) {
  if (!value) return '* 이메일은 필수 값입니다.';
  if (value.length > 254) return '* 이메일은 254자 이하여야 합니다.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return '* 올바른 이메일 형식이 아닙니다.';
  return null;
}

export function validatePassword(value) {
  if (!value) return '* 비밀번호는 필수 값입니다.';
  if (value.length < 8) return '* 비밀번호는 8자 이상이어야 합니다.';
  if (value.length > 64) return '* 비밀번호는 64자 이하여야 합니다.';
  return null;
}

export function validateNickname(value) {
  if (!value) return '* 닉네임은 필수 값입니다.';
  if (value.length < 2) return '* 닉네임은 2자 이상이어야 합니다.';
  if (value.length > 12) return '* 닉네임은 12자 이하여야 합니다.';
  const nicknameRegex = /^[a-zA-Z0-9가-힣]+$/;
  if (!nicknameRegex.test(value)) {
    return '* 닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.';
  }
  return null;
}

export function validatePasswordConfirm(password, passwordConfirm) {
  if (!passwordConfirm) return '* 비밀번호 확인을 입력해주세요.';
  if (password !== passwordConfirm) return '* 비밀번호가 일치하지 않습니다.';
  return null;
}
