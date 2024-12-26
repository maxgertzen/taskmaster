import { asClass, asValue, createContainer } from "awilix";
import {
  ServiceName,
  ServiceTestContext,
  MockCacheService,
  MockTasksCache,
  MockListsCache,
  MockUsersCache,
  MockTaskRepository,
  MockListRepository,
  MockUserRepository,
} from "../types/serviceTypes";
import { mockRedisClient } from "./redisClientMock";
import { ListsService, TasksService, UsersService } from "@src/services";

const createMockCacheService = <T>(): MockCacheService<T> => ({
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  invalidateCache: jest.fn(),
});

const createMockTasksCache = (): MockTasksCache => ({
  getTasks: jest.fn(),
  setTasks: jest.fn(),
  invalidateTasks: jest.fn(),
  getSearchResults: jest.fn(),
  setSearchResults: jest.fn(),
  invalidateAllCache: jest.fn(),
});

const createMockListsCache = (): MockListsCache => ({
  getLists: jest.fn(),
  setLists: jest.fn(),
  invalidateCache: jest.fn(),
});

const createMockUsersCache = (): MockUsersCache => ({
  getUser: jest.fn(),
  setUser: jest.fn(),
  invalidateCache: jest.fn(),
});

const createMockCache = <T extends ServiceName>(type: T) => {
  switch (type) {
    case "tasks":
      return createMockTasksCache();
    case "lists":
      return createMockListsCache();
    case "users":
    default:
      return createMockUsersCache();
  }
};

const createMockTaskRepository = (): MockTaskRepository => ({
  createTask: jest.fn(),
  getTasks: jest.fn(),
  getTasksSearchResults: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  reorderTasks: jest.fn(),
  toggleCompleteAll: jest.fn(),
  bulkDelete: jest.fn(),
});

const createMockListRepository = (): MockListRepository => ({
  getLists: jest.fn(),
  createList: jest.fn(),
  updateList: jest.fn(),
  deleteList: jest.fn(),
  reorderLists: jest.fn(),
});

const createMockUserRepository = (): MockUserRepository => ({
  createUser: jest.fn(),
  getUser: jest.fn(),
  updateUser: jest.fn(),
  updatePreferences: jest.fn(),
});

const createMockRepository = <T extends ServiceName>(type: T) => {
  switch (type) {
    case "tasks":
      return createMockTaskRepository();
    case "lists":
      return createMockListRepository();
    case "users":
      return createMockUserRepository();
  }

  return null;
};

export const setupServiceTest = <T extends ServiceName>(
  serviceType: T
): ServiceTestContext<T> => {
  const container = createContainer();
  const mockRepository = createMockRepository(serviceType);
  const mockCacheService = createMockCacheService<T>();
  const mockCache = createMockCache(serviceType);

  container.register({
    redisClient: asValue(mockRedisClient),
    cacheService: asValue(mockCacheService),
  });

  switch (serviceType) {
    case "tasks":
      container.register({
        taskRepository: asValue(mockRepository),
        tasksCache: asValue(mockCache),
        tasksService: asClass(TasksService)
          .classic()
          .inject(() => ({
            repository: container.resolve("taskRepository"),
            cache: container.resolve("tasksCache"),
          })),
      });
      break;
    case "lists":
      container.register({
        listRepository: asValue(mockRepository),
        listsCache: asValue(mockCache),
        listsService: asClass(ListsService)
          .classic()
          .inject(() => ({
            repository: container.resolve("listRepository"),
            cache: container.resolve("listsCache"),
          })),
      });
      break;
    case "users":
      container.register({
        userRepository: asValue(mockRepository),
        usersCache: asValue(mockCache),
        usersService: asClass(UsersService)
          .classic()
          .inject(() => ({
            repository: container.resolve("userRepository"),
            cache: container.resolve("usersCache"),
          })),
      });
      break;
  }

  const singularServiceType = serviceType.slice(0, -1);

  const service = container.resolve(`${serviceType}Service`);
  const repository = container.resolve(`${singularServiceType}Repository`);
  const cache = container.resolve(`${serviceType}Cache`);

  return {
    container,
    service,
    repository,
    cache,
    cacheService: container.resolve("cacheService"),
    redisClient: mockRedisClient,
  } as ServiceTestContext<T>;
};
