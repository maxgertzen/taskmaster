import { redisClient } from "../config";
import { Task } from "../models/taskModel";
import { reorderArray } from "../utils/reorderArray";

export const createTask = async (
  listId: string,
  text: string
): Promise<Task> => {
  const taskId = `task:${Date.now()}`;
  const task: Task = { id: taskId, listId, text, completed: "false" };

  const redisTask = {
    ...task,
    completed: task.completed.toString(),
  };
  await redisClient.hSet(taskId, redisTask);

  await redisClient.rPush(`tasks:${listId}`, taskId);

  return task;
};

export const getTasks = async (listId: string): Promise<Task[]> => {
  const taskIds = await redisClient.lRange(`tasks:${listId}`, 0, -1);

  const tasks = await Promise.all(
    taskIds.map((taskId) => redisClient.hGetAll(taskId))
  );

  return tasks.map((task) => ({
    id: task.id,
    listId: task.listId,
    text: task.text,
    completed: task.completed,
  })) as Task[];
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Task>
): Promise<Task["id"]> => {
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
): Promise<Task[]> => {
  const taskIds = await redisClient.lRange(`tasks:${listId}`, 0, -1);
  const reorderedTaskIds = reorderArray(taskIds, oldIndex, newIndex);

  await redisClient.del(`tasks:${listId}`);
  await redisClient.rPush(`tasks:${listId}`, reorderedTaskIds);

  return await getTasks(listId);
};
