export const CACHE_KEYS = {
  TASK: (userId: string, taskId: string) =>
    `cache:user:${userId}:task:${taskId}` as const,
  TASK_LIST: (userId: string, listId: string) =>
    `cache:user:${userId}:tasks:${listId}` as const,
  LIST: (userId: string, listId: string) =>
    `cache:user:${userId}:list:${listId}` as const,
  LISTS: (userId: string) => `cache:user:${userId}:lists` as const,
  SEARCH_RESULTS: (userId: string, query: string) =>
    `cache:user:${userId}:search:${query}` as const,
} as const;
