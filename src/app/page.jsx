'use client';

import ModalConfirm from '@/components/ui/Modal/ModalConfirm';
import Popup from '@/components/ui/Modal/ModalNotice';
import ModalRejectReason from '@/components/ui/Modal/ModalRejectReason';

// import Toast from "@/app/components/common/Toast/Toast";
import { useModal } from '../hooks/modal/useModal';

// import { useToast } from '../Toast/ToastProvider';

/**
 * 임시 테스트용 플레이그라운드. Modal/Toast 컴포넌트들을 눈으로 확인하기 위한 버튼 모음.
 * 확인 끝나면 이 파일과 page.jsx에서의 사용처를 지우면 됨.
 */
export default function DevPlayground() {
  const { openModal, closeModal } = useModal();
  //   const { openToast, closeToast } = useToast();

  const handleModalConfirm = () => {
    openModal(
      <ModalConfirm
        message={'로그인이 필요한 기능이에요\n로그인 하시겠어요?'}
        confirmText="로그인하러 가기"
        onConfirm={closeModal}
      />,
    );
  };
  const handleModalConfirm2 = () => {
    openModal(
      <ModalConfirm
        message={'정말 삭제하시겠어요?'}
        cancelText="아니오"
        confirmText="네"
        onConfirm={closeModal}
      />,
    );
  };
  const handleModalConfirmNoIcon = () => {
    openModal(
      <ModalConfirm
        icon={null}
        message={'가입이 완료되었습니다!'}
        confirmText="확인"
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
  const handleModalPopup = () => {
    openModal(<Popup message={'가입이 완료되었습니다!'} />);
  };
  //   const handleToast = () => {
  //     openToast(<Toast onLoad={closeToast} />);
  //   };

  return (
    <div className="max-w-380 mx-auto my-10 rounded-2xl border border-gray-200 p-6">
      <h2 className="mb-4 text-18-bold text-gray-900">Modal / Toast 테스트</h2>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleModalConfirm}
          className="h-11 rounded-lg border border-gray-300 px-4 text-14-semibold hover:bg-gray-50"
        >
          ModalConfirm (단일 버튼)
        </button>
        <button
          type="button"
          onClick={handleModalConfirm2}
          className="h-11 rounded-lg border border-gray-300 px-4 text-14-semibold hover:bg-gray-50"
        >
          ModalConfirm (버튼 2개)
        </button>
        <button
          type="button"
          onClick={handleModalConfirmNoIcon}
          className="h-11 rounded-lg border border-gray-300 px-4 text-14-semibold hover:bg-gray-50"
        >
          ModalConfirm(체크아이콘 없음)
        </button>
        <button
          type="button"
          onClick={handleModalRejectReason}
          className="h-11 rounded-lg border border-gray-300 px-4 text-14-semibold hover:bg-gray-50"
        >
          ModalRejectReason
        </button>
        <button
          type="button"
          onClick={handleModalPopup}
          className="h-11 rounded-lg border border-gray-300 px-4 text-14-semibold hover:bg-gray-50"
        >
          Popup
        </button>
        {/* <button
          type="button"
          onClick={handleToast}
          className="h-11 rounded-lg border border-gray-300 px-4 text-14-semibold hover:bg-gray-50"
        >
          Toast
        </button> */}
      </div>
    </div>
  );
}
