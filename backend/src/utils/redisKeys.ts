export const REDIS_KEYS = {
  TASK: (userId: string, taskId: string) =>
    `user:${userId}:task:${taskId}` as const,
  TASK_LIST: (userId: string, listId: string) =>
    `user:${userId}:tasks:${listId}` as const,
  LIST: (userId: string, listId: string) =>
    `user:${userId}:list:${listId}` as const,
  LISTS: (userId: string) => `user:${userId}:lists` as const,
} as const;