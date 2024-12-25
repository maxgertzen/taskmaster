import {
  BaseList,
  BaseTask,
  BaseUser,
  ClientTask,
  SearchResults,
} from "./entities";

export interface IListCache {
  getLists: (userId: string) => Promise<BaseList[] | null>;
  setLists: (userId: string, lists: BaseList[]) => Promise<void>;
  invalidateCache: (userId: string) => Promise<void>;
}

export interface ITaskCache {
  getTasks: (userId: string, listId: string) => Promise<BaseTask[] | null>;
  setTasks: (
    userId: string,
    listId: string,
    tasks: ClientTask[]
  ) => Promise<void>;
  getSearchResults: (
    userId: string,
    search: string
  ) => Promise<SearchResults | null>;
  setSearchResults: (
    userId: string,
    search: string,
    results: SearchResults
  ) => Promise<void>;
  invalidateTasks: (userId: string, listId: string) => Promise<void>;
}

export interface IUserCache {
  getUser: (userId: string) => Promise<BaseUser | null>;
  setUser: (userId: string, user: BaseUser) => Promise<void>;
  invalidateCache: (userId: string) => Promise<void>;
}
