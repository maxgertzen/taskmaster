import { ITaskRepository } from "../interfaces/taskRepository";
import { Task, ClientTask, SearchResults } from "../interfaces/entities";
import { GetTasksRequestQuery } from "../types/requests";

export class TaskService {
  private repository: ITaskRepository;

  constructor(repository: ITaskRepository) {
    this.repository = repository;
  }

  async createTask(
    userId: string,
    listId: string,
    text: string
  ): Promise<ClientTask> {
    return this.repository.createTask(userId, listId, text);
  }

  async getTasks(
    userId: string,
    listId: string,
    options?: GetTasksRequestQuery
  ): Promise<ClientTask[]> {
    let tasks = await this.repository.getTasks(userId, listId);

    if (options?.filter) {
      tasks = tasks.filter((task) =>
        options.filter === "completed" ? task.completed : !task.completed
      );
    }

    if (options?.sort) {
      tasks.sort((a, b) =>
        options.sort === "asc"
          ? a.text.localeCompare(b.text)
          : b.text.localeCompare(a.text)
      );
    }

    return tasks;
  }

  async getTasksSearchResults(
    userId: string,
    search: string
  ): Promise<SearchResults> {
    return this.repository.getTasksSearchResults(userId, search);
  }

  async updateTask(
    userId: string,
    taskId: string,
    updates: Partial<Task>
  ): Promise<string> {
    return this.repository.updateTask(userId, taskId, updates);
  }

  async deleteTask(
    userId: string,
    taskId: string,
    listId: string
  ): Promise<string> {
    return this.repository.deleteTask(userId, taskId, listId);
  }

  async reorderTasks(
    userId: string,
    listId: string,
    orderedIds: string[]
  ): Promise<ClientTask[]> {
    return this.repository.reorderTasks(userId, listId, orderedIds);
  }

  async toggleCompleteAll(
    userId: string,
    listId: string,
    newCompletedState: boolean
  ): Promise<ClientTask[]> {
    return this.repository.toggleCompleteAll(userId, listId, newCompletedState);
  }

  async bulkDelete(
    userId: string,
    listId: string,
    mode: "all" | "completed"
  ): Promise<ClientTask[]> {
    return this.repository.bulkDelete(userId, listId, mode);
  }
}
