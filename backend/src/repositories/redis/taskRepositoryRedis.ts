import { ITaskRepository } from "../interfaces/taskRepository";
import { getDatabaseClient } from "../../config/database";
import { REDIS_KEYS } from "../../utils/redisKeys";
import { Task, ClientTask, SearchResults } from "../../models/taskModel";
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
    const creationDate = Date.now();
    const task: Task = { id, listId, text, completed: "false", creationDate };

    const taskKey = REDIS_KEYS.TASK(userId, task.id);
    const redisTask = { ...task, completed: task.completed };

    await this.redisClient
      .multi()
      .hSet(taskKey, redisTask)
      .rPush(REDIS_KEYS.TASK_LIST(userId, task.listId), taskKey)
      .exec();

    return {
      ...task,
      completed: task.completed === "true",
    };
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
    return tasks.map((task) => ({
      ...task,
      completed: task.completed === "true",
      creationDate: Number(task.creationDate),
    })) as ClientTask[];
  }

  async getTasksSearchResults(
    userId: string,
    search: string
  ): Promise<SearchResults> {
    if (!search || !userId) return [];

    const taskKeys = await this.redisClient.keys(REDIS_KEYS.TASK(userId, "*"));

    const tasks: ClientTask[] = (
      await Promise.all(
        taskKeys.map(async (taskKey) => {
          const task = await this.redisClient.hGetAll(taskKey);

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
        const listName = await this.redisClient.hGet(
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
  }

  async updateTask(
    userId: string,
    taskId: string,
    updates: Partial<Task>
  ): Promise<string> {
    const taskKey = REDIS_KEYS.TASK(userId, taskId);
    const existingTask = await this.redisClient.hGetAll(taskKey);
    if (!existingTask.id) throw new Error(`Task with ID ${taskKey} not found`);

    const updatedTask = {
      ...existingTask,
      ...updates,
      completed: updates.completed ?? existingTask.completed,
    };
    await this.redisClient.hSet(taskKey, updatedTask);

    return updatedTask.id as Task["id"];
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
    const taskIds = await this.redisClient.lRange(taskListKey, 0, -1);
    const reorderedTaskIds = reorderArray(taskIds, oldIndex, newIndex);

    await this.redisClient
      .multi()
      .del(taskListKey)
      .rPush(taskListKey, reorderedTaskIds)
      .exec();

    return await this.getTasks(userId, listId);
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
