import { Task, ClientTask, SearchResults } from "./entities";

export interface ITaskRepository {
  createTask(userId: string, listId: string, text: string): Promise<ClientTask>;
  getTasks(userId: string, listId: string): Promise<ClientTask[]>;
  getTasksSearchResults(userId: string, search: string): Promise<SearchResults>;
  updateTask(
    userId: string,
    taskId: string,
    updates: Partial<Task>
  ): Promise<string>;
  deleteTask(userId: string, taskId: string, listId: string): Promise<string>;
  reorderTasks(
    userId: string,
    listId: string,
    orderedIds: string[]
  ): Promise<ClientTask[]>;
  toggleCompleteAll(
    userId: string,
    listId: string,
    newCompletedState: boolean
  ): Promise<ClientTask[]>;
  bulkDelete(
    userId: string,
    listId: string,
    mode: "all" | "completed"
  ): Promise<ClientTask[]>;
}
