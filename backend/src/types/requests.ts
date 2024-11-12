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
