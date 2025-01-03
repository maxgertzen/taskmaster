import {
  createContainer,
  asClass,
  asFunction,
  InjectionMode,
  asValue,
  AwilixContainer,
} from "awilix";
import { CacheService } from "../services/cache/cacheService";
import { ListsCache, TasksCache, UsersCache } from "../services/cache";
import { ListsService, TasksService, UsersService } from "../services";
import { RepositoryFactory } from "../repositories";
import { makeListsController } from "../controllers/listController";
import { makeTasksController } from "../controllers/taskController";
import { getCacheClient } from "../config/database";
import { ContainerType } from "@src/types/container";
import { ServiceUnavailableError } from "@src/errors";

let containerInstance: AwilixContainer<ContainerType> | null = null;

const createAppContainer = async () => {
  if (containerInstance) return containerInstance;

  const container = createContainer<ContainerType>({
    injectionMode: InjectionMode.CLASSIC,
    strict: true,
  });

  container.register({
    redisClient: asFunction(getCacheClient).singleton(),
  });

  container.register({
    cacheService: asClass(CacheService)
      .singleton()
      .inject(() => ({
        client: container.cradle.redisClient,
      })),
  });

  container.register({
    listRepository: asValue(RepositoryFactory.createListRepository()),
    taskRepository: asValue(RepositoryFactory.createTaskRepository()),
    userRepository: asValue(RepositoryFactory.createUserRepository()),
  });

  container.register({
    listsCache: asClass(ListsCache)
      .singleton()
      .inject(() => ({
        cacheService: container.cradle.cacheService,
      })),
    tasksCache: asClass(TasksCache)
      .singleton()
      .inject(() => ({
        cacheService: container.cradle.cacheService,
      })),
    usersCache: asClass(UsersCache)
      .singleton()
      .inject(() => ({
        cacheService: container.cradle.cacheService,
      })),
  });

  container.register({
    listsService: asClass(ListsService)
      .singleton()
      .inject(() => ({
        repository: container.cradle.listRepository,
        cache: container.cradle.listsCache,
      })),
    tasksService: asClass(TasksService)
      .singleton()
      .inject(() => ({
        repository: container.cradle.taskRepository,
        cache: container.cradle.tasksCache,
      })),
    usersService: asClass(UsersService)
      .singleton()
      .inject(() => ({
        repository: container.cradle.userRepository,
        cache: container.cradle.usersCache,
      })),
  });

  container.register({
    listsController: asFunction(makeListsController).proxy(),
    tasksController: asFunction(makeTasksController).proxy(),
  });

  containerInstance = container;

  return container;
};

export const getAppContainer = () => {
  if (!containerInstance) {
    throw new ServiceUnavailableError("Container not initialized");
  }
  return containerInstance;
};

export const initializeContainer = () => {
  console.log("Initializing DI container...");
  return createAppContainer();
};
