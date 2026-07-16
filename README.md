# 독스루 (Doc-thru) - Frontend

1팀 중급 프로젝트 - 독스루(DocThru) FE

개발 문서 번역 챌린지 서비스의 프론트엔드 레포지토리입니다.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19, Tailwind CSS 4
- **State/Data**: TanStack Query (React Query)
- **Lint/Format**: ESLint, Prettier, Husky + lint-staged

## 시작하기

```bash
npm install
cp .env.example .env   # 필요한 환경 변수 입력
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 스크립트

| 명령어          | 설명           |
| --------------- | -------------- |
| `npm run dev`   | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드  |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint`  | ESLint 검사    |

## 폴더 구조

```
src/
├── app/                # App Router 페이지/레이아웃
│   ├── (auth)/         # 비회원 전용 라우트 그룹 (랜딩, 로그인, 회원가입)
│   ├── (protected)/    # 회원 전용 라우트 그룹 (챌린지, 작업물)
│   ├── (admin)/        # 관리자 전용 라우트 그룹
│   ├── layout.jsx      # 루트 레이아웃
│   └── providers.jsx   # QueryClientProvider + AuthProvider + ModalProvider
│
├── components/         # 도메인/공통 UI 컴포넌트
│   ├── ui/             # 원자 단위 공통 컴포넌트 (Button, Modal, Form 등)
│   ├── auth/
│   ├── challenges/
│   ├── submissions/
│   └── admin/
│
├── lib/
│   ├── api/            # 브라우저(클라이언트)에서 호출하는 fetch 래퍼 - TanStack Query 전용
│   ├── actions/         # Server Actions ('use server') - 인증 전용
│   ├── services/        # 서버 전용 로직 (httpOnly 쿠키 등)
│   ├── constants/
│   └── providers/       # AuthProvider, ModalProvider 등 Context 프로바이더
│
├── hooks/               # 도메인별 TanStack Query 훅 (keys/queries/mutations)
└── utils/               # 날짜 포맷 등 순수 유틸 함수
```

(`(auth)`, `(protected)`, `(admin)` 은 Next.js 라우트 그룹으로, URL 경로에는 포함되지 않습니다.)

## 개발 컨벤션

- 커밋 전 `husky` pre-commit 훅이 스테이징된 파일에 한해 `prettier --write` → `eslint --fix` 를 자동 실행합니다 (`lint-staged`).
- 상수는 `src/lib/constants/constants.js`의 가이드라인(대문자 스네이크 케이스, 객체로 그룹핑)을 따릅니다.
