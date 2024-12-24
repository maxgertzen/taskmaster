import { CACHE_KEYS } from "@src/utils/cacheKeys";
import { CacheService } from "./cacheService";
import { BaseUser } from "@src/interfaces/entities";
import { IUserCache } from "@src/interfaces/cache";

export class UsersCache implements IUserCache {
  private readonly cacheService: CacheService;

  constructor() {
    this.cacheService = new CacheService();
  }

  async getUser(userId: string): Promise<BaseUser | null> {
    return this.cacheService.get(CACHE_KEYS.USER(userId));
  }

  async setUser(userId: string, user: BaseUser): Promise<void> {
    return this.cacheService.set(CACHE_KEYS.USER(userId), user, "user");
  }

  async invalidateCache(userId: string): Promise<void> {
    return this.cacheService.invalidateCache(CACHE_KEYS.USER(userId));
  }
}