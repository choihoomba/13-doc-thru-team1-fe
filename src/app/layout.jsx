import localFont from 'next/font/local';

import './globals.css';
import Providers from './providers';

const pretendard = localFont({
  src: './assets/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard-variable',
  weight: '45 920',
  display: 'swap',
});

export const metadata = {
  title: '독스루 (DocThru)',
  description: '개발 문서 번역 챌린지 서비스',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
