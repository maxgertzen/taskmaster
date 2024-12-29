import mongoose from "mongoose";
import { createClient, RedisClientType } from "redis";
import { createMongoIndexes } from "./mongoIndexes";
import { DatabaseError, InternalServerError } from "@src/errors";

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
        if (mongoose.connection.readyState === 0) {
          await mongoose.connect(process.env.MONGODB_URI);
        }

        await mongoose.connection.db?.admin()?.command?.({ ping: 1 });
        console.log(
          "Pinged your deployment. You successfully connected to MongoDB!"
        );

        if (process.env.NODE_ENV !== "production") {
          await createMongoIndexes();
        }

        await initializeCache();
        break;
      default:
        throw new DatabaseError("Invalid DB Type");
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

const getRedisClient = () => {
  if (!dbClient) {
    throw new InternalServerError("Database not initialized");
  }

  return dbClient;
};

const getCacheClient = () => {
  if (!cacheClient) {
    throw new InternalServerError("Cache not initialized");
  }
  return cacheClient;
};

export { initializeDatabase, getRedisClient, getCacheClient };
