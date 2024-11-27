import { ListRepositoryRedis } from "./redis/listRepositoryRedis";
import { TaskRepositoryRedis } from "./redis/taskRepositoryRedis";
import { IListRepository } from "./interfaces/listRepository";
import { ITaskRepository } from "./interfaces/taskRepository";

let listRepositoryInstance: IListRepository | null = null;
let taskRepositoryInstance: ITaskRepository | null = null;

export class RepositoryFactory {
  static createListRepository(): IListRepository {
    if (!listRepositoryInstance) {
      const dbType = process.env.DB_TYPE || "redis";
      switch (dbType) {
        case "redis":
          listRepositoryInstance = new ListRepositoryRedis();
          break;
        default:
          throw new Error(`Unsupported DB_TYPE: ${dbType}`);
      }
    }
    return listRepositoryInstance;
  }

  static createTaskRepository(): ITaskRepository {
    if (!taskRepositoryInstance) {
      const dbType = process.env.DB_TYPE || "redis";
      switch (dbType) {
        case "redis":
          taskRepositoryInstance = new TaskRepositoryRedis();
          break;
        default:
          throw new Error(`Unsupported DB_TYPE: ${dbType}`);
      }
    }

    return taskRepositoryInstance;
  }
}
