import { ListRepositoryRedis } from "./redis/listRepositoryRedis";
import { TaskRepositoryRedis } from "./redis/taskRepositoryRedis";
import { UserRepositoryRedis } from "./redis/userRepositoryRedis";
import { IListRepository } from "../interfaces/listRepository";
import { ITaskRepository } from "../interfaces/taskRepository";
import { IUserRepository } from "../interfaces/userRepository";
import { ListRepositoryMongo } from "./mongo/listRepositoryMongo";
import { TaskRepositoryMongo } from "./mongo/taskRepositoryMongo";
import { UserRepositoryMongo } from "./mongo/userRepositoryMongo";

let listRepositoryInstance: IListRepository | null = null;
let taskRepositoryInstance: ITaskRepository | null = null;
let userRepositoryInstance: IUserRepository | null = null;

export class RepositoryFactory {
  static createListRepository(): IListRepository {
    if (!listRepositoryInstance) {
      const dbType = process.env.DB_TYPE || "redis";
      switch (dbType) {
        case "redis":
          listRepositoryInstance = new ListRepositoryRedis();
          break;
        case "mongo":
          listRepositoryInstance = new ListRepositoryMongo();
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
        case "mongo":
          taskRepositoryInstance = new TaskRepositoryMongo();
          break;
        default:
          throw new Error(`Unsupported DB_TYPE: ${dbType}`);
      }
    }

    return taskRepositoryInstance;
  }

  static createUserRepository(): IUserRepository {
    if (!userRepositoryInstance) {
      const dbType = process.env.DB_TYPE || "redis";
      switch (dbType) {
        case "redis":
          userRepositoryInstance = new UserRepositoryRedis();
          break;
        case "mongo":
          userRepositoryInstance = new UserRepositoryMongo();
          break;
        default:
          throw new Error(`Unsupported DB_TYPE: ${dbType}`);
      }
    }

    return userRepositoryInstance;
  }

  static resetInstances(): void {
    listRepositoryInstance = null;
    taskRepositoryInstance = null;
  }
}
