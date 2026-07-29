const BACKEND_URL = process.env.BACKEND_URL;

async function proxy(request, { params }) {
  const { path } = await params;
  const targetUrl = new URL(`${BACKEND_URL}/${path.join('/')}`);
  targetUrl.search = request.nextUrl.searchParams.toString();

  const hasBody = !['GET', 'DELETE'].includes(request.method);
  const body = hasBody ? await request.text() : undefined;

  let response;
  try {
    response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        cookie: request.headers.get('cookie') ?? '',
      },
      body,
    });
  } catch {
    // 백엔드 연결 실패 시에도 HTML 에러 페이지 대신 JSON으로 응답
    return Response.json(
      {
        success: false,
        message: '백엔드 서버에 연결할 수 없습니다.',
        code: 'BACKEND_UNREACHABLE',
      },
      { status: 502 },
    );
  }

  const data = await response.text();

  const proxyResponse = new Response(data, {
    status: response.status,
    headers: {
      'Content-Type':
        response.headers.get('Content-Type') ?? 'application/json',
    },
  });

  const setCookieHeaders = response.headers.getSetCookie?.() ?? [];
  setCookieHeaders.forEach((cookie) => {
    proxyResponse.headers.append('Set-Cookie', cookie);
  });

  return proxyResponse;
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
