'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);
  /**
   * isLoading : 로그인 여부 확인이 끝났는지 여부
   * user === null이 "비로그인"인지 "아직 확인 중"인지 구분하기 위한 값으로,
   * 확인 전 리다이렉트/깜빡임을 막는 용도로 user와 함께 사용
   */
  const [isLoading, setIsLoading] = useState(true);

  const getUser = async () => {
    setUser(null);
    setIsLoading(false);
  };

  const signup = async () => {};

  const signin = async () => {};

  const signout = async () => {};

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signup,
        signin,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
