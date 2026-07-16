'use client';

import { createContext, useState } from 'react';

export const ModalContext = createContext(null);

// TODO: 예시 코드입니다. 작업 시 삭제하시면 됩니다 :)
// Context 기반 모달 열림/닫힘 상태 관리
export default function ModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);

  function openModal(modalContent) {
    setContent(modalContent);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setContent(null);
  }

  return (
    <ModalContext.Provider value={{ isOpen, content, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}
