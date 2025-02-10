import { RedisClientType } from 'redis';
import { CACHE_CONFIG } from '@config/cache';
import { CacheKey } from '../../types/cache';

export class CacheService {
  private readonly keyPrefix = 'cache:user:';

  constructor(private client: RedisClientType) {}

  async get<T>(key: CacheKey): Promise<T | null> {
    try {
      const data = await this.client.hGetAll(key);
      if (!Object.keys(data).length) return null;

      if (data.value) {
        return JSON.parse(data.value) as T;
      }

      return data as T;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Cache get error:', error);
      }
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

      if (Array.isArray(data) || (data && typeof data === 'object')) {
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
      if (process.env.NODE_ENV === 'development') {
        console.warn('Cache get error:', error);
      }
    }
  }

  async delete(key: CacheKey): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Cache get error:', error);
      }
    }
  }

  async invalidateCache(userId: string): Promise<void> {
    try {
      const keys = await this.client.keys(`${this.keyPrefix}${userId}:*`);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Cache get error:', error);
      }
    }
  }
}
