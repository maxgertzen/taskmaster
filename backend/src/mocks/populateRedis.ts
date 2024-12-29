import { getRedisClient, initializeDatabase } from "../config/database";
import { REDIS_KEYS } from "../utils/redisKeys";
import { MOCK_USER_ID } from "./constants";
import { BaseList, BaseTask } from "../interfaces/entities";
import { RedisClientType } from "redis";

const populateRedis = async () => {
  if (process.env.NODE_ENV === "production") {
    console.error("Error: populateRedis should not be run in production!");
    return;
  }

  if (process.env.DB_TYPE !== "redis") {
    console.log("Skipping Redis population: DB_TYPE is not 'redis'.");
    return;
  }

  if (process.env.IS_AUTH0_DISABLED !== "true") {
    console.log(
      "Skipping mock data population (IS_AUTH0_DISABLED is not true)."
    );
    return;
  }

  let redisClient: RedisClientType | null = null;

  try {
    await initializeDatabase();
    redisClient = getRedisClient();

    await redisClient.flushAll();

    const userId = MOCK_USER_ID;

    const userKey = REDIS_KEYS.USER(userId);
    await redisClient.hSet(userKey, {
      auth0Id: userId,
      email: "mock@example.com",
      name: "Mock User",
      preferences: JSON.stringify({
        theme: "light",
        notifications: true,
      }),
    });

    const tasks: BaseTask[] = [
      {
        id: "1",
        listId: "list-1",
        text: "Mock Task 1",
        completed: "false",
        creationDate: new Date().toISOString(),
        userId,
        orderIndex: 0,
      },
      {
        id: "2",
        listId: "list-1",
        text: "Mock Task 2",
        completed: "true",
        creationDate: new Date().toISOString(),
        userId,
        orderIndex: 1,
      },
      {
        id: "3",
        listId: "list-2",
        text: "Mock Task 3",
        completed: "false",
        creationDate: new Date().toISOString(),
        userId,
        orderIndex: 2,
      },
    ];

    const lists: BaseList[] = [
      {
        id: "list-1",
        name: "Mock List 1",
        creationDate: new Date().toISOString(),
        userId,
        orderIndex: 0,
      },
      {
        id: "list-2",
        name: "Mock List 2",
        creationDate: new Date().toISOString(),
        userId,
        orderIndex: 1,
      },
    ];

    const multi = redisClient.multi();

    for (const list of lists) {
      const listKey = REDIS_KEYS.LIST(userId, list.id);
      const listsKey = REDIS_KEYS.LISTS(userId);

      multi.hSet(listKey, Object.entries(list).flat());
      multi.zAdd(listsKey, {
        score: list.orderIndex,
        value: listKey,
      });
    }

    for (const task of tasks) {
      const taskKey = REDIS_KEYS.TASK(userId, task.id);
      const taskListKey = REDIS_KEYS.TASK_LIST(userId, task.listId);

      multi.hSet(taskKey, Object.entries(task).flat());
      multi.rPush(taskListKey, taskKey);
    }

    const results = await multi.exec();
    console.log("Mock data populated:", results);
  } catch (err) {
    console.error("Error populating Redis:", err);
  } finally {
    if (redisClient?.isOpen) {
      await redisClient.quit();
      console.log("PopulateScript: Redis connection closed");
    }
  }
};

populateRedis();
