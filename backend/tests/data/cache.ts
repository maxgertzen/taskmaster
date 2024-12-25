import { IListCache, ITaskCache, IUserCache } from "@src/interfaces/cache";

export const mockListsCache: jest.Mocked<IListCache> = {
  getLists: jest.fn(),
  setLists: jest.fn(),
  invalidateCache: jest.fn(),
};

export const mockTasksCache: jest.Mocked<ITaskCache> = {
  getTasks: jest.fn(),
  setTasks: jest.fn(),
  getSearchResults: jest.fn(),
  setSearchResults: jest.fn(),
  invalidateTasks: jest.fn(),
};

export const mockUsersCache: jest.Mocked<IUserCache> = {
  getUser: jest.fn(),
  setUser: jest.fn(),
  invalidateCache: jest.fn(),
};
