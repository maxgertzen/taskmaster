import { CacheService } from "./cacheService";
import { CACHE_KEYS } from "@src/utils/cacheKeys";
import { BaseList } from "@src/interfaces/entities";
import { IListCache } from "@src/interfaces/cache";

export class ListsCache implements IListCache {
  private readonly cacheService: CacheService;

  constructor() {
    this.cacheService = new CacheService();
  }

  async getLists(userId: string): Promise<BaseList[] | null> {
    return this.cacheService.get<BaseList[]>(CACHE_KEYS.LISTS(userId));
  }

  async setLists(userId: string, lists: BaseList[]): Promise<void> {
    return this.cacheService.set(CACHE_KEYS.LISTS(userId), lists, "lists");
  }

  async invalidateCache(userId: string): Promise<void> {
    return this.cacheService.invalidateCache(CACHE_KEYS.LISTS(userId));
  }
}