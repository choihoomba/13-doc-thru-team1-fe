/**
 * Header 알림의 로딩·오류·빈 목록 상태는 같은 레이아웃을 사용하고 문구만 달라집니다.
 */
export default function NotificationState({ text }) {
  return (
    <div className="flex flex-1 items-center justify-center px-[24px] text-center text-14-regular text-gray-500">
      {text}
    </div>
  );
}
