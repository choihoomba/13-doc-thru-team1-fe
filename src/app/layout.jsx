import './globals.css';
import Providers from './providers';

export const metadata = {
  title: '독스루 (DocThru)',
  description: '개발 문서 번역 챌린지 서비스',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
