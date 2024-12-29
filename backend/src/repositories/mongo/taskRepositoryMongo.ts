import { ITaskRepository } from "../../interfaces/taskRepository";
import { TaskModel, MongoTask } from "../../models/task";
import { BaseTask, ClientTask, SearchResults } from "../../interfaces/entities";
import { ListModel } from "../../models/list";
import { DatabaseError, NotFoundError } from "@src/errors";

export class TaskRepositoryMongo implements ITaskRepository {
  async createTask(
    userId: string,
    listId: string,
    text: string
  ): Promise<ClientTask> {
    try {
      const orderIndex = await TaskModel.countDocuments({ userId, listId });

      const task = new TaskModel({
        userId,
        listId,
        text,
        completed: false,
        orderIndex,
      });

      const result = await task.save();

      return {
        id: result._id.toString(),
        text: result.text,
        completed: result.completed,
        creationDate: result.creationDate,
        userId: result.userId.toString(),
        listId: result.listId.toString(),
        orderIndex: result.orderIndex,
      };
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
  }

  async getTasksSearchResults(
    userId: string,
    search: string
  ): Promise<SearchResults> {
    try {
      const tasks = await TaskModel.find({
        userId,
        text: { $regex: search, $options: "i" },
      }).lean<MongoTask[]>();

      if (!tasks || tasks.length === 0) {
        return [];
      }

      const groupedByListId: { [listId: string]: ClientTask[] } = {};
      const listIds = new Set<string>();

      tasks.forEach((task) => {
        const listId = task.listId.toString();
        listIds.add(listId);

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

      const lists = await ListModel.find({
        _id: { $in: Array.from(listIds) },
      }).lean();

      if (!lists) {
        throw new NotFoundError(`No lists found for user with ID ${userId}`);
      }

      const listNameMap = new Map(
        lists.map((list) => [list._id.toString(), list.name])
      );

      return Object.entries(groupedByListId).map(([listId, tasks]) => ({
        listName: listNameMap.get(listId) || "Unnamed List",
        tasks,
      }));
    } catch (error) {
      throw new DatabaseError(
        "Failed to get search results",
        { userId, search },
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
      const updatedTask = await TaskModel.findOneAndUpdate(
        { _id: taskId, userId },
        updates,
        { new: true }
      ).lean<MongoTask>();

      if (!updatedTask) {
        throw new NotFoundError(`Task with ID ${taskId} not found`);
      }

      return updatedTask.listId.toString();
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

  async deleteTask(userId: string, taskId: string): Promise<string> {
    try {
      const result = await TaskModel.deleteOne({ _id: taskId, userId });

      if (result.deletedCount === 0) {
        throw new NotFoundError(`Task with ID ${taskId} not found`);
      }

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
      const bulkOperations = orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id, userId, listId },
          update: { $set: { orderIndex: index } },
        },
      }));

      const result = await TaskModel.bulkWrite(bulkOperations);

      if (result.hasWriteErrors()) {
        throw new DatabaseError("Failed to reorder tasks", {
          writeErrors: result.getWriteErrors().map((error) => ({
            code: error.code,
            message: error.errmsg,
          })),
        });
      }

      return await this.getTasks(userId, listId);
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
      const result = await TaskModel.updateMany(
        { userId, listId },
        { completed: newCompletedState }
      );

      if (result.modifiedCount === 0) {
        throw new NotFoundError(
          `No tasks found for user with ID ${userId} and list with ID ${listId}`
        );
      }

      return this.getTasks(userId, listId);
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
      const query =
        mode === "completed"
          ? { userId, listId, completed: true }
          : { userId, listId };

      const result = await TaskModel.deleteMany(query);

      if (result.deletedCount === 0) {
        throw new NotFoundError(
          `No tasks found for user with ID ${userId} and list with ID ${listId}`
        );
      }

      return this.getTasks(userId, listId);
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
