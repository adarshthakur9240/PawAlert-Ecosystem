import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const aiTriageLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "@upstash/ratelimit/ai-triage",
});
