import { RedisClientType } from "redis";
import { getCacheClient } from "../../config/database";
import { CACHE_CONFIG } from "../../config/cache";
import { CacheKey } from "../../types/cache";

export class CacheService {
  private readonly client: RedisClientType;
  private readonly keyPrefix = "cache:user:";

  constructor() {
    this.client = getCacheClient();
  }

  async get<T>(key: CacheKey): Promise<T | null> {
    try {
      const data = await this.client.hGetAll(key);
      if (!Object.keys(data).length) return null;

      if (data.value) {
        return JSON.parse(data.value) as T;
      }

      return data as T;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  async set<T>(
    key: CacheKey,
    data: T,
    type: keyof typeof CACHE_CONFIG
  ): Promise<void> {
    try {
      const config = CACHE_CONFIG[type];
      if (!config.enabled) return;

      if (Array.isArray(data) || (data && typeof data === "object")) {
        await this.client.hSet(key, { value: JSON.stringify(data) });
      } else {
        const stringifiedData: Record<string, string> = {};
        Object.entries(data as Record<string, unknown>).forEach(
          ([field, value]) => {
            stringifiedData[field] = String(value);
          }
        );
        await this.client.hSet(key, stringifiedData);
      }

      if (config.ttl) {
        await this.client.expire(key, config.ttl);
      }
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  async delete(key: CacheKey): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error("Cache delete error:", error);
    }
  }

  async invalidateCache(userId: string): Promise<void> {
    try {
      // Using the same prefix pattern as defined in CACHE_KEYS
      const keys = await this.client.keys(`${this.keyPrefix}${userId}:*`);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      console.error("Cache invalidation error:", error);
    }
  }
}
