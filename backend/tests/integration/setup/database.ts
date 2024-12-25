import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createClient } from "redis-mock";
import type { RedisClientType } from "redis";
import { createMongoIndexes } from "@src/config/mongoIndexes";

let mongoServer: MongoMemoryServer;
let dbClient: RedisClientType | null = null;
let cacheClient: RedisClientType | null = null;

export const setupTestDatabase = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);

  await createMongoIndexes();

  dbClient = createClient();
  cacheClient = createClient();

  await Promise.all([
    new Promise<void>((resolve) => {
      dbClient?.on("connect", () => {
        console.log("Test Redis DB Client connected");
        resolve();
      });
    }),
    new Promise<void>((resolve) => {
      cacheClient?.on("connect", () => {
        console.log("Test Redis Cache Client connected");
        resolve();
      });
    }),
  ]);
};

export const teardownTestDatabase = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();

  await Promise.all([dbClient?.quit(), cacheClient?.quit()]);

  dbClient = null;
  cacheClient = null;
};

export const clearTestDatabase = async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({}))
  );

  await Promise.all([dbClient?.flushDb(), cacheClient?.flushDb()]);
};

export const getTestRedisClient = () => {
  if (!dbClient) {
    throw new Error("Test database not initialized");
  }
  return dbClient;
};

export const getTestCacheClient = () => {
  if (!cacheClient) {
    throw new Error("Test cache not initialized");
  }
  return cacheClient;
};
