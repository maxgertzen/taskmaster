import { ITaskRepository } from "../../interfaces/taskRepository";
import { TaskModel, MongoTask } from "../../models/task";
import { reorderArray } from "../../utils/reorderArray";
import { BaseTask, ClientTask, SearchResults } from "../../interfaces/entities";
import { MongoList } from "../../models/list";

export class TaskRepositoryMongo implements ITaskRepository {
  async createTask(
    userId: string,
    listId: string,
    text: string
  ): Promise<ClientTask> {
    const orderIndex = await TaskModel.find({ userId, listId })
      .sort({ orderIndex: -1 })
      .limit(1)
      .lean()
      .then((tasks) => (tasks[0]?.orderIndex ?? -1) + 1);

    const newTask = new TaskModel({
      userId,
      listId,
      text,
      completed: false,
      orderIndex,
    });

    await newTask.save();

    const task = newTask.toObject<MongoTask>();
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

    const results: SearchResults = await Promise.all(
      Object.entries(groupedByListId).map(async ([listId, tasks]) => {
        const list = await TaskModel.findById(listId)
          .select("name")
          .lean<MongoList>();
        return {
          listName: list?.name || "Unnamed List",
          tasks,
        };
      })
    );

    return results;
  }

  async updateTask(
    userId: string,
    taskId: string,
    updates: Partial<BaseTask>
  ): Promise<string> {
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

  async deleteTask(
    userId: string,
    taskId: string,
    _listId: string
  ): Promise<string> {
    const result = await TaskModel.deleteOne({ _id: taskId, userId });

    if (result.deletedCount === 0) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    return taskId;
  }

  async reorderTasks(
    userId: string,
    listId: string,
    oldIndex: number,
    newIndex: number
  ): Promise<ClientTask[]> {
    const tasks = await this.getTasks(userId, listId);
    const reorderedTasks = reorderArray(tasks, oldIndex, newIndex);

    await Promise.all(
      reorderedTasks.map((task, index) =>
        TaskModel.updateOne({ _id: task.id }, { orderIndex: index })
      )
    );

    return reorderedTasks;
  }

  async toggleCompleteAll(
    userId: string,
    listId: string,
    newCompletedState: boolean
  ): Promise<ClientTask[]> {
    await TaskModel.updateMany(
      { userId, listId },
      { completed: newCompletedState }
    );
    return await this.getTasks(userId, listId);
  }

  async bulkDelete(
    userId: string,
    listId: string,
    mode: "all" | "completed"
  ): Promise<ClientTask[]> {
    const query =
      mode === "completed"
        ? { userId, listId, completed: true }
        : { userId, listId };

    await TaskModel.deleteMany(query);
    return await this.getTasks(userId, listId);
  }
}
