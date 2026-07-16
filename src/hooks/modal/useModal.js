'use client';

import { useContext } from 'react';

import { ModalContext } from '@/lib/providers/ModalProvider';

// TODO: 예시 코드입니다.
export default function useModal() {
  return useContext(ModalContext);
}
