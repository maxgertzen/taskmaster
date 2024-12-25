import { RepositoryFactory } from "../repositories";
import { ListsService } from "./listsService";
import { TasksService } from "./tasksService";
import { UsersService } from "./usersService";

let listServiceInstance: ListsService | null = null;
let taskServiceInstance: TasksService | null = null;
let userServiceInstance: UsersService | null = null;

export const getListsService = (): ListsService => {
  if (!listServiceInstance) {
    listServiceInstance = new ListsService(
      RepositoryFactory.createListRepository()
    );
  }
  return listServiceInstance;
};

export const getTasksService = (): TasksService => {
  if (!taskServiceInstance) {
    taskServiceInstance = new TasksService(
      RepositoryFactory.createTaskRepository()
    );
  }
  return taskServiceInstance;
};

export const getUsersService = (): UsersService => {
  if (!userServiceInstance) {
    userServiceInstance = new UsersService(
      RepositoryFactory.createUserRepository()
    );
  }
  return userServiceInstance;
};
