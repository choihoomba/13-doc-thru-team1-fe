'use client';

import SubmissionDetail from '@/components/submissions/SubmissionDetail';

// TODO: Submission 조회 API(GET /submissions/:id) 연동 시 제거
// challenge의 field/docType/status/deadline은 현재 응답에 없어 추가 요청한 상태
const mockSubmission = {
  id: 1,
  content: `일반적으로 개발자는 일련의 하드 스킬을 가지고 있어야 커리어에서 경력과 전문성을 쌓을 수 있습니다. 하지만 이에 못지 않게 개인 브랜드 구축도 만족스럽고 성취감 있는 경력을 쌓기 위해 중요하며 이를 쌓기는 더 어려울 수 있습니다.

이렇게 개인 브랜드는 경력을 결정짓는 수많은 중요한 방법으로 여러분을 도울 수 있습니다. 하지만 본인의 실력을 뽐내는 데 익숙치 않거나 마케팅 개념에 한 번도 접해보지 않은 사람은 브랜드 구축을 부담스럽거나 어렵게 느낄 수 있습니다.`,
  createdAt: '2026-02-28T10:00:00Z',
  isLiked: false,
  user: { id: 2, nickname: '햄프트로' },
  challenge: {
    title: '개발자로써 자신만의 브랜드를 구축하는 방법(dailydev)',
    field: 'Career',
    docType: '블로그',
    status: 'APPROVED',
    deadline: '2026-08-25T00:00:00Z',
  },
  _count: { likes: 1934, feedbacks: 50 },
};

// TODO: 로그인 사용자 정보는 AuthProvider에서 가져온다
const mockCurrentUser = { id: 2, role: 'USER' };

export default function SubmissionDetailPage() {
  return (
    <SubmissionDetail
      submission={mockSubmission}
      currentUser={mockCurrentUser}
      onToggleLike={(liked) => console.log('하트:', liked)}
      onEdit={(s) => console.log('작업물 수정:', s)}
      onDelete={(s) => console.log('작업물 삭제:', s)}
    />
  );
}
