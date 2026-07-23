import LoadingDisplay from '@/components/ui/LoadingDisplay';

export default function LoadingDisplayExPage() {
  return (
    <section className="p-[50px]">
      <p className="mb-[24px] text-22-semibold">
        기본 로딩 스피너 스타일 - size: 60, min-height: 350px, 중앙 정렬
      </p>
      <LoadingDisplay />

      <p className="mb-[24px] text-22-semibold">
        size : 40px, 인라인 요소에 적용
      </p>
      <LoadingDisplay size="40" fullHeight={false} />
    </section>
  );
}
