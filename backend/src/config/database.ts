import { createClient, RedisClientType } from "redis";

let dbClient: RedisClientType | null = null;
let isInitializing = false;

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

const getDatabaseClient = () => {
  if (!dbClient) {
    throw new Error("Database not initialized");
  }

  return dbClient;
};

export { initializeDatabase, getDatabaseClient };
