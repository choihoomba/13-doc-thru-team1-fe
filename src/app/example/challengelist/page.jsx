'use client';

import { useCallback, useMemo, useState } from 'react';

import Image from 'next/image';

import icon_challenge_page_next from '@/app/assets/icons/icon_challenge_page_next.png';
import icon_challenge_page_prev from '@/app/assets/icons/icon_challenge_page_prev.png';

import { cn } from '@/utils/cn';

import ChallengeEmptyState from '@/components/challenges/ChallengeEmptyState';
import ButtonChallengeApply from '@/components/ui/Button/ButtonChallengeApply';
import Card from '@/components/ui/Card';
import Filter from '@/components/ui/FilterBar/Filter';
import SearchBar from '@/components/ui/FilterBar/SearchBar';
import Header from '@/components/ui/Header/Header';

// 한 페이지에 보여줄 챌린지 카드 개수 (Figma 기준 4개)
const ITEMS_PER_PAGE = 4;

// 페이지네이션에 한 번에 보여줄 페이지 번호 개수
// 예: 이전 / 1 / 2 / 3 / 4 / 5 / 다음
const MAX_VISIBLE_PAGES = 5;

// Filter 컴포넌트의 초기 선택값
// categories는 여러 개 고를 수 있어서 배열, docType/status는 하나만 골라서 문자열 또는 null
const INITIAL_FILTERS = {
  categories: [],
  docType: null,
  status: null,
};

// Header 컴포넌트를 로그인 상태로 테스트해보기 위한 임시 유저 데이터
// 나중에 실제 로그인 기능이 붙으면 이 값 대신 진짜 로그인 정보를 사용하면 됨
const HEADER_TEST_USER = {
  id: 1,
  email: 'member@example.com',
  nickname: '테스트 사용자',
  role: 'USER',
  grade: 'GENERAL',
};

// API 연결 전에 화면을 확인하기 위한 가짜(mock) 챌린지 데이터
// deadline: 'YYYY-MM-DD' 형식
// field / docType: 백엔드에서 쓰는 이름 그대로 맞춰둠
// status가 없으면 "모집 중", APPROVED면 "모집 완료", CLOSED면 "마감"
const BASE_CHALLENGES = [
  {
    id: 1,
    title: '개발자로써 자신만의 브랜드를 구축하는 방법(dailydev)',
    field: 'CAREER',
    docType: 'BLOG',
    deadline: '2024-02-28',
    currentParticipants: 2,
    maxParticipants: 5,
  },
  {
    id: 2,
    title: 'Web 개발자의 필수 요건',
    field: 'MODERNJS',
    docType: 'OFFICIAL',
    deadline: '2024-02-28',
    currentParticipants: 2,
    maxParticipants: 5,
  },
  {
    id: 3,
    title: 'Next.js - App Router: Routing Fundamentals',
    field: 'NEXTJS',
    docType: 'OFFICIAL',
    deadline: '2024-03-03',
    currentParticipants: 5,
    maxParticipants: 5,
    status: 'APPROVED', // 모집 완료
  },
  {
    id: 4,
    title: 'Fetch API, 너는 에러를 제대로 핸들링 하고 있는가?(dailydev)',
    field: 'API',
    docType: 'OFFICIAL',
    deadline: '2024-02-28',
    currentParticipants: 5,
    maxParticipants: 5,
    status: 'CLOSED', // 마감
  },
];

// 페이지네이션 테스트를 위해 BASE_CHALLENGES 4개를 5페이지 분량(20개)으로 복사
// API 연결 후에는 이 부분을 통째로 지우고 서버 데이터로 교체하면 됨
const MOCK_CHALLENGES = Array.from(
  { length: ITEMS_PER_PAGE * 5 },
  (_, index) => ({
    ...BASE_CHALLENGES[index % BASE_CHALLENGES.length],
    id: index + 1, // key가 겹치지 않도록 고유 id로 덮어쓰기
  }),
);

// 현재 페이지 번호를 기준으로, 화면에 보여줄 페이지 번호들을 계산하는 함수
// 예: 1페이지 → [1, 2, 3, 4, 5] / 6페이지 → [4, 5, 6, 7, 8]
function getVisiblePages(currentPage, totalPages) {
  const visiblePageCount = Math.min(MAX_VISIBLE_PAGES, totalPages);

  // 현재 페이지가 최대한 가운데 오도록 시작 페이지 계산
  let startPage = currentPage - Math.floor(visiblePageCount / 2);
  startPage = Math.max(1, startPage); // 1보다 작아지지 않게

  // 마지막 페이지를 넘어가지 않도록 보정
  const lastPossibleStartPage = totalPages - visiblePageCount + 1;
  startPage = Math.min(startPage, lastPossibleStartPage);

  return Array.from(
    { length: visiblePageCount },
    (_, index) => startPage + index,
  );
}
// 이전/다음 화살표 버튼 (아이콘, 방향, 비활성화 여부만 다르고 구조는 동일해서 하나로 합침)
function PageArrowButton({ direction, disabled, onClick }) {
  const isPrev = direction === 'prev';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={isPrev ? '이전 페이지' : '다음 페이지'}
      className={cn(
        'flex size-[24px] items-center justify-center',
        'disabled:cursor-default disabled:opacity-30',
      )}
    >
      <Image
        src={isPrev ? icon_challenge_page_prev : icon_challenge_page_next}
        alt=""
        width={24}
        height={24}
        unoptimized
      />
    </button>
  );
}

