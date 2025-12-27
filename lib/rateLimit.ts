import { redis } from '@/lib/redis';
import { Ratelimit, RatelimitConfig } from '@upstash/ratelimit';

const rateLimitOptions: RatelimitConfig = {
  redis,
  limiter: Ratelimit.fixedWindow(1, '40 s'),
  analytics: false
};

export const passwordLimiter = new Ratelimit(rateLimitOptions);
export const otpLimiter = new Ratelimit(rateLimitOptions);
