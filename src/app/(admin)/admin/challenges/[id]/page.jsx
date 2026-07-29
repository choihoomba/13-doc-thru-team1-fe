import AdminChallengeApplicationDetail from '@/components/admin/AdminChallengeApplicationDetail';

// URL의 [id] 값을 상세 화면 컴포넌트에 전달합니다.
export default async function AdminChallengeApplicationPage({ params }) {
  const { id } = await params;

  return <AdminChallengeApplicationDetail challengeId={id} />;
}
