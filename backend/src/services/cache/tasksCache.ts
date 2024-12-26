import { CacheService } from "./cacheService";
import { CACHE_KEYS } from "@utils/cacheKeys";
import { BaseTask, ClientTask, SearchResults } from "@interfaces/entities";
import { ITaskCache } from "@src/interfaces/cache";

export class TasksCache implements ITaskCache {
  constructor(private cacheService: CacheService) {}

  async getTasks(userId: string, listId: string): Promise<BaseTask[] | null> {
    return this.cacheService.get<BaseTask[]>(
      CACHE_KEYS.TASK_LIST(userId, listId)
    );
  }

  async setTasks(
    userId: string,
    listId: string,
    tasks: ClientTask[]
  ): Promise<void> {
    await this.cacheService.set(
      CACHE_KEYS.TASK_LIST(userId, listId),
      tasks,
      "TASKS"
    );
  }

  async invalidateTasks(userId: string, listId: string): Promise<void> {
    await this.cacheService.delete(CACHE_KEYS.TASK_LIST(userId, listId));
  }

  async getSearchResults(
    userId: string,
    search: string
  ): Promise<SearchResults | null> {
    return this.cacheService.get<SearchResults>(
      CACHE_KEYS.SEARCH_RESULTS(userId, search)
    );
  }

  async setSearchResults(
    userId: string,
    search: string,
    results: SearchResults
  ): Promise<void> {
    await this.cacheService.set(
      CACHE_KEYS.SEARCH_RESULTS(userId, search),
      results,
      "SEARCH"
    );
  }

  async invalidateAllCache(userId: string): Promise<void> {
    await this.cacheService.invalidateCache(userId);
  }
}
