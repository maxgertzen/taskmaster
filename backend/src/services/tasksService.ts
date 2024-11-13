import { generateUniqueId } from "../utils/nanoid";
import { redisClient } from "../config";
import { ClientTask, Task } from "../models/taskModel";
import { reorderArray } from "../utils/reorderArray";

export const createTask = async (
  listId: string,
  text: string
): Promise<ClientTask> => {
  const id = await generateUniqueId();
  const taskKey = `task:${id}`;
  const task: Task = { id: taskKey, listId, text, completed: "false" };

  const redisTask = {
    ...task,
    completed: task.completed,
  };
  await redisClient.hSet(taskKey, redisTask);

  await redisClient.rPush(`tasks:${listId}`, taskKey);

  return {
    ...task,
    completed: task.completed === "true",
  };
};

export const getTasks = async (listId: string): Promise<ClientTask[]> => {
  const taskIds = await redisClient.lRange(`tasks:${listId}`, 0, -1);

  const tasks = await Promise.all(
    taskIds.map((taskId) => redisClient.hGetAll(taskId))
  );

  return tasks.map((task) => ({
    id: task.id,
    listId: task.listId,
    text: task.text,
    completed: task.completed === "true",
  })) as ClientTask[];
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Task>
): Promise<ClientTask["id"]> => {
  const existingTask = await redisClient.hGetAll(taskId);
  if (!existingTask.id) throw new Error(`Task with ID ${taskId} not found`);

  const updatedTask: Partial<Task> = {
    ...existingTask,
    ...updates,
    completed: updates.completed ?? existingTask.completed,
  };

  await redisClient.hSet(taskId, updatedTask);

  return updatedTask.id as Task["id"];
};

export const deleteTask = async (
  taskId: string,
  listId: string
): Promise<void> => {
  await redisClient.del(taskId);
  await redisClient.lRem(`tasks:${listId}`, 0, taskId);
};

export const reorderTasks = async (
  listId: string,
  oldIndex: number,
  newIndex: number
): Promise<ClientTask[]> => {
  const taskIds = await redisClient.lRange(`tasks:${listId}`, 0, -1);
  const reorderedTaskIds = reorderArray(taskIds, oldIndex, newIndex);

  await redisClient.del(`tasks:${listId}`);
  await redisClient.rPush(`tasks:${listId}`, reorderedTaskIds);

  return await getTasks(listId);
};
