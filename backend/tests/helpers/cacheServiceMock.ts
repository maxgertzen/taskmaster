import { mockListsCache, mockTasksCache, mockUsersCache } from "@tests/data";
import { mockRedisClient } from "./redisClientMock";

export const mockGet = jest.fn();
export const mockSet = jest.fn();
export const mockDelete = jest.fn();
export const mockInvalidateCache = jest.fn();

jest.mock("@src/services/cache/cacheService", () => {
  return {
    CacheService: jest.fn().mockImplementation(() => ({
      get: mockGet,
      set: mockSet,
      delete: mockDelete,
      invalidateCache: mockInvalidateCache,
    })),
  };
});

jest.mock("@src/services/cache/listsCache", () => ({
  ListsCache: jest.fn().mockImplementation(() => mockListsCache),
}));

jest.mock("@src/services/cache/tasksCache", () => ({
  TasksCache: jest.fn().mockImplementation(() => mockTasksCache),
}));

jest.mock("@src/services/cache/usersCache", () => ({
  UsersCache: jest.fn().mockImplementation(() => mockUsersCache),
}));

jest.mock("@src/config/database", () => ({
  getCacheClient: jest.fn(() => mockRedisClient),
}));
