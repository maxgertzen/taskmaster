import { makeListsController } from "@src/controllers/listController";
import { makeTasksController } from "@src/controllers/taskController";
import { IListRepository } from "@src/interfaces/listRepository";
import { ITaskRepository } from "@src/interfaces/taskRepository";
import { IUserRepository } from "@src/interfaces/userRepository";
import { ListsService, TasksService, UsersService } from "@src/services";
import { ListsCache, TasksCache, UsersCache } from "@src/services/cache";
import { CacheService } from "@src/services/cache/cacheService";
import { RedisClientType } from "redis";

export interface ContainerType {
  redisClient: RedisClientType;
  cacheService: CacheService;
  listsCache: ListsCache;
  tasksCache: TasksCache;
  usersCache: UsersCache;
  listRepository: IListRepository;
  taskRepository: ITaskRepository;
  userRepository: IUserRepository;
  listsController: ReturnType<typeof makeListsController>;
  tasksController: ReturnType<typeof makeTasksController>;
  listsService: ListsService;
  tasksService: TasksService;
  usersService: UsersService;
}
