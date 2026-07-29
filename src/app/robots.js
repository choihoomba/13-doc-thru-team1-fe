const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * /robots.txt
 * - (protected), (admin) 그룹은 로그인 필수라 크롤링 의미가 없어 차단
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/signin', '/signup'],
        disallow: ['/challenges', '/submissions', '/admin', '/api'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