// 이 페이지에서만 쓰는 페이지네이션 컴포넌트 (공용 컴포넌트로 따로 안 뺌)
function ChallengePagination({ currentPage, totalPages, onPageChange }) {
  // 페이지가 1개 이하면 페이지네이션 자체를 숨김
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // 범위 밖 페이지로 이동하는 걸 막아주는 함수
  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) {
      return;
    }
    onPageChange(nextPage);
  };

  return (
    <nav
      aria-label="챌린지 목록 페이지 이동"
      className="flex items-center justify-center gap-[4px]"
    >
      <PageArrowButton
        direction="prev"
        disabled={isFirstPage}
        onClick={() => handlePageChange(currentPage - 1)}
      />

      {/* 페이지 번호 버튼들 */}
      {visiblePages.map((page) => {
        const isCurrentPage = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => handlePageChange(page)}
            aria-label={`${page}페이지로 이동`}
            aria-current={isCurrentPage ? 'page' : undefined}
            className={cn(
              'flex size-[40px] items-center justify-center',
              'rounded-[8px] transition-colors',

              isCurrentPage
                ? ['bg-brand-black', 'text-14-semibold text-brand-yellow']
                : [
                    'text-14-regular text-gray-400',
                    'hover:bg-gray-50 hover:text-brand-yellow',
                  ],
            )}
          >
            {page}
          </button>
        );
      })}

      <PageArrowButton
        direction="next"
        disabled={isLastPage}
        onClick={() => handlePageChange(currentPage + 1)}
      />
    </nav>
  );
}

