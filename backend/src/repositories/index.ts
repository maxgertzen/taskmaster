import { ListRepositoryRedis } from "./redis/listRepositoryRedis";
import { TaskRepositoryRedis } from "./redis/taskRepositoryRedis";
import { UserRepositoryRedis } from "./redis/userRepositoryRedis";
import { IListRepository } from "../interfaces/listRepository";
import { ITaskRepository } from "../interfaces/taskRepository";
import { IUserRepository } from "../interfaces/userRepository";
import { ListRepositoryMongo } from "./mongo/listRepositoryMongo";
import { TaskRepositoryMongo } from "./mongo/taskRepositoryMongo";
import { UserRepositoryMongo } from "./mongo/userRepositoryMongo";
import { getRedisClient } from "@src/config/database";
import { DBType } from "@src/types/constants";

let listRepositoryInstance: IListRepository | null = null;
let taskRepositoryInstance: ITaskRepository | null = null;
let userRepositoryInstance: IUserRepository | null = null;

export class RepositoryFactory {
  static createListRepository(
    dbType: DBType = process.env.DB_TYPE || "mongo"
  ): IListRepository {
    if (!listRepositoryInstance) {
      switch (dbType) {
        case "redis":
          listRepositoryInstance = new ListRepositoryRedis(getRedisClient());
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

  static createTaskRepository(
    dbType: DBType = process.env.DB_TYPE || "mongo"
  ): ITaskRepository {
    if (!taskRepositoryInstance) {
      switch (dbType) {
        case "redis":
          taskRepositoryInstance = new TaskRepositoryRedis(getRedisClient());
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

  static createUserRepository(
    dbType: DBType = process.env.DB_TYPE || "mongo"
  ): IUserRepository {
    if (!userRepositoryInstance) {
      switch (dbType) {
        case "redis":
          userRepositoryInstance = new UserRepositoryRedis(getRedisClient());
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
