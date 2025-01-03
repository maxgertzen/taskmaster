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
  orderedIds: string[];
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
  orderedIds: string[];
};

export type CompleteAllRequest = {
  listId: string;
  newCompletedState: boolean;
};

export type DeleteAllRequest = {
  listId: string;
  mode?: 'all' | 'completed';
};
