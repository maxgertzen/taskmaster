import { CacheConfig } from "../types/cache";

export const CACHE_CONFIG: Record<string, CacheConfig> = {
  LISTS: {
    ttl: 3600,
    enabled: true,
  },
  TASKS: {
    ttl: 1800,
    enabled: true,
  },
  SEARCH: {
    ttl: 300,
    enabled: true,
  },
  USER: {
    ttl: 7200,
    enabled: true,
  },
} as const;
