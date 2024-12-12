import { CACHE_KEYS } from "../utils/cacheKeys";

export type CacheConfig = {
  ttl: number;
  enabled: boolean;
};

type CacheKeyFunction = (typeof CACHE_KEYS)[keyof typeof CACHE_KEYS];
export type CacheKey = ReturnType<CacheKeyFunction>;
