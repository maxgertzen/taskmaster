import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { RedisClientType } from "redis";
import { RedisMemoryServer } from "redis-memory-server";
import {
  createContainer,
  asFunction,
  InjectionMode,
  asValue,
  AwilixContainer,
  asClass,
} from "awilix";
import { Express } from "express";
import { Server } from "http";
import request from "supertest";
import { createMongoIndexes } from "@src/config/mongoIndexes";
import { CacheService } from "@src/services/cache/cacheService";
import { ListsCache, TasksCache, UsersCache } from "@src/services/cache";
import { ListsService, TasksService, UsersService } from "@src/services";
import { RepositoryFactory } from "@src/repositories";
import { makeListsController } from "@src/controllers/listController";
import { makeTasksController } from "@src/controllers/taskController";
import createApp from "@src/app";
import type { ContainerType } from "@src/types/container";
import { createClient } from "redis";

interface TestEnvironment {
  app: Express;
  server: Server;
  container: AwilixContainer<ContainerType>;
  redisClient: RedisClientType;
  mongoServer?: MongoMemoryServer;
}

let testEnv: TestEnvironment | null = null;

const setupMongoEnvironment = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  try {
    await mongoose.connect(mongoUri);
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection failed");
    }
    console.log("MongoDB connected:", mongoUri);
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    throw error;
  }

  await mongoose.connection.db?.admin()?.command?.({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");

  await createMongoIndexes();
  return mongoServer;
};

const setupRedisEnvironment = async () => {
  const redisServer = await RedisMemoryServer.create();
  const host = await redisServer.getHost();
  const port = await redisServer.getPort();
  const redisClient = createClient({
    url: `redis://${host}:${port}`,
    socket: {
      reconnectStrategy: false,
    },
  });

  redisClient.connect();

  await new Promise<void>((resolve) => {
    redisClient.on("connect", () => {
      console.log("Test Redis DB Client connected");
      resolve();
    });
  });

  return redisClient;
};

export const setupTestEnvironment = async (
  dbType: "mongo" | "redis" = global.testDbType
) => {
  let mongoServer: MongoMemoryServer | undefined;
  let redisClient: RedisClientType | undefined;

  if (dbType === "mongo") {
    mongoServer = await setupMongoEnvironment();
  }

  redisClient = (await setupRedisEnvironment()) as RedisClientType;

  const container = createContainer<ContainerType>({
    injectionMode: InjectionMode.CLASSIC,
    strict: true,
  });

  container.register({
    redisClient: asValue(redisClient),
  });

  container.register({
    cacheService: asClass(CacheService)
      .singleton()
      .inject(() => ({
        client: container.cradle.redisClient,
      })),
  });

  container.register({
    listRepository: asValue(RepositoryFactory.createListRepository(dbType)),
    taskRepository: asValue(RepositoryFactory.createTaskRepository(dbType)),
    userRepository: asValue(RepositoryFactory.createUserRepository(dbType)),
  });

  container.register({
    listsCache: asClass(ListsCache)
      .singleton()
      .inject(() => ({ cacheService: container.cradle.cacheService })),
    tasksCache: asClass(TasksCache)
      .singleton()
      .inject(() => ({ cacheService: container.cradle.cacheService })),
    usersCache: asClass(UsersCache)
      .singleton()
      .inject(() => ({ cacheService: container.cradle.cacheService })),
  });

  container.register({
    tasksService: asClass(TasksService)
      .singleton()
      .inject(() => ({
        repository: container.cradle.taskRepository,
        cache: container.cradle.tasksCache,
      })),
    listsService: asClass(ListsService)
      .singleton()
      .inject(() => ({
        repository: container.cradle.listRepository,
        cache: container.cradle.listsCache,
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

  const app = await createApp(container);
  const server = app.listen(0);

  testEnv = {
    app,
    server,
    container,
    redisClient,
    mongoServer,
  };

  return testEnv;
};

export const teardownTestEnvironment = async () => {
  if (!testEnv) return;

  await new Promise<void>((resolve) => {
    testEnv?.server?.close(() => resolve());
  });

  if (testEnv.mongoServer) {
    await mongoose.disconnect();
    await testEnv.mongoServer.stop();
  }

  await testEnv.redisClient?.quit();

  testEnv = null;
};

export const clearTestData = async () => {
  if (!testEnv) return;

  if (testEnv.mongoServer) {
    const collections = mongoose.connection.collections;
    await Promise.all(
      Object.values(collections).map((collection) => collection.deleteMany({}))
    );
  }

  await testEnv.redisClient?.flushAll();
};

export const makeTestRequest = () => {
  if (!testEnv?.app) {
    throw new Error("Test environment not initialized");
  }
  return request(testEnv.app);
};

export const getTestContainer = () => {
  if (!testEnv?.container) {
    throw new Error("Test container not initialized");
  }
  return testEnv.container;
};
