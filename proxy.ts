import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';
import { auth } from '@/lib/auth/auth';
import {
  getClientIP,
  checkBlacklist,
  blockIp,
  log
} from '@/lib/auth/middleware/utils';

const createRateLimiter = () =>
  new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(200, '60 s'),
    ephemeralCache: new Map(),
    analytics: true
  });
const uploadLimiter = createRateLimiter();
const publicLimiter = createRateLimiter();
const privateLimiter = createRateLimiter();

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicRoute = false;
  const isUploadRoute = pathname.startsWith('/file/upload');
  const rateLimitResponse = await rateLimitMiddleware(
    request,
    isPublicRoute,
    isUploadRoute
  );
  if (rateLimitResponse) return rateLimitResponse;
  return auth(request as any);
}

const rateLimitMiddleware = async (
  request: NextRequest,
  isPublicRoute: boolean,
  isUploadRoute: boolean
): Promise<NextResponse | null> => {
  const ip = getClientIP(request.headers);
  const prefix = isUploadRoute
    ? 'upload'
    : isPublicRoute
      ? 'public'
      : 'private';
  const status = await checkBlacklist(ip);
  if (status === 'static') {
    log({ ip, routeType: prefix, status: 403, reason: 'Static blacklist' });
    return new NextResponse('Forbidden - IP blocked (static)', { status: 403 });
  }
  if (status === 'dynamic') {
    log({ ip, routeType: prefix, status: 403, reason: 'Dynamic blacklist' });
    return new NextResponse('Forbidden - IP blocked (dynamic)', {
      status: 403
    });
  }
  const ratelimit = isUploadRoute
    ? uploadLimiter
    : isPublicRoute
      ? publicLimiter
      : privateLimiter;
  const { success } = await ratelimit.limit(`${prefix}:${ip}`);
  if (!success) {
    await blockIp(ip, prefix);
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  return null;
};

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|assets|images|login|login/unauthorized|favicon\\.ico).*)'
  ]
};
