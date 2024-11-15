export interface Task {
  id: string;
  text: string;
  completed: string;
  listId: string;
  creationDate: number | string;
}

export type ClientTask = Omit<Task, "completed"> & { completed: boolean };
