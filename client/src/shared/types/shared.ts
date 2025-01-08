export type List = {
  id: string;
  name: string;
};

export type UserDetails = {
  name: string;
  email: string;
};

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  listId: string | null;
};

export type SearchResults = { listName: string; tasks: Task[] }[];
