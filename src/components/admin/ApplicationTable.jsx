import formatDate from '@/utils/formatDate';

import ChipStatus from '@/components/ui/Chip/ChipStatus';

const FIELD_LABELS = {
  NEXTJS: 'Next.js',
  REACT: 'React',
  MODERNJS: 'Modern JS',
  TYPESCRIPT: 'TypeScript',
  API: 'API',
  WEB: 'Web',
  CAREER: 'Career',
};

const DOCUMENT_TYPE_LABELS = {
  OFFICIAL: '공식문서',
  BLOG: '블로그',
  BOOK: '도서',
  ETC: '기타',
};

// 어드민 챌린지 신청 목록을 표 형태로 보여주는 컴포넌트입니다.
export default function ApplicationTable({ applications = [] }) {
  return (
    <div
      role="region"
      aria-label="챌린지 신청 목록 표"
      tabIndex={0}
      className="w-full overflow-x-auto rounded-[8px]"
    >
      <table
        className={[
          'w-full table-fixed border-collapse',
          'min-w-[920px]',
          'tablet:min-w-full',
        ].join(' ')}
      >
        <colgroup>
          <col className="w-[7%]" />
          <col className="w-[9%]" />
          <col className="w-[9%]" />
          <col className="w-[36%]" />
          <col className="w-[9%]" />
          <col className="w-[10%]" />
          <col className="w-[10%]" />
          <col className="w-[10%]" />
        </colgroup>

        <thead>
          <tr className="h-[36px] bg-gray-800 text-white">
            <th className="rounded-l-[8px] px-[16px] text-left text-13-medium">
              No.
            </th>

            <th className="px-[16px] text-left text-13-medium">분야</th>

            <th className="px-[16px] text-left text-13-medium">카테고리</th>

            <th className="px-[16px] text-left text-13-medium">챌린지 제목</th>

            <th
              className={[
                'whitespace-nowrap text-center text-13-medium',
                'px-[8px]',
                'desktop:px-[16px]',
              ].join(' ')}
            >
              <span className="desktop:hidden">인원</span>

              <span className="hidden desktop:inline">모집 인원</span>
            </th>

            <th
              className={[
                'whitespace-nowrap text-center align-middle text-13-medium',
                'px-[8px]',
                'desktop:px-[16px]',
              ].join(' ')}
            >
              신청일
            </th>

            <th
              className={[
                'whitespace-nowrap text-center align-middle text-13-medium',
                'px-[8px]',
                'desktop:px-[16px]',
              ].join(' ')}
            >
              마감 기한
            </th>

            <th className="rounded-r-[8px] px-[16px] text-center text-13-medium">
              상태
            </th>
          </tr>
        </thead>

        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="h-[160px] text-center text-16-regular text-gray-500"
              >
                조건에 맞는 챌린지 신청이 없습니다.
              </td>
            </tr>
          ) : (
            applications.map((application) => (
              <tr
                key={application.id}
                className="h-[48px] border-b border-gray-300 bg-white"
              >
                <td className="box-border h-[48px] px-[16px] py-[15px] text-left align-middle text-13-regular text-gray-500">
                  {application.id}
                </td>

                <td className="box-border h-[48px] px-[16px] py-[15px] text-left align-middle text-13-regular text-gray-500">
                  {FIELD_LABELS[application.field] ?? application.field}
                </td>

                <td className="box-border h-[48px] px-[16px] py-[15px] text-left align-middle text-13-regular text-gray-500">
                  {DOCUMENT_TYPE_LABELS[application.docType] ??
                    application.docType}
                </td>

                <td className="box-border h-[48px] px-[16px] py-[15px] align-middle">
                  <p className="truncate text-13-medium text-gray-700">
                    {application.title}
                  </p>
                </td>

                <td className="box-border h-[48px] px-[16px] py-[15px] text-center align-middle text-13-regular text-gray-500">
                  {application.maxParticipants}
                </td>

                <td className="box-border h-[48px] px-[16px] py-[15px] text-center align-middle text-13-regular text-gray-500">
                  {formatDate(application.createdAt)}
                </td>

                <td className="box-border h-[48px] px-[16px] py-[15px] text-center align-middle text-13-regular text-gray-500">
                  {formatDate(application.deadline)}
                </td>

                <td className="box-border h-[48px] px-[16px] py-[12px] text-center align-middle">
                  <ChipStatus status={application.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
