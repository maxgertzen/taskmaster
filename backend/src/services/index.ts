import { RepositoryFactory } from "../repositories";
import { ListService } from "./listsService";
import { TaskService } from "./tasksService";
import { UserService } from "./userService";

let listServiceInstance: ListService | null = null;
let taskServiceInstance: TaskService | null = null;
let userServiceInstance: UserService | null = null;

export const getListService = (): ListService => {
  if (!listServiceInstance) {
    listServiceInstance = new ListService(
      RepositoryFactory.createListRepository()
    );
  }
  return listServiceInstance;
};

export const getTaskService = (): TaskService => {
  if (!taskServiceInstance) {
    taskServiceInstance = new TaskService(
      RepositoryFactory.createTaskRepository()
    );
  }
  return taskServiceInstance;
};

export const getUserService = (): UserService => {
  if (!userServiceInstance) {
    userServiceInstance = new UserService(
      RepositoryFactory.createUserRepository()
    );
  }
  return userServiceInstance;
};
