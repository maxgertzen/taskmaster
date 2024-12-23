export interface BaseEntity {
  id: string;
  creationDate: Date | string;
  userId: string;
  orderIndex: number;
}

export interface BaseUser {
  auth0Id: string;
  email: string;
  name: string;
  preferences?: Record<string, unknown>;
}

export interface BaseList extends BaseEntity {
  name: string;
  sharedWith?: string[];
}

export interface BaseTask extends BaseEntity {
  text: string;
  completed: boolean | string;
  listId: string;
}

export type ClientTask = Omit<BaseTask, "completed"> & {
  completed: boolean;
};
export type SearchResults = { listName: string; tasks: ClientTask[] }[];

export type List = BaseList;

export type Task = BaseTask;
