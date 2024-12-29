import {
  List,
  ClientTask,
  SearchResults,
  BaseUser,
} from "../interfaces/entities";

export type CreateListResponse = List;

export type GetListsResponse = List[];

export type UpdateListResponse = List;

export type DeleteListResponse = {
  deletedId: string;
};

export type ReorderListsResponse = List[];

export type CreateTaskResponse = ClientTask;

export type GetTasksResponse = ClientTask[];

export type GetTasksSearchResultsResponse = SearchResults;

export type UpdateTaskResponse = string;

export type DeleteTaskResponse = {
  deletedId: string;
};

export type ReorderTasksResponse = ClientTask[];

export type ToggleCompleteAllResponse = ClientTask[];

export type BulkDeleteResponse = ClientTask[];

export type GetOrCreateUserResponse = BaseUser;

export type UpdatePreferencesResponse = BaseUser | null;
