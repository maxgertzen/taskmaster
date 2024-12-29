import { ITaskRepository } from "../../interfaces/taskRepository";
import { REDIS_KEYS } from "../../utils/redisKeys";
import { BaseTask, ClientTask, SearchResults } from "../../interfaces/entities";
import { generateUniqueId } from "../../utils/nanoid";
import { RedisClientType } from "redis";
import { DatabaseError } from "@src/errors";

export class TaskRepositoryRedis implements ITaskRepository {
  constructor(private readonly redisClient: RedisClientType) {}

  async createTask(
    userId: string,
    listId: string,
    text: string
  ): Promise<ClientTask> {
    try {
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
    } catch (error) {
      throw new DatabaseError(
        "Failed to create task",
        {
          userId,
          listId,
          text,
        },
        error as Error
      );
    }
  }

  async getTasks(userId: string, listId: string): Promise<ClientTask[]> {
    try {
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
    } catch (error) {
      throw new DatabaseError(
        "Failed to get tasks",
        {
          userId,
          listId,
        },
        error as Error
      );
    }
  }

  async getTasksSearchResults(
    userId: string,
    search: string
  ): Promise<SearchResults> {
    if (!search || !userId) return [];

    try {
      const taskKeys = await this.redisClient.keys(
        REDIS_KEYS.TASK(userId, "*")
      );

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
    } catch (error) {
      throw new DatabaseError(
        "Failed to get tasks search results",
        {
          userId,
          search,
        },
        error as Error
      );
    }
  }

  async updateTask(
    userId: string,
    taskId: string,
    updates: Partial<BaseTask>
  ): Promise<string> {
    try {
      const taskKey = REDIS_KEYS.TASK(userId, taskId);
      const existingTask = await this.redisClient.hGetAll(taskKey);
      if (!existingTask.id)
        throw new DatabaseError(`Task with ID ${taskKey} not found`);

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
    } catch (error) {
      throw new DatabaseError(
        "Failed to update task",
        {
          userId,
          taskId,
          updates,
        },
        error as Error
      );
    }
  }

  async deleteTask(
    userId: string,
    taskId: string,
    listId: string
  ): Promise<string> {
    try {
      const taskKey = REDIS_KEYS.TASK(userId, taskId);

      await this.redisClient
        .multi()
        .del(taskKey)
        .lRem(REDIS_KEYS.TASK_LIST(userId, listId), 0, taskKey)
        .exec();

      return taskId;
    } catch (error) {
      throw new DatabaseError(
        "Failed to delete task",
        {
          userId,
          taskId,
        },
        error as Error
      );
    }
  }

  async reorderTasks(
    userId: string,
    listId: string,
    orderedIds: string[]
  ): Promise<ClientTask[]> {
    try {
      const taskListKey = REDIS_KEYS.TASK_LIST(userId, listId);
      const taskKeys = await this.redisClient.lRange(taskListKey, 0, -1);

      const currentTaskIds = new Set(
        taskKeys.map((key) => key.split(":").pop())
      );

      const invalidIds = orderedIds.filter((id) => !currentTaskIds.has(id));
      if (invalidIds.length) {
        throw new DatabaseError(`Invalid task IDs: ${invalidIds.join(", ")}`);
      }

      const reorderedTaskKeys = orderedIds.map(
        (key) => key.split(":").pop() ?? ""
      );

      const multi = this.redisClient
        .multi()
        .del(taskListKey)
        .rPush(taskListKey, reorderedTaskKeys);

      reorderedTaskKeys.forEach((taskKey, index) => {
        multi.hSet(taskKey, { orderIndex: index });
      });

      await multi.exec();

      const reorderedTasks = await Promise.all(
        reorderedTaskKeys.map(async (taskKey, index) => {
          const task = await this.redisClient.hGetAll(taskKey);
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

      return reorderedTasks;
    } catch (error) {
      throw new DatabaseError(
        "Failed to reorder tasks",
        {
          userId,
          listId,
          orderedIds,
        },
        error as Error
      );
    }
  }

  async toggleCompleteAll(
    userId: string,
    listId: string,
    newCompletedState: boolean
  ): Promise<ClientTask[]> {
    try {
      const taskListKey = REDIS_KEYS.TASK_LIST(userId, listId);
      const taskKeys = await this.redisClient.lRange(taskListKey, 0, -1);

      if (!taskKeys.length) return [];

      const multi = this.redisClient.multi();
      taskKeys.forEach((taskKey) =>
        multi.hSet(taskKey, { completed: newCompletedState.toString() })
      );
      await multi.exec();

      return await this.getTasks(userId, listId);
    } catch (error) {
      throw new DatabaseError(
        "Failed to toggle complete all tasks",
        {
          userId,
          listId,
          newCompletedState,
        },
        error as Error
      );
    }
  }

  async bulkDelete(
    userId: string,
    listId: string,
    mode: "all" | "completed"
  ): Promise<ClientTask[]> {
    try {
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
    } catch (error) {
      throw new DatabaseError(
        "Failed to bulk delete tasks",
        {
          userId,
          listId,
          mode,
        },
        error as Error
      );
    }
  }
}
