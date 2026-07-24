'use client';

import ModalConfirm from '@/components/ui/Modal/ModalConfirm';
import ModalNotice from '@/components/ui/Modal/ModalNotice';
import ModalRejectReason from '@/components/ui/Modal/ModalRejectReason';

import { useModal } from '../../../hooks/modal/useModal';

/**
 * TODO: 확인 끝나면 지우기
 */
export default function DevPlayground() {
  const { openModal, closeModal } = useModal();

  const handleModalConfirm = () => {
    openModal(
      <ModalConfirm
        message={'로그인이 필요한 기능이에요\n로그인 하시겠어요?'}
        confirmButtonText="로그인하러 가기"
        onConfirm={closeModal}
      />,
    );
  };
  const handleModalConfirm2 = () => {
    openModal(
      <ModalConfirm
        message={'정말 삭제하시겠어요?'}
        cancelText="아니오"
        confirmButtonText="네"
        onConfirm={closeModal}
      />,
    );
  };
  const handleModalNotice = () => {
    openModal(
      <ModalNotice
        icon={null}
        message={'가입이 완료되었습니다!'}
        confirmButtonText="확인"
        onConfirm={closeModal}
      />,
    );
  };
  const handleModalRejectReason = () => {
    openModal(
      <ModalRejectReason
        onSubmit={(reason) => console.log('거절 사유:', reason)}
      />,
    );
  };

  return (
    <div className="max-w-380 mx-auto my-10 rounded-2xl border border-gray-200 p-6">
      <h2 className="mb-4 text-18-bold text-gray-900">Modal / Toast 테스트</h2>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleModalConfirm}
          className="h-11 rounded-lg border border-gray-300 px-4 text-14-semibold hover:bg-gray-50"
        >
          ModalConfirm (체크 아이콘 있는 단일 버튼)
        </button>
        <button
          type="button"
          onClick={handleModalConfirm2}
          className="h-11 rounded-lg border border-gray-300 px-4 text-14-semibold hover:bg-gray-50"
        >
          ModalConfirm (체크 아이콘 있는 버튼 2개)
        </button>
        <button
          type="button"
          onClick={handleModalNotice}
          className="h-11 rounded-lg border border-gray-300 px-4 text-14-semibold hover:bg-gray-50"
        >
          ModalNotice(체크아이콘 없는 단일 버튼)
        </button>
        <button
          type="button"
          onClick={handleModalRejectReason}
          className="h-11 rounded-lg border border-gray-300 px-4 text-14-semibold hover:bg-gray-50"
        >
          ModalRejectReason
        </button>
      </div>
    </div>
  );
}
