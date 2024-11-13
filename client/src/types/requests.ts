export type CreateListRequest = {
  name: string;
};

export type UpdateListRequest = {
  id: string;
  name: string;
};

export type DeleteListRequest = {
  id: string;
};

export type ReorderListRequest = {
  oldIndex: number;
  newIndex: number;
};

export type CreateTaskRequest = {
  text: string;
  listId: string;
};

export type GetTasksRequest = {
  listId: string;
};

export type UpdateTaskRequest = {
  id: string;
  text?: string;
  completed?: boolean;
};

export type DeleteTaskRequest = {
  taskId: string;
  listId: string;
};

export type ReorderTasksRequest = {
  listId: string;
  oldIndex: number;
  newIndex: number;
};
