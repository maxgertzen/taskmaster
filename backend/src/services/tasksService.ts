import { ITaskRepository } from "../interfaces/taskRepository";
import { Task, ClientTask, SearchResults } from "../interfaces/entities";
import { TasksCache } from "./cache/tasksCache";

export class TasksService {
  private repository: ITaskRepository;
  private cache: TasksCache;

  constructor(repository: ITaskRepository) {
    this.repository = repository;
    this.cache = new TasksCache();
  }

  async createTask(
    userId: string,
    listId: string,
    text: string
  ): Promise<ClientTask> {
    const task = await this.repository.createTask(userId, listId, text);
    await this.cache.invalidateTasks(userId, listId);
    return task;
  }

  async getTasks(userId: string, listId: string): Promise<ClientTask[]> {
    const cachedTasks = await this.cache.getTasks(userId, listId);
    if (cachedTasks) {
      return cachedTasks.map((task) => ({
        ...task,
        completed: Boolean(task.completed),
      }));
    }

    const tasks = await this.repository.getTasks(userId, listId);
    await this.cache.setTasks(userId, listId, tasks);
    return tasks;
  }

  async getTasksSearchResults(
    userId: string,
    search: string
  ): Promise<SearchResults> {
    const cachedResults = await this.cache.getSearchResults(userId, search);
    if (cachedResults) {
      return cachedResults;
    }

    const results = await this.repository.getTasksSearchResults(userId, search);
    await this.cache.setSearchResults(userId, search, results);
    return results;
  }

  async updateTask(
    userId: string,
    taskId: string,
    updates: Partial<Task>
  ): Promise<string> {
    const listId = await this.repository.updateTask(userId, taskId, updates);
    await this.cache.invalidateTasks(userId, listId);
    return taskId;
  }

  async deleteTask(
    userId: string,
    taskId: string,
    listId: string
  ): Promise<string> {
    const deletedId = await this.repository.deleteTask(userId, taskId, listId);
    await this.cache.invalidateTasks(userId, listId);
    return deletedId;
  }

  async reorderTasks(
    userId: string,
    listId: string,
    orderedIds: string[]
  ): Promise<ClientTask[]> {
    const tasks = await this.repository.reorderTasks(
      userId,
      listId,
      orderedIds
    );
    await this.cache.setTasks(userId, listId, tasks);
    return tasks;
  }

  async toggleCompleteAll(
    userId: string,
    listId: string,
    newCompletedState: boolean
  ): Promise<ClientTask[]> {
    const tasks = await this.repository.toggleCompleteAll(
      userId,
      listId,
      newCompletedState
    );
    await this.cache.setTasks(userId, listId, tasks);
    return tasks;
  }

  async bulkDelete(
    userId: string,
    listId: string,
    mode: "all" | "completed"
  ): Promise<ClientTask[]> {
    const tasks = await this.repository.bulkDelete(userId, listId, mode);
    await this.cache.setTasks(userId, listId, tasks);
    return tasks;
  }
}
