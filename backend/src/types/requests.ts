import { Request } from "express";

export type CreateListRequestBody = {
  name: string;
};

export interface CreateListRequest extends Request {
  body: CreateListRequestBody;
}

export type UpdateListRequestBody = {
  id: string;
  name: string;
};

export interface UpdateListRequest extends Request {
  body: UpdateListRequestBody;
}

export type DeleteRequestBody = {
  id: string;
};

export interface DeleteListRequest extends Request {
  body: DeleteRequestBody;
}

export type ReorderListRequestBody = {
  oldIndex: number;
  newIndex: number;
};

export interface ReorderListRequest extends Request {
  body: ReorderListRequestBody;
}

export type CreateTaskRequestBody = {
  text: string;
  listId: string;
};

export interface CreateTaskRequest extends Request {
  body: CreateTaskRequestBody;
}

export type GetTasksRequestParams = {
  listId: string;
};

export interface GetTasksRequest extends Request {
  params: GetTasksRequestParams;
}

export type UpdateTaskRequestBody = {
  id: string;
  text?: string;
  completed?: boolean;
};

export interface UpdateTaskRequest extends Request {
  body: UpdateTaskRequestBody;
}

export type DeleteTaskRequestBody = {
  taskId: string;
  listId: string;
};

export interface DeleteTaskRequest extends Request {
  body: DeleteTaskRequestBody;
}

export type ReorderTasksRequestBody = {
  listId: string;
  oldIndex: number;
  newIndex: number;
};

export interface ReorderTasksRequest extends Request {
  body: ReorderTasksRequestBody;
}

export type BulkCompleteRequestBody = {
  listId: string;
  newCompletedState: boolean;
};
export interface BulkCompleteRequest extends Request {
  body: BulkCompleteRequestBody;
}

export type BulkDeleteRequestBody = {
  listId: string;
  mode?: "all" | "completed";
};

export interface BulkDeleteRequest extends Request {
  body: BulkDeleteRequestBody;
}
