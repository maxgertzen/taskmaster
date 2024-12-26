import { AwilixContainer } from "awilix";
import { CacheService } from "@src/services/cache/cacheService";
import { ITaskRepository } from "@interfaces/taskRepository";
import { IListRepository } from "@interfaces/listRepository";
import { IUserRepository } from "@interfaces/userRepository";
import { TasksService } from "@src/services/tasksService";
import { ListsService } from "@src/services/listsService";
import { UsersService } from "@src/services/usersService";
import {
  BaseTask,
  BaseUser,
  ClientTask,
  List,
  SearchResults,
  Task,
} from "@src/interfaces/entities";
import { CacheKey } from "@src/types/cache";
import { CACHE_CONFIG } from "@src/config/cache";
import { RedisClientType } from "redis";

export interface MockCacheService<T> {
  get: jest.Mock<Promise<T | null>, [CacheKey]>;
  set: jest.Mock<Promise<void>, [CacheKey, T, keyof typeof CACHE_CONFIG]>;
  delete: jest.Mock<Promise<void>, [CacheKey]>;
  invalidateCache: jest.Mock<Promise<void>, [string]>;
}

export interface MockTasksCache {
  getTasks: jest.Mock<Promise<BaseTask[] | null>, [string, string]>;
  setTasks: jest.Mock<Promise<void>, [string, string, ClientTask[]]>;
  invalidateTasks: jest.Mock<Promise<void>, [string, string]>;
  getSearchResults: jest.Mock<Promise<SearchResults | null>, [string, string]>;
  setSearchResults: jest.Mock<Promise<void>, [string, string, SearchResults]>;
  invalidateAllCache: jest.Mock<Promise<void>, [string]>;
}

export interface MockListsCache {
  getLists: jest.Mock<Promise<List[] | null>, [string]>;
  setLists: jest.Mock<Promise<void>, [string, List[]]>;
  invalidateCache: jest.Mock<Promise<void>, [string]>;
}

export interface MockUsersCache {
  getUser: jest.Mock<Promise<BaseUser | null>, [string]>;
  setUser: jest.Mock<Promise<void>, [string, BaseUser]>;
  invalidateCache: jest.Mock<Promise<void>, [string]>;
}

export interface MockTaskRepository extends ITaskRepository {
  createTask: jest.Mock<Promise<ClientTask>, [string, string, string]>;
  getTasks: jest.Mock<Promise<ClientTask[]>, [string, string]>;
  getTasksSearchResults: jest.Mock<Promise<SearchResults>, [string, string]>;
  updateTask: jest.Mock<Promise<string>, [string, string, Partial<Task>]>;
  deleteTask: jest.Mock<Promise<string>, [string, string, string]>;
  reorderTasks: jest.Mock<Promise<ClientTask[]>, [string, string, string[]]>;
  toggleCompleteAll: jest.Mock<
    Promise<ClientTask[]>,
    [string, string, boolean]
  >;
  bulkDelete: jest.Mock<
    Promise<ClientTask[]>,
    [string, string, "all" | "completed"]
  >;
}

export interface MockListRepository extends IListRepository {
  getLists: jest.Mock<Promise<List[]>, [string]>;
  createList: jest.Mock<Promise<List>, [string, string]>;
  updateList: jest.Mock<Promise<List>, [string, string, string]>;
  deleteList: jest.Mock<Promise<{ deletedId: string }>, [string, string]>;
  reorderLists: jest.Mock<Promise<List[]>, [string, string[]]>;
}

export interface MockUserRepository extends IUserRepository {
  getUser: jest.Mock<Promise<BaseUser | null>, [string]>;
  createUser: jest.Mock<
    Promise<BaseUser>,
    [string, string | undefined, string | undefined]
  >;
  updateUser: jest.Mock<Promise<BaseUser | null>, [string, Partial<BaseUser>]>;
  updatePreferences: jest.Mock<
    Promise<BaseUser | null>,
    [string, Record<string, unknown>]
  >;
}

export type ServiceName = "tasks" | "lists" | "users";

type ServiceMap = {
  tasks: {
    service: TasksService;
    repository: MockTaskRepository;
    cache: MockTasksCache;
  };
  lists: {
    service: ListsService;
    repository: MockListRepository;
    cache: MockListsCache;
  };
  users: {
    service: UsersService;
    repository: MockUserRepository;
    cache: MockUsersCache;
  };
};

export type ServiceType<T extends ServiceName> = ServiceMap[T]["service"];
export type RepositoryType<T extends ServiceName> = ServiceMap[T]["repository"];
export type CacheType<T extends ServiceName> = ServiceMap[T]["cache"];

export interface ServiceTestContext<T extends ServiceName> {
  container: AwilixContainer;
  service: ServiceType<T>;
  repository: RepositoryType<T>;
  cache: CacheType<T>;
  cacheService: CacheService;
  redisClient: RedisClientType;
}
