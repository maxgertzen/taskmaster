import { ListRepositoryRedis } from "./redis/listRepositoryRedis";
import { TaskRepositoryRedis } from "./redis/taskRepositoryRedis";
import { IListRepository } from "./interfaces/listRepository";
import { ITaskRepository } from "./interfaces/taskRepository";

export class RepositoryFactory {
  static createListRepository(): IListRepository {
    const dbType = process.env.DB_TYPE || "redis";
    switch (dbType) {
      case "redis":
        return new ListRepositoryRedis();
      default:
        throw new Error(`Unsupported DB_TYPE: ${dbType}`);
    }
  }

  static createTaskRepository(): ITaskRepository {
    const dbType = process.env.DB_TYPE || "redis";
    switch (dbType) {
      case "redis":
        return new TaskRepositoryRedis();
      default:
        throw new Error(`Unsupported DB_TYPE: ${dbType}`);
    }
  }
}
