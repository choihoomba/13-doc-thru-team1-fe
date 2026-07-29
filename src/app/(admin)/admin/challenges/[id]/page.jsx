import AdminChallengeApplicationDetail from '@/components/admin/AdminChallengeApplicationDetail';

// URL Query에 들어 있는 ID 목록을 배열로 변환합니다.
function parseChallengeIds(ids) {
  if (typeof ids !== 'string') return [];

  return ids
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

// URL의 현재 ID와 목록 페이지에서 전달한 ID 배열을
// 상세 화면 컴포넌트에 전달합니다.
export default async function AdminChallengeApplicationPage({
  params,
  searchParams,
}) {
  const { id } = await params;
  const { ids } = await searchParams;

  return (
    <AdminChallengeApplicationDetail
      challengeId={id}
      challengeIds={parseChallengeIds(ids)}
    />
  );
}