// /challenges 경로에서 보여줄 챌린지 목록 페이지
export default function ChallengesPage() {
  // 현재 보고 있는 페이지 번호 (처음엔 1페이지)
  const [currentPage, setCurrentPage] = useState(1);

  // 검색창에 입력한 검색어
  const [keyword, setKeyword] = useState('');

  // Filter에서 "적용하기"를 눌러 최종 확정된 필터 조건
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);

  // 검색어 + 필터 조건에 맞는 챌린지만 골라내기
  const filteredChallenges = useMemo(() => {
    // 대소문자, 앞뒤 공백 차이로 검색이 안 되는 걸 막기 위해 정리
    const normalizedKeyword = keyword.trim().toLowerCase();

    return MOCK_CHALLENGES.filter((challenge) => {
      // 검색어가 없으면 전부 통과, 있으면 제목에 포함되는지 확인
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        challenge.title.toLowerCase().includes(normalizedKeyword);

      // 분야를 하나도 안 골랐으면 전부 통과, 골랐으면 포함 여부 확인
      const matchesCategory =
        appliedFilters.categories.length === 0 ||
        appliedFilters.categories.includes(challenge.field);

      // 문서 타입을 안 골랐으면 전부 통과, 골랐으면 같은지 확인
      const matchesDocType =
        !appliedFilters.docType || challenge.docType === appliedFilters.docType;

      // 임시 데이터의 status(APPROVED/CLOSED)를
      // Filter가 쓰는 진행 상태 값(IN_PROGRESS/CLOSED)으로 바꿔줌
      const challengeProgressStatus =
        challenge.progressStatus ??
        (challenge.status === 'CLOSED' ? 'CLOSED' : 'IN_PROGRESS');

      // 진행 상태를 안 골랐으면 전부 통과, 골랐으면 같은지 확인
      const matchesStatus =
        !appliedFilters.status ||
        challengeProgressStatus === appliedFilters.status;

      // 네 가지 조건을 모두 만족해야 최종 목록에 포함
      return (
        matchesKeyword && matchesCategory && matchesDocType && matchesStatus
      );
    });
  }, [appliedFilters, keyword]);

  // 걸러진 챌린지 개수로 전체 페이지 수 계산 (예: 20개 ÷ 4개 = 5페이지)
  const totalPages = Math.ceil(filteredChallenges.length / ITEMS_PER_PAGE);

  // 현재 페이지가 배열의 몇 번째부터 시작하는지 계산
  // 1페이지: 0부터, 2페이지: 4부터 ...
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  // 전체 목록 중 현재 페이지에 보여줄 부분만 잘라내기
  const currentChallenges = filteredChallenges.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // 검색/필터 결과가 하나도 없는지 확인
  const isEmpty = filteredChallenges.length === 0;

  // SearchBar에서 검색어를 입력하면 실행되는 함수
  // (일반 input과 달리 event가 아니라 검색어 문자열을 바로 받음)
  const handleSearch = useCallback((nextKeyword) => {
    setKeyword(nextKeyword);
    setCurrentPage(1); // 검색 조건이 바뀌면 1페이지부터 다시 보여주기
  }, []);

  // Filter에서 "적용하기"를 누르면 실행되는 함수
  // nextFilters 예시: { categories: [], docType: null, status: null }
  const handleApplyFilters = useCallback((nextFilters) => {
    setAppliedFilters(nextFilters);
    setCurrentPage(1); // 필터 조건이 바뀌면 1페이지부터 다시 보여주기
  }, []);

  return (
    <>
      {/*
        Header는 화면 상단에 고정(fixed)됨
        예제 페이지라서 실제 로그인 API 대신 테스트용 유저 정보를 넘겨줌
        notifications를 빈 배열로 주면 실제 알림 API를 요청하지 않음
      */}
      <Header
        user={HEADER_TEST_USER}
        notifications={[]}
        onLogout={() => undefined}
      />

      {/*
        Header가 고정되어 있어서 그 높이만큼 위쪽 여백(padding-top)을 줘야 함
        모바일 56px / 태블릿 이상 60px
        이 여백이 없으면 Header가 "챌린지 목록" 제목을 가림
      */}
      <main
        className={cn(
          'flex min-h-dvh flex-col bg-white',
          'pt-[56px]',
          'tablet:pt-[60px]',
        )}
      >
        {/* Header를 제외한 나머지 화면 높이를 꽉 채우기 위해 flex-1 사용 */}
        <div
          className={cn(
            'mx-auto flex w-full max-w-[996px] flex-1 flex-col',
            'px-[16px]', // 모바일 좌우 여백
            'tablet:px-[24px]', // 태블릿 좌우 여백
            'desktop:px-0', // 데스크톱은 너비가 고정이라 여백 필요 없음
          )}
        >
          {/* 제목 + 신규 챌린지 신청 버튼 영역 */}
          <section
            aria-labelledby="challenge-list-title"
            className="shrink-0 pt-[24px]"
          >
            <div className="flex items-center justify-between gap-[12px]">
              <h1
                id="challenge-list-title"
                className="text-20-semibold text-gray-800"
              >
                챌린지 목록
              </h1>

              <ButtonChallengeApply href="/challenges/new" />
            </div>

            {/*
              Filter + SearchBar 영역
              모바일부터: Filter는 왼쪽에 고정 크기, SearchBar가 남은 공간을 다 차지
              태블릿/데스크톱에서도 같은 한 줄 구조 유지
            */}
            <div className="mt-[16px] flex w-full items-center gap-[8px]">
              <Filter
                appliedFilters={appliedFilters} // 현재 적용된 필터 값 전달 (다시 열었을 때 유지되게)
                onApply={handleApplyFilters} // "적용하기"/"초기화" 눌렀을 때 실행
                className="shrink-0" // SearchBar 때문에 Filter가 찌그러지지 않게
              />

              {/*
                min-w-0: 화면이 좁을 때 SearchBar가 넘치는 걸 방지
                flex-1: Filter 빼고 남은 가로 공간을 SearchBar가 다 사용
              */}
              <div className="min-w-0 flex-1">
                <SearchBar
                  placeholder="챌린지 이름을 검색해보세요"
                  onSearch={handleSearch}
                  className="w-full max-w-none" // 부모 너비를 그대로 따라가게
                />
              </div>
            </div>
          </section>

          {/*
            결과 영역
            검색 결과 없음 → ChallengeEmptyState를 가운데 표시
            검색 결과 있음 → 카드 목록 + 페이지네이션 표시
          */}
          <section
            aria-label="챌린지 목록"
            className={cn(
              'flex w-full flex-1',
              isEmpty
                ? 'items-center justify-center'
                : 'flex-col items-stretch pt-[16px]',
            )}
          >
            {isEmpty ? (
              <ChallengeEmptyState />
            ) : (
              <>
                {/* 현재 페이지에 해당하는 챌린지들을 Card로 렌더링 */}
                <div className="flex w-full flex-col gap-[24px]">
                  {currentChallenges.map((challenge) => (
                    <Card
                      key={challenge.id}
                      challenge={challenge}
                      detailHref={`/challenges/${challenge.id}`} // 카드 클릭 시 이동할 상세 페이지 주소
                    />
                  ))}
                </div>

                {/* 카드 목록 아래에 페이지네이션 표시 */}
                <div className="mt-[32px] pb-[40px]">
                  <ChallengePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
