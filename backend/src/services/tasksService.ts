import { generateUniqueId } from "../utils/nanoid";
import { redisClient } from "../config";
import { ClientTask, SearchResults, Task } from "../models/taskModel";
import { reorderArray } from "../utils/reorderArray";
import { REDIS_KEYS } from "../utils/redisKeys";
import { GetTasksRequestQuery } from "../types/requests";

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

  const multi = redisClient
    .multi()
    .hSet(taskKey, redisTask)
    .rPush(REDIS_KEYS.TASK_LIST(userId, listId), taskKey);

  await multi.exec();

  return {
    ...task,
    completed: task.completed === "true",
  };
};

export const getTasks = async (
  userId: string,
  listId: string,
  options?: GetTasksRequestQuery
): Promise<ClientTask[]> => {
  const taskIds = await redisClient.lRange(
    REDIS_KEYS.TASK_LIST(userId, listId),
    0,
    -1
  );

  if (taskIds.length === 0) return [];

  const tasks = await Promise.all(
    taskIds.map((taskId) => redisClient.hGetAll(taskId))
  );

  let clientTransformedTasks = tasks.map((task) => ({
    ...task,
    completed: task.completed === "true",
  })) as ClientTask[];

  if (options?.filter) {
    clientTransformedTasks = clientTransformedTasks.filter((task) =>
      options.filter === "completed" ? task.completed : !task.completed
    );
  }

  if (options?.sort) {
    clientTransformedTasks.sort((a, b) =>
      options.sort === "asc"
        ? a.text.localeCompare(b.text)
        : b.text.localeCompare(a.text)
    );
  }

  return clientTransformedTasks;
};

export const getTasksSearchResults = async (
  userId: string,
  search: string
): Promise<SearchResults> => {
  if (!search || !userId) return [];

  const taskKeys = await redisClient.keys(REDIS_KEYS.TASK(userId, "*"));

  const tasks: ClientTask[] = (
    await Promise.all(
      taskKeys.map(async (taskKey) => {
        const task = await redisClient.hGetAll(taskKey);

        if (task.text?.toLowerCase().includes(search.toLowerCase())) {
          return {
            id: taskKey.split(":").pop() || "",
            text: task.text || "",
            listId: task.listId || "",
            completed: task.completed === "true",
            creationDate: task.creationDate
              ? Number(task.creationDate)
              : Date.now(),
          } as ClientTask;
        }

        return null;
      })
    )
  ).filter(Boolean) as ClientTask[];

  const groupedByListId: { [listId: string]: ClientTask[] } = {};
  tasks.forEach((task) => {
    if (!groupedByListId[task.listId]) {
      groupedByListId[task.listId] = [];
    }
    groupedByListId[task.listId].push(task);
  });

  const listNameCache: { [listId: string]: string } = {};
  await Promise.all(
    Object.keys(groupedByListId).map(async (listId) => {
      const listName = await redisClient.hGet(
        REDIS_KEYS.LIST(userId, listId),
        "name"
      );
      listNameCache[listId] = listName || "Unnamed List";
    })
  );

  return Object.entries(groupedByListId).map(([listId, tasks]) => ({
    listName: listNameCache[listId],
    tasks,
  }));
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
  const multi = redisClient
    .multi()
    .del(REDIS_KEYS.TASK(userId, taskId))
    .lRem(REDIS_KEYS.TASK_LIST(userId, listId), 0, taskId);

  await multi.exec();

  return taskId;
};

export const reorderTasks = async (
  userId: string,
  listId: string,
  oldIndex: number,
  newIndex: number
): Promise<ClientTask[]> => {
  const multi = redisClient.multi();

  const taskListKey = REDIS_KEYS.TASK_LIST(userId, listId);
  const taskIds = await redisClient.lRange(taskListKey, 0, -1);
  const reorderedTaskIds = reorderArray(taskIds, oldIndex, newIndex);

  multi.del(taskListKey).rPush(taskListKey, reorderedTaskIds).exec();

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
