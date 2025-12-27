import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true
});
export { redis, ratelimit };
