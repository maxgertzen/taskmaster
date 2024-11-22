import { generateUniqueId } from "../utils/nanoid";
import { redisClient } from "../config";
import { ClientTask, Task } from "../models/taskModel";
import { reorderArray } from "../utils/reorderArray";
import { REDIS_KEYS } from "../utils/redisKeys";

export const createTask = async (
  userId: string,
  listId: string,
  text: string
): Promise<ClientTask> => {
  const id = await generateUniqueId();
  const taskKey = REDIS_KEYS.TASK(userId, id);
  const creationDate = Date.now();
  const task: Task = {
    id,
    listId,
    text,
    completed: "false",
    creationDate,
  };

  const redisTask = {
    ...task,
    completed: task.completed,
  };
  await redisClient.hSet(taskKey, redisTask);

  await redisClient.rPush(REDIS_KEYS.TASK_LIST(userId, listId), taskKey);

  return {
    ...task,
    completed: task.completed === "true",
  };
};

export const getTasks = async (
  userId: string,
  listId: string
): Promise<ClientTask[]> => {
  const taskIds = await redisClient.lRange(
    REDIS_KEYS.TASK_LIST(userId, listId),
    0,
    -1
  );

  const tasks = await Promise.all(
    taskIds.map((taskId) => redisClient.hGetAll(taskId))
  );

  return tasks.map((task) => ({
    ...task,
    completed: task.completed === "true",
  })) as ClientTask[];
};

export const updateTask = async (
  userId: string,
  taskId: string,
  updates: Partial<Task>
): Promise<ClientTask["id"]> => {
  const taskKey = REDIS_KEYS.TASK(userId, taskId);
  const existingTask = await redisClient.hGetAll(taskKey);
  if (!existingTask.id) throw new Error(`Task with ID ${taskKey} not found`);

  const updatedTask: Partial<Task> = {
    ...existingTask,
    ...updates,
    completed: updates.completed ?? existingTask.completed,
  };

  await redisClient.hSet(taskKey, updatedTask);

  return updatedTask.id as Task["id"];
};

export const deleteTask = async (
  userId: string,
  taskId: string,
  listId: string
): Promise<ClientTask["id"]> => {
  await redisClient.del(taskId);
  await redisClient.lRem(REDIS_KEYS.TASK_LIST(userId, listId), 0, taskId);

  return taskId;
};

export const reorderTasks = async (
  userId: string,
  listId: string,
  oldIndex: number,
  newIndex: number
): Promise<ClientTask[]> => {
  const taskListKey = REDIS_KEYS.TASK_LIST(userId, listId);
  const taskIds = await redisClient.lRange(taskListKey, 0, -1);
  const reorderedTaskIds = reorderArray(taskIds, oldIndex, newIndex);

  await redisClient.del(taskListKey);
  await redisClient.rPush(taskListKey, reorderedTaskIds);

  return await getTasks(userId, listId);
};

export const toggleCompleteAll = async (
  userId: string,
  listId: string,
  newCompletedState: boolean
): Promise<ClientTask[]> => {
  const taskIds = await redisClient.lRange(
    REDIS_KEYS.TASK_LIST(userId, listId),
    0,
    -1
  );

  if (taskIds.length === 0) return [];

  const multi = redisClient.multi();

  taskIds.forEach((taskId) => {
    multi.hSet(taskId, { completed: newCompletedState.toString() });
  });

  await multi.exec();

  return await getTasks(userId, listId);
};

export const bulkDelete = async (
  userId: string,
  listId: string,
  mode: "all" | "completed"
): Promise<ClientTask[]> => {
  const taskListKey = REDIS_KEYS.TASK_LIST(userId, listId);
  const taskIds = await redisClient.lRange(taskListKey, 0, -1);

  if (taskIds.length === 0) return [];

  const multi = redisClient.multi();

  if (mode === "completed") {
    const completedTasks = await Promise.all(
      taskIds.map(async (taskId) => {
        const task = await redisClient.hGetAll(taskId);
        return task;
      })
    );

    const completedTaskIds = completedTasks
      .filter((task) => task.completed === "true")
      .map((task) => task.id);

    completedTaskIds.forEach((taskId) => {
      multi.lRem(taskListKey, 0, REDIS_KEYS.TASK(userId, taskId));
      multi.del(taskId);
    });
  } else {
    taskIds.forEach((taskId) => multi.del(taskId));
  }

  await multi.exec();

  return await getTasks(userId, listId);
};
