'use server';

import dns from 'node:dns/promises';
import { isIP } from 'node:net';

const XFO_BLOCKED_PATTERN = /deny|sameorigin/i;
const MAX_REDIRECTS = 5;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

const PRIVATE_IPV4_PATTERNS = [
  /^127\./, // loopback
  /^10\./, // private
  /^172\.(1[6-9]|2\d|3[0-1])\./, // private
  /^192\.168\./, // private
  /^169\.254\./, // link-local (클라우드 메타데이터 169.254.169.254 포함)
  /^0\./, // "this" network
];

function isPrivateIpv4(ip) {
  return PRIVATE_IPV4_PATTERNS.some((pattern) => pattern.test(ip));
}

function isPrivateIpv6(ip) {
  const normalized = ip.toLowerCase();
  if (normalized === '::1') return true; // loopback
  if (normalized.startsWith('fe80:')) return true; // link-local
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true; // unique local (fc00::/7)
  if (normalized.startsWith('::ffff:')) {
    return isPrivateIpv4(normalized.slice('::ffff:'.length));
  }
  return false;
}

/**
 * 요청을 보내기 전 호스트가 사설/루프백/링크로컬 대역으로 풀리는지 확인한다(SSRF 방지).
 * DNS lookup과 실제 fetch 사이 응답이 바뀌는 DNS 리바인딩까지 막지는 못하지만,
 * originalUrl에 내부 주소를 직접 넣는 가장 흔한 SSRF 시도는 차단한다.
 */
async function isSafeUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) return false;

  const hostname = parsed.hostname.replace(/^\[|\]$/g, '');
  const ipVersion = isIP(hostname);

  if (ipVersion === 4) return !isPrivateIpv4(hostname);
  if (ipVersion === 6) return !isPrivateIpv6(hostname);

  try {
    const { address, family } = await dns.lookup(hostname);
    return family === 4 ? !isPrivateIpv4(address) : !isPrivateIpv6(address);
  } catch {
    return false;
  }
}

/**
 * URL이 iframe에 임베드 가능한지 X-Frame-Options/CSP frame-ancestors 헤더로 서버에서 미리 확인한다.
 * 서버-서버 요청이라 CORS 없이 헤더를 신뢰성 있게 읽을 수 있다.
 * (클라이언트의 iframe onLoad 감지는 CSP로 차단된 경우 브라우저 자체 에러 페이지도
 * cross-origin으로 잡혀서 정상 로드와 구분이 안 되는 한계가 있음)
 *
 * @returns {Promise<boolean | null>} true: 임베드 가능, false: 차단됨, null: 판단 불가(요청 실패, 안전하지 않은 주소 등)
 */
export async function checkEmbeddable(url) {
  let currentUrl = url;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    if (!(await isSafeUrl(currentUrl))) return null;

    let response;
    try {
      response = await fetch(currentUrl, {
        method: 'HEAD',
        redirect: 'manual',
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      return null;
    }

    if (REDIRECT_STATUSES.has(response.status)) {
      const location = response.headers.get('location');
      if (!location) return null;

      try {
        currentUrl = new URL(location, currentUrl).toString();
      } catch {
        return null;
      }
      continue;
    }

    const xFrameOptions = response.headers.get('x-frame-options');
    if (xFrameOptions && XFO_BLOCKED_PATTERN.test(xFrameOptions)) {
      return false;
    }

    const csp = response.headers.get('content-security-policy');
    const frameAncestors = csp
      ?.split(';')
      .map((directive) => directive.trim())
      .find((directive) =>
        directive.toLowerCase().startsWith('frame-ancestors'),
      );

    if (frameAncestors) {
      const sources = frameAncestors.split(/\s+/).slice(1);
      if (!sources.includes('*')) return false;
    }

    return true;
  }

  return null; // 리다이렉트가 너무 많음
}
