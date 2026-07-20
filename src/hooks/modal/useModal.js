'use client';

import { useContext } from 'react';

import { ModalContext } from '@/lib/providers/ModalProvider';

/**
 * useModal Hook
 *
 * 모달을 열고 닫는 함수에 접근할 수 있는 커스텀 훅입니다.
 * 아래 사용예제 참고해서 사용하세요.
 *
 * @example
 * function MyComponent() {
 *   const { openModal, closeModal } = useModal();
 *
 *   const handleClick = () => {
 *     openModal(
 *       <div>
 *         <h2>제목</h2>
 *         <p>내용</p>
 *         <button onClick={closeModal}>닫기</button>
 *       </div>
 *     );
 *   };
 *
 *   return <button onClick={handleClick}>모달 열기</button>;
 * }
 */
export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal은 ModalProvider 안에서 사용해야 합니다.');
  }

  return context;
}
