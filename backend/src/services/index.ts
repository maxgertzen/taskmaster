import { RepositoryFactory } from "../repositories";
import { ListService } from "./listsService";
import { TaskService } from "./tasksService";

const listRepository = RepositoryFactory.createListRepository();
const taskRepository = RepositoryFactory.createTaskRepository();

export const listService = new ListService(listRepository);
export const taskService = new TaskService(taskRepository);
