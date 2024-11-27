import { Task } from "../models/taskModel";
import { redisClient } from "../config";
import { REDIS_KEYS } from "../utils/redisKeys";
import { MOCK_USER_ID } from "./constants";
import { List } from "@src/models/listModel";

// FIX ME: This script is not working as expected
const populateRedis = async () => {
  if (process.env.USE_MOCK !== "true") {
    console.log("Skipping mock data population (USE_MOCK is not true).");
    return;
  }

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    await redisClient.flushAll();

    const userId = MOCK_USER_ID;

    const tasks: Task[] = [
      {
        id: "1",
        listId: "list-1",
        text: "Mock Task 1",
        completed: "false",
        creationDate: Date.now(),
      },
      {
        id: "2",
        listId: "list-1",
        text: "Mock Task 2",
        completed: "true",
        creationDate: Date.now(),
      },
      {
        id: "3",
        listId: "list-2",
        text: "Mock Task 3",
        completed: "false",
        creationDate: Date.now(),
      },
    ];

    const lists: List[] = [
      { id: "list-1", name: "Mock List 1", creationDate: Date.now() },
      { id: "list-2", name: "Mock List 2", creationDate: Date.now() },
    ];

    const multi = redisClient.multi();

    for (const list of lists) {
      const listKey = REDIS_KEYS.LIST(userId, list.id);
      const listsKey = REDIS_KEYS.LISTS(userId);

      multi.hSet(listKey, { ...list, creationDate: String(list.creationDate) });

      multi.zAdd(listsKey, {
        score: list.creationDate as number,
        value: listKey,
      });
    }

    for (const task of tasks) {
      const taskKey = REDIS_KEYS.TASK(userId, task.id);
      const taskListKey = REDIS_KEYS.TASK_LIST(userId, task.listId);
      multi.hSet(taskKey, {
        id: task.id,
        listId: task.listId,
        text: task.text,
        completed: task.completed,
        creationDate: String(task.creationDate),
      });

      multi.rPush(taskListKey, taskKey);
    }

    const results = await multi.exec();
    console.log("Mock data populated:", results);
  } catch (err) {
    console.error("Error populating Redis:", err);
  } finally {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
    process.exit(0);
  }
};

populateRedis();
