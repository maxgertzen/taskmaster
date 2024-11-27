import { List } from "../../models/listModel";

export interface IListRepository {
  createList(userId: string, name: string): Promise<List>;
  getLists(userId: string): Promise<List[]>;
  updateList(userId: string, listId: string, name: string): Promise<List>;
  deleteList(userId: string, listId: string): Promise<{ id: string }>;
  reorderLists(
    userId: string,
    oldIndex: number,
    newIndex: number
  ): Promise<List[]>;
}
