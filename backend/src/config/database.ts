import mongoose from "mongoose";
import { createClient, RedisClientType } from "redis";

let dbClient: RedisClientType | null = null;
let cacheClient: RedisClientType | null = null;
let isInitializing = false;
let isCacheInitializing = false;

const initializeDatabase = async () => {
  if (dbClient) {
    return;
  }

  if (isInitializing) {
    console.log("Database is initializing...");

    while (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return;
  }

  isInitializing = true;
  const dbType = process.env.DB_TYPE;

  try {
    switch (dbType) {
      case "redis":
        dbClient = createClient({
          password: process.env.REDIS_PASSWORD,
          socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
          },
        });

        dbClient.on("error", (err) =>
          console.error("Redis Client Error:", err)
        );
        await dbClient.connect();
        console.log("Connected to Redis");
        break;
      case "mongo":
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        await initializeCache();
        break;
      default:
        throw new Error("Invalid DB Type");
    }
  } catch (error) {
    console.error("Failed to initialize database:", error);
    dbClient = null;
    throw error;
  } finally {
    isInitializing = false;
  }
};

const initializeCache = async () => {
  if (cacheClient) return;

  if (isCacheInitializing) {
    while (isCacheInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return;
  }

  isCacheInitializing = true;

  try {
    cacheClient = createClient({
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
      database: 1,
    });

    cacheClient.on("error", (err) => {
      console.error("Redis Cache Client Error:", err);
    });

    await cacheClient.connect();
    console.log("Connected to Redis Cache");
  } catch (error) {
    console.error("Failed to initialize cache:", error);
    cacheClient = null;
    throw error;
  } finally {
    isCacheInitializing = false;
  }
};

const getDatabaseClient = () => {
  if (!dbClient) {
    throw new Error("Database not initialized");
  }

  return dbClient;
};

const getCacheClient = () => {
  if (!cacheClient) {
    throw new Error("Cache not initialized");
  }
  return cacheClient;
};

export { initializeDatabase, getDatabaseClient, getCacheClient };
