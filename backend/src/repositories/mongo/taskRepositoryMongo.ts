import { ITaskRepository } from "../../interfaces/taskRepository";
import { TaskModel, MongoTask } from "../../models/task";
import { reorderArray } from "../../utils/reorderArray";
import { BaseTask, ClientTask, SearchResults } from "../../interfaces/entities";
import {
  withCache,
  withCacheInvalidation,
} from "../../services/cache/cacheWrapper";
import { CACHE_KEYS } from "../../utils/cacheKeys";

export class TaskRepositoryMongo implements ITaskRepository {
  private readonly createTaskWithCache = withCacheInvalidation(
    async (
      userId: string,
      listId: string,
      text: string
    ): Promise<ClientTask> => {
      const orderIndex = await TaskModel.find({ userId, listId })
        .sort({ orderIndex: -1 })
        .limit(1)
        .lean()
        .then((tasks) => (tasks[0]?.orderIndex ?? -1) + 1);

      const task = new TaskModel({
        userId,
        listId,
        text,
        completed: false,
        orderIndex,
      });

      await task.save();

      return {
        id: task._id.toString(),
        text: task.text,
        completed: task.completed,
        creationDate: task.creationDate,
        userId: task.userId.toString(),
        listId: task.listId.toString(),
        orderIndex: task.orderIndex,
      };
    }
  );

  private readonly getTasksWithCache = withCache(
    async (userId: string, listId: string): Promise<ClientTask[]> => {
      const tasks = await TaskModel.find({ userId, listId })
        .sort({ orderIndex: 1 })
        .lean<MongoTask[]>();

      return tasks.map((task) => ({
        id: task._id.toString(),
        text: task.text,
        completed: task.completed,
        creationDate: task.creationDate,
        userId: task.userId.toString(),
        listId: task.listId.toString(),
        orderIndex: task.orderIndex,
      }));
    },
    {
      type: "TASKS",
      keyGenerator: (userId, listId) => CACHE_KEYS.TASK_LIST(userId, listId),
    }
  );

  private readonly getTasksSearchResultsWithCache = withCache(
    async (userId: string, search: string): Promise<SearchResults> => {
      const tasks = await TaskModel.find({
        userId,
        text: { $regex: search, $options: "i" },
      }).lean<MongoTask[]>();

      const groupedByListId: { [listId: string]: ClientTask[] } = {};

      tasks.forEach((task) => {
        const listId = task.listId.toString();
        if (!groupedByListId[listId]) {
          groupedByListId[listId] = [];
        }
        groupedByListId[listId].push({
          id: task._id.toString(),
          text: task.text,
          completed: task.completed,
          creationDate: task.creationDate,
          userId: task.userId.toString(),
          listId,
          orderIndex: task.orderIndex,
        });
      });

      return Object.entries(groupedByListId).map(([_, tasks]) => ({
        listName: "List Name", // You might want to fetch this from ListModel
        tasks,
      }));
    },
    {
      type: "SEARCH",
      keyGenerator: (userId, search) =>
        CACHE_KEYS.SEARCH_RESULTS(userId, search),
    }
  );

  private readonly updateTaskWithCache = withCacheInvalidation(
    async (
      userId: string,
      taskId: string,
      updates: Partial<BaseTask>
    ): Promise<string> => {
      const updatedTask = await TaskModel.findOneAndUpdate(
        { _id: taskId, userId },
        updates,
        { new: true }
      ).lean<MongoTask>();

      if (!updatedTask) {
        throw new Error(`Task with ID ${taskId} not found`);
      }

      return updatedTask._id.toString();
    }
  );

  private readonly deleteTaskWithCache = withCacheInvalidation(
    async (
      userId: string,
      taskId: string,
      _listId: string
    ): Promise<string> => {
      const result = await TaskModel.deleteOne({ _id: taskId, userId });

      if (result.deletedCount === 0) {
        throw new Error(`Task with ID ${taskId} not found`);
      }

      return taskId;
    }
  );

  private readonly reorderTasksWithCache = withCacheInvalidation(
    async (
      userId: string,
      listId: string,
      oldIndex: number,
      newIndex: number
    ): Promise<ClientTask[]> => {
      const tasks = await this.getTasks(userId, listId);
      const reorderedTasks = reorderArray(tasks, oldIndex, newIndex);

      await Promise.all(
        reorderedTasks.map((task, index) =>
          TaskModel.updateOne({ _id: task.id }, { orderIndex: index })
        )
      );

      return reorderedTasks;
    }
  );

  private readonly toggleCompleteAllWithCache = withCacheInvalidation(
    async (
      userId: string,
      listId: string,
      newCompletedState: boolean
    ): Promise<ClientTask[]> => {
      await TaskModel.updateMany(
        { userId, listId },
        { completed: newCompletedState }
      );
      return this.getTasks(userId, listId);
    }
  );

  private readonly bulkDeleteWithCache = withCacheInvalidation(
    async (
      userId: string,
      listId: string,
      mode: "all" | "completed"
    ): Promise<ClientTask[]> => {
      const query =
        mode === "completed"
          ? { userId, listId, completed: true }
          : { userId, listId };

      await TaskModel.deleteMany(query);
      return this.getTasks(userId, listId);
    }
  );

  async createTask(
    userId: string,
    listId: string,
    text: string
  ): Promise<ClientTask> {
    return this.createTaskWithCache(userId, listId, text);
  }

  async getTasks(userId: string, listId: string): Promise<ClientTask[]> {
    return this.getTasksWithCache(userId, listId);
  }

  async getTasksSearchResults(
    userId: string,
    search: string
  ): Promise<SearchResults> {
    return this.getTasksSearchResultsWithCache(userId, search);
  }

  async updateTask(
    userId: string,
    taskId: string,
    updates: Partial<BaseTask>
  ): Promise<string> {
    return this.updateTaskWithCache(userId, taskId, updates);
  }

  async deleteTask(
    userId: string,
    taskId: string,
    listId: string
  ): Promise<string> {
    return this.deleteTaskWithCache(userId, taskId, listId);
  }

  async reorderTasks(
    userId: string,
    listId: string,
    oldIndex: number,
    newIndex: number
  ): Promise<ClientTask[]> {
    return this.reorderTasksWithCache(userId, listId, oldIndex, newIndex);
  }

  async toggleCompleteAll(
    userId: string,
    listId: string,
    newCompletedState: boolean
  ): Promise<ClientTask[]> {
    return this.toggleCompleteAllWithCache(userId, listId, newCompletedState);
  }

  async bulkDelete(
    userId: string,
    listId: string,
    mode: "all" | "completed"
  ): Promise<ClientTask[]> {
    return this.bulkDeleteWithCache(userId, listId, mode);
  }
}