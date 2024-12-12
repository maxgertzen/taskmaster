import { CacheService } from "./cacheService";
import { CACHE_CONFIG } from "../../config/cache";
import { CacheKey } from "../../types/cache";

type CacheableFunction<TArgs extends unknown[], TReturn> = (
  ...args: TArgs
) => Promise<TReturn>;

type KeyGenerator<TArgs extends unknown[]> = (...args: TArgs) => CacheKey;

export function withCache<TArgs extends [string, ...unknown[]], TReturn>(
  fn: CacheableFunction<TArgs, TReturn>,
  options: {
    type: keyof typeof CACHE_CONFIG;
    keyGenerator: KeyGenerator<TArgs>;
  }
): CacheableFunction<TArgs, TReturn> {
  const cacheService = new CacheService();

  return async (...args: TArgs): Promise<TReturn> => {
    const key = options.keyGenerator(...args);

    const cached = await cacheService.get<TReturn>(key);
    if (cached) {
      return cached;
    }

    const result = await fn(...args);
    await cacheService.set(key, result, options.type);

    return result;
  };
}

export function withCacheInvalidation<
  TArgs extends [string, ...unknown[]],
  TReturn
>(fn: CacheableFunction<TArgs, TReturn>): CacheableFunction<TArgs, TReturn> {
  const cacheService = new CacheService();

  return async (...args: TArgs): Promise<TReturn> => {
    const result = await fn(...args);
    const userId = args[0];
    await cacheService.invalidateCache(userId);
    return result;
  };
}
