<div align="center">

# 📚 독스루 (Doc-thru)

### 개발 문서 번역 협업 플랫폼

코드잇 스프린트 중급 프로젝트 1팀

함께 번역하고, 공유하고, 피드백을 주고받는 협업형 번역 챌린지 서비스
</div>

<br>

## 📑 목차

- [서비스 소개](#-서비스-소개)
- [서비스 화면](#-서비스-화면)
- [배포 주소](#-배포-주소)
- [주요 기능](#-주요-기능)
- [Tech Stack](#-tech-stack)
- [사용 라이브러리](#-사용-라이브러리)
- [프론트엔드 아키텍처](#-프론트엔드-아키텍처)
- [R\&R](#-rr)
- [시작하기](#-시작하기)
- [스크립트](#-스크립트)
- [폴더 구조](#-폴더-구조)
- [주요 설계 방식](#-주요-설계-방식)
- [개발 컨벤션](#-개발-컨벤션)

<br>

## 🧩 서비스 소개

**독스루**는 개발 문서를 함께 번역하고, 작업물을 공유하며, 피드백과 추천을 주고받을 수 있는 협업형 번역 플랫폼입니다.

<br>

<br>

## 🌐 배포 주소

<!-- Vercel 배포 주소 추가 예정 -->

| 환경 | 주소                                     |
| ---- | ---------------------------------------- |
| 배포 | https://13-doc-thru-team1-fe.vercel.app/ |
| 로컬 | `http://localhost:3000`                  |

<br>

## ✨ 주요 기능

- 랜딩, 로그인, 회원가입 및 인증 상태 관리
- 챌린지 목록 조회, 검색, 필터링 및 정렬
- 신규 챌린지 신청 및 신청 내역 관리
- 진행 중 · 완료 · 신청한 챌린지 조회
- 챌린지 상세 정보 및 참여 현황 조회
- 번역 작업물 작성 · 수정 및 임시 저장
- 작업물 상세 조회, 피드백 및 추천
- 관리자 챌린지 신청 목록 · 상세 관리
- 관리자 챌린지 승인 · 거절 및 정보 수정
- 알림 조회 및 읽음 처리
- 모바일 · 태블릿 · 데스크톱 반응형 UI

<br>

## 🛠 Tech Stack

| 구분         | 기술               | 사용 목적                                                                                                         |
| ------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Framework    | Next.js 16         | App Router 기반 파일 라우팅과 SSR을 사용합니다. 랜딩 페이지의 SEO 최적화와 팀 단위 라우트 구조 관리에 활용합니다. |
| UI           | React 19           | 컴포넌트 기반으로 사용자 화면과 상호작용을 구성합니다.                                                            |
| Styling      | Tailwind CSS v4    | 디자인 토큰을 기반으로 반응형 스타일과 공통 UI를 일관되게 관리합니다.                                             |
| Server State | TanStack Query v5  | API 요청, 서버 상태 캐싱, 로딩 · 오류 상태 및 데이터 무효화를 관리합니다.                                         |
| Editor       | Tiptap v3          | 번역 작업물 작성을 위한 확장 가능한 리치 텍스트 에디터를 구현합니다.                                              |
| Validation   | Zod 4              | 프론트 · 백엔드 검증 스키마 통합을 위해 도입 예정입니다.                                                          |
| Deployment   | Vercel             | Next.js SSR, 이미지 최적화 및 프론트엔드 배포 환경으로 사용합니다.                                                |
| Code Quality | ESLint, Prettier   | 코드 정적 분석과 일관된 포맷을 유지합니다.                                                                        |
| Git Hooks    | Husky, lint-staged | 커밋 전에 스테이징된 파일을 자동으로 포맷하고 린트합니다.                                                         |

<br>

## 📦 사용 라이브러리

<details>
<summary>라이브러리 전체 목록 보기</summary>

| 라이브러리                              | 역할                                             |
| --------------------------------------- | ------------------------------------------------ |
| `@tanstack/react-query`                 | API 요청과 서버 상태 캐싱                        |
| `@tanstack/react-query-devtools`        | 개발 환경에서 Query 상태 확인                    |
| `@tiptap/react`                         | React 기반 리치 텍스트 에디터                    |
| `@tiptap/starter-kit`                   | Tiptap 기본 편집 기능 제공                       |
| `@tiptap/extension-*`                   | 글자 색상, 정렬, placeholder 등 에디터 기능 확장 |
| `clsx`                                  | 조건에 따른 클래스 이름 조합                     |
| `tailwind-merge`                        | 충돌하는 Tailwind CSS 클래스 병합                |
| `swiper`                                | 최다 추천 작업물 등 슬라이드 UI 구성             |
| `react-responsive`                      | JavaScript 수준의 반응형 분기 처리               |
| `react-loader-spinner`                  | 공통 로딩 UI 구현                                |
| `eslint`                                | JavaScript 및 React 코드 정적 분석               |
| `prettier`                              | 코드 포맷 통일                                   |
| `@trivago/prettier-plugin-sort-imports` | import 구문 자동 정렬                            |
| `husky`                                 | Git Hook 실행                                    |
| `lint-staged`                           | 스테이징된 파일만 포맷 · 린트 실행               |

</details>

<br>

## 🏗 프론트엔드 아키텍처

<!-- 프론트엔드 아키텍처 다이어그램 이미지 추가 예정 -->
<div align="center">

![architecture](https://via.placeholder.com/800x300.png?text=Architecture+Diagram+Coming+Soon)

> 프론트엔드 아키텍처 다이어그램이 추가될 예정입니다.

</div>

현재 API 요청은 다음 흐름으로 처리됩니다.

```text
사용자 브라우저
    ↓
Next.js App Router
    ↓
TanStack Query
    ↓
clientFetch('/api/...')
    ↓
Next.js BFF Proxy
src/app/api/[...path]/route.js
    ↓
Backend API
```

> 브라우저는 백엔드 주소를 직접 호출하지 않고, Next.js의 `/api/...` 상대 경로를 사용합니다. Next.js 서버가 백엔드 요청을 대신 전달하여 인증 쿠키를 프론트엔드 도메인 기준으로 관리합니다.

<br>

## 👥 R&R

| 팀원      | 역할             | 담당                                                                                                               |
| --------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| 🦖 최훈민 | 팀장 · BE 마스터 | 인증 인프라, 랜딩 · 로그인 · 회원가입 페이지, 프론트-백엔드 인증 흐름 연결                                         |
| 🐧 김지훈 | 부팀장           | 공통 Header, 회원 신규 챌린지 신청, 관리자 챌린지 수정, Challenge API 연동 통합, Notification API 지원             |
| 💨 한효주 | FE 마스터        | 프로젝트 초기 설정, 공통 Button, 회원 챌린지 상세, 관리자 보기 · 수정, 프론트 최적화 및 배포                       |
| 🙈 곽서현 | 노션 서기        | 디자인 시스템, 공통 Modal · Toast · Card, 작업물 도전 · 수정, 관리자 작업물 수정, 챌린지 참여 탭, 원문 확인 iframe |
| 🐯 하성휘 | 팀원             | 공통 Feedback, 회원 · 관리자 작업물 상세, 신청 챌린지 수정, Feedback · Like API 연동                               |
| 🦴 전현선 | 팀원             | 공통 Chips, 회원 챌린지 목록, 관리자 신청 관리 목록 · 상세, Query String 연동, README 작성                         |
| 🪴 채지훈 | 팀원             | 공통 FilterBar, 신청한 챌린지 목록 · 상세, 신청 승인 취소, 관리자 챌린지 보기                                      |

<details>
<summary>팀원별 상세 작업 내역 보기</summary>

### 🦖 최훈민 — 팀장 · BE 마스터

- 프론트엔드 인증 인프라 구성
- 랜딩 페이지 구현
- 로그인 페이지 구현
- 회원가입 페이지 구현
- 프론트엔드와 백엔드 인증 흐름 연결

### 🐧 김지훈 — 부팀장

- 공통 Header 컴포넌트 구현
- 회원 신규 챌린지 신청 페이지 구현
- 관리자 챌린지 수정 페이지 구현
- 프론트엔드 Challenge API 연동 구조 통합
- Notification API 프론트 연동 지원

### 💨 한효주 — FE 마스터

- 프론트엔드 프로젝트 초기 설정
- 공통 컴포넌트 분석 및 설계
- 공통 Button 컴포넌트 구현
- 회원 챌린지 상세 페이지 구현
- 관리자 챌린지 보기 · 수정 기능 구현
- 관리자 신청 관리 페이지 개선
- 프론트엔드 최적화
- 프론트엔드 배포

### 🙈 곽서현 — 노션 서기

- 디자인 시스템 정리
- 공통 Modal 컴포넌트 구현
- 공통 Toast 컴포넌트 구현
- 공통 Card 컴포넌트 구현
- 회원 작업물 도전하기 · 수정하기 페이지 구현
- 관리자 작업물 수정 페이지 구현
- 나의 챌린지 참여 중 · 완료 탭 구현
- 원문 확인을 위한 iframe 영역 구현

### 🐯 하성휘

- 공통 Feedback 컴포넌트 구현
- 회원 작업물 상세 페이지 구현
- 관리자 작업물 상세 페이지 구현
- 회원이 신청한 챌린지 수정 기능 구현
- Feedback 및 Like API 프론트 연동

### 🦴 전현선

- 공통 Chip 컴포넌트 구현
- 회원 챌린지 목록 페이지 구현
- 관리자 신청 관리 목록 페이지 구현
- 관리자 신청 관리 상세 페이지 구현
- 챌린지 목록 조회 및 Query String 연동
- README 작성

### 🪴 채지훈

- 공통 FilterBar 컴포넌트 구현
- 회원이 신청한 챌린지 목록 페이지 구현
- 회원이 신청한 챌린지 상세 페이지 구현
- 신청 승인 취소 기능 구현
- 관리자 챌린지 보기 페이지 구현

</details>

<br>

## 🚀 시작하기

### 요구 환경

- Node.js
- npm

### 설치 및 실행

```bash
npm install
cp .env.example .env
npm run dev
```

개발 서버 실행 후 다음 주소에서 확인할 수 있습니다.

```text
http://localhost:3000
```

### 환경 변수

`.env.example`을 복사하여 `.env` 파일을 만들고 필요한 값을 입력합니다.

```env
BACKEND_URL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| 변수                   | 설명                                                   |
| ---------------------- | ------------------------------------------------------ |
| `BACKEND_URL`          | Next.js BFF가 요청을 전달할 백엔드 서버 주소           |
| `NEXT_PUBLIC_SITE_URL` | sitemap, robots, 메타데이터에 사용하는 프론트엔드 주소 |

> ⚠️ 실제 환경 변수 값과 인증 정보는 Git에 올리지 않습니다.

<br>

## 📜 스크립트

| 명령어            | 설명                      |
| ----------------- | ------------------------- |
| `npm run dev`     | Next.js 개발 서버 실행    |
| `npm run build`   | 프로덕션 빌드 생성        |
| `npm run start`   | 프로덕션 빌드 결과 실행   |
| `npm run lint`    | 전체 프로젝트 ESLint 검사 |
| `npm run prepare` | Husky Git Hook 설정       |

<br>

## 📁 폴더 구조

<details>
<summary>전체 폴더 구조 보기</summary>

```text
src/
├── app/
│   ├── (auth)/                 # 랜딩·로그인·회원가입 라우트
│   ├── (protected)/            # 로그인 회원 전용 라우트
│   ├── (admin)/                # 관리자 전용 라우트
│   ├── api/[...path]/          # 백엔드 API 요청을 전달하는 BFF Proxy
│   ├── assets/                 # 폰트·아이콘·이미지
│   ├── globals.css             # 전역 스타일 및 디자인 토큰
│   ├── layout.jsx              # 루트 레이아웃
│   └── providers.jsx           # 전역 Provider 구성
│
├── components/
│   ├── ui/                     # 공통 디자인 시스템 컴포넌트
│   │   ├── Button/
│   │   ├── Chip/
│   │   ├── Feedback/
│   │   ├── FilterBar/
│   │   ├── Form/
│   │   ├── Header/
│   │   └── Modal/
│   ├── auth/                   # 인증·랜딩 도메인 컴포넌트
│   ├── challenges/             # 챌린지 도메인 컴포넌트
│   ├── submissions/            # 작업물 도메인 컴포넌트
│   ├── admin/                  # 관리자 전용 컴포넌트
│   └── layout/                 # 레이아웃 보조 컴포넌트
│
├── hooks/
│   ├── auth/                   # 인증 관련 Custom Hook
│   ├── common/                 # 공통 Custom Hook
│   ├── modal/                  # Modal 관련 Custom Hook
│   ├── queries/                # 도메인별 TanStack Query Hook
│   │   ├── adminChallenges/
│   │   ├── challenges/
│   │   ├── notifications/
│   │   ├── participations/
│   │   └── submissions/
│   └── submission/             # 작업물 에디터 관련 Hook
│
├── lib/
│   ├── actions/                # 인증 관련 Server Actions
│   ├── api/                    # 브라우저 API 함수 및 clientFetch
│   ├── constants/              # 프로젝트 공통 상수
│   ├── providers/              # Auth·Query·Modal Provider
│   ├── services/               # 서버 전용 API 및 인증 로직
│   └── validations/            # 입력값 검증 로직
│
└── utils/                      # 날짜·클래스·등급 등 순수 유틸리티
```

> `(auth)`, `(protected)`, `(admin)`은 Next.js의 Route Group입니다. 폴더 이름은 URL 경로에 포함되지 않습니다.

</details>

<br>

## 📐 주요 설계 방식

### Route Group

접근 권한에 따라 라우트를 구분합니다.

- `(auth)`: 비로그인 사용자를 위한 랜딩 · 로그인 · 회원가입
- `(protected)`: 로그인 회원 전용 페이지
- `(admin)`: 관리자 전용 페이지

### API 요청

브라우저 API 요청은 `src/lib/api/clientFetch.js`를 사용합니다.

```jsx
import clientFetch from '@/lib/api/clientFetch';

export async function getChallenges() {
  return clientFetch('/api/challenges');
}
```

백엔드 절대 주소를 브라우저에서 직접 호출하지 않고 `/api/...` 상대 경로를 사용합니다.

`clientFetch`는 다음 기능을 담당합니다.

- JSON 요청 및 응답 처리
- 인증 쿠키 포함
- 공통 API 오류 처리
- 액세스 토큰 만료 시 refresh 요청
- refresh 성공 후 기존 요청 재시도

### TanStack Query

서버 상태 관련 Hook은 도메인별로 분리합니다.

```text
hooks/queries/{domain}/
├── keys.js
├── queries.js
└── mutations.js
```

| 파일           | 역할                         |
| -------------- | ---------------------------- |
| `keys.js`      | Query Key 관리               |
| `queries.js`   | 조회 요청 관리               |
| `mutations.js` | 생성 · 수정 · 삭제 요청 관리 |

### 공통 컴포넌트

프로젝트 전반에서 재사용하는 UI는 `src/components/ui`에서 관리합니다.

도메인에만 필요한 컴포넌트는 다음과 같이 각 도메인 폴더에서 관리합니다.

```text
components/
├── admin/
├── auth/
├── challenges/
└── submissions/
```

<br>

## 📏 개발 컨벤션

### 파일 이름

| 대상                 | 규칙                              |
| -------------------- | --------------------------------- |
| React 컴포넌트       | `PascalCase`                      |
| Hook                 | `use` 접두사를 사용한 `camelCase` |
| 유틸리티 및 API 파일 | `camelCase`                       |
| 상수                 | `UPPER_SNAKE_CASE`                |

### Import 경로

`jsconfig.json`에 등록된 `@/` alias를 사용합니다.

```jsx
import { cn } from '@/utils/cn';
```

### 스타일

- Tailwind CSS v4를 사용합니다.
- 모바일 퍼스트 방식으로 반응형 스타일을 작성합니다.
- 임의의 색상보다 `globals.css` 디자인 토큰을 우선 사용합니다.
- 조건부 스타일과 외부 `className` 병합에는 `cn()`을 사용합니다.

```jsx
className={cn(
  'text-14-regular',
  'tablet:text-16-regular',
  className,
)}
```

### 이미지

프로젝트 이미지와 아이콘은 `next/image`의 `Image` 컴포넌트로 렌더링합니다.

```jsx
import Image from 'next/image';
```

### z-index

| UI       | z-index     |
| -------- | ----------- |
| Modal    | `z-100`     |
| Toast    | `z-90`      |
| Header   | `z-80`      |
| Dropdown | `z-70`      |
| 일반 UI  | `z-50` 이하 |

### Git Hook

커밋할 때 Husky와 lint-staged가 스테이징된 JavaScript · TypeScript 파일을 검사합니다.

```text
git commit
   ↓
Prettier 자동 포맷
   ↓
ESLint 자동 수정 및 검사
   ↓
커밋 진행
```

> 자동으로 수정할 수 없는 ESLint 오류가 있으면 커밋이 중단됩니다.
