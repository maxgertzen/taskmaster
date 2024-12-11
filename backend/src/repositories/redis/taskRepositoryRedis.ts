import { ITaskRepository } from "../../interfaces/taskRepository";
import { getDatabaseClient } from "../../config/database";
import { REDIS_KEYS } from "../../utils/redisKeys";
import { BaseTask, ClientTask, SearchResults } from "../../interfaces/entities";
import { reorderArray } from "../../utils/reorderArray";
import { generateUniqueId } from "../../utils/nanoid";

export class TaskRepositoryRedis implements ITaskRepository {
  private redisClient = getDatabaseClient();

  async createTask(
    userId: string,
    listId: string,
    text: string
  ): Promise<ClientTask> {
    const id = await generateUniqueId();
    const creationDate = new Date().toISOString();

    const orderIndex = Date.now();

    const task: BaseTask = {
      id,
      text,
      completed: "false",
      creationDate,
      userId,
      listId,
      orderIndex,
    };

    const taskKey = REDIS_KEYS.TASK(userId, task.id);

    await this.redisClient
      .multi()
      .hSet(taskKey, Object.entries(task).flat())
      .rPush(REDIS_KEYS.TASK_LIST(userId, task.listId), taskKey)
      .exec();

    return { ...task, completed: false };
  }

  async getTasks(userId: string, listId: string): Promise<ClientTask[]> {
    const taskKeys = await this.redisClient.lRange(
      REDIS_KEYS.TASK_LIST(userId, listId),
      0,
      -1
    );

    if (!taskKeys.length) return [];

    const tasks = await Promise.all(
      taskKeys.map((key) => this.redisClient.hGetAll(key))
    );

    return tasks
      .map((task) => ({
        id: task.id,
        text: task.text,
        completed: task.completed === "true",
        creationDate: new Date(task.creationDate),
        userId: task.userId,
        listId: task.listId,
        orderIndex: Number(task.orderIndex),
      }))
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getTasksSearchResults(
    userId: string,
    search: string
  ): Promise<SearchResults> {
    if (!search || !userId) return [];

    const taskKeys = await this.redisClient.keys(REDIS_KEYS.TASK(userId, "*"));

    const tasks = await Promise.all(
      taskKeys.map(async (taskKey) => {
        const task = await this.redisClient.hGetAll(taskKey);

        if (task.text?.toLowerCase().includes(search.toLowerCase())) {
          return {
            id: taskKey.split(":").pop() || "",
            text: task.text || "",
            listId: task.listId || "",
            completed: task.completed === "true",
            creationDate: task.creationDate
              ? new Date(task.creationDate)
              : new Date(),
            userId: task.userId || "",
          } as ClientTask;
        }

        return null;
      })
    );

    const filteredTasks = tasks.filter(Boolean) as ClientTask[];

    const groupedByListId: { [listId: string]: ClientTask[] } = {};
    filteredTasks.forEach((task) => {
      if (!groupedByListId[task.listId]) {
        groupedByListId[task.listId] = [];
      }
      groupedByListId[task.listId].push(task);
    });

    const results: SearchResults = await Promise.all(
      Object.entries(groupedByListId).map(async ([listId, tasks]) => ({
        listName:
          (await this.redisClient.hGet(
            REDIS_KEYS.LIST(userId, listId),
            "name"
          )) || "Unnamed List",
        tasks,
      }))
    );

    return results;
  }

  async updateTask(
    userId: string,
    taskId: string,
    updates: Partial<BaseTask>
  ): Promise<string> {
    const taskKey = REDIS_KEYS.TASK(userId, taskId);
    const existingTask = await this.redisClient.hGetAll(taskKey);
    if (!existingTask.id) throw new Error(`Task with ID ${taskKey} not found`);

    const updatedTask = {
      ...existingTask,
      ...updates,
      completed: updates.completed ?? existingTask.completed,
    };

    const hSetObject: Record<string, string> = {};
    Object.entries(updatedTask).forEach(([key, value]) => {
      hSetObject[key] = value.toString();
    });

    await this.redisClient.hSet(taskKey, hSetObject);

    return taskId;
  }

  async deleteTask(
    userId: string,
    taskId: string,
    listId: string
  ): Promise<string> {
    const taskKey = REDIS_KEYS.TASK(userId, taskId);

    await this.redisClient
      .multi()
      .del(taskKey)
      .lRem(REDIS_KEYS.TASK_LIST(userId, listId), 0, taskKey)
      .exec();

    return taskId;
  }

  async reorderTasks(
    userId: string,
    listId: string,
    oldIndex: number,
    newIndex: number
  ): Promise<ClientTask[]> {
    const taskListKey = REDIS_KEYS.TASK_LIST(userId, listId);
    const taskKeys = await this.redisClient.lRange(taskListKey, 0, -1);

    const reorderedTaskKeys = reorderArray(taskKeys, oldIndex, newIndex);

    await this.redisClient
      .multi()
      .del(taskListKey)
      .rPush(taskListKey, reorderedTaskKeys)
      .exec();

    const reorderedTasks = await Promise.all(
      reorderedTaskKeys.map(async (key, index) => {
        const task = await this.redisClient.hGetAll(key);

        await this.redisClient.hSet(key, { orderIndex: index });

        return {
          id: task.id,
          text: task.text,
          completed: task.completed === "true",
          creationDate: new Date(task.creationDate),
          userId: task.userId,
          listId: task.listId,
          orderIndex: index,
        };
      })
    );

    return reorderedTasks.sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async toggleCompleteAll(
    userId: string,
    listId: string,
    newCompletedState: boolean
  ): Promise<ClientTask[]> {
    const taskListKey = REDIS_KEYS.TASK_LIST(userId, listId);
    const taskKeys = await this.redisClient.lRange(taskListKey, 0, -1);

    if (!taskKeys.length) return [];

    const multi = this.redisClient.multi();
    taskKeys.forEach((taskKey) =>
      multi.hSet(taskKey, { completed: newCompletedState.toString() })
    );
    await multi.exec();

    return await this.getTasks(userId, listId);
  }

  async bulkDelete(
    userId: string,
    listId: string,
    mode: "all" | "completed"
  ): Promise<ClientTask[]> {
    const taskListKey = REDIS_KEYS.TASK_LIST(userId, listId);
    const taskIds = await this.redisClient.lRange(taskListKey, 0, -1);

    if (!taskIds.length) return [];

    const multi = this.redisClient.multi();

    if (mode === "completed") {
      const completedTasks = await Promise.all(
        taskIds.map((taskId) => this.redisClient.hGetAll(taskId))
      );
      const completedTaskIds = completedTasks
        .filter((task) => task.completed === "true")
        .map((task) => task.id);

      completedTaskIds.forEach((taskId) => {
        multi.lRem(taskListKey, 0, REDIS_KEYS.TASK(userId, taskId));
        multi.del(REDIS_KEYS.TASK(userId, taskId));
      });
    } else {
      taskIds.forEach((taskId) => multi.del(REDIS_KEYS.TASK(userId, taskId)));
    }

    await multi.exec();

    return await this.getTasks(userId, listId);
  }
}
