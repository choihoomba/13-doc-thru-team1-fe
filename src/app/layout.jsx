import localFont from 'next/font/local';

import BodyMargin from '@/components/layout/BodyMargin';

import './globals.css';
import Providers from './providers';

const pretendard = localFont({
  src: './assets/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard-variable',
  weight: '45 920',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_NAME = '독스루 (DocThru)';
const SITE_DESCRIPTION = '개발 문서 번역 챌린지 서비스';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['독스루', 'DocThru', '개발 문서', '번역', '챌린지', '스터디'],
  alternates: {
    canonical: '/',
  },
  // og:image, twitter:image는 app/opengraph-image.jpg 파일 컨벤션으로 자동 생성됨
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <Providers>
          <BodyMargin>{children}</BodyMargin>
        </Providers>
      </body>
    </html>
  );
}
