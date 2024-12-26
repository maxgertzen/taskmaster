import { List } from "../interfaces/entities";
import { IListRepository } from "../interfaces/listRepository";
import { ListsCache } from "./cache/listsCache";

export class ListsService {
  constructor(private repository: IListRepository, private cache: ListsCache) {}

  async createList(userId: string, name: string): Promise<List> {
    const list = await this.repository.createList(userId, name);
    await this.cache.invalidateCache(userId);
    return list;
  }

  async getLists(userId: string): Promise<List[]> {
    const cachedLists = await this.cache.getLists(userId);
    if (cachedLists) {
      return cachedLists;
    }

    const lists = await this.repository.getLists(userId);
    await this.cache.setLists(userId, lists);

    return lists;
  }

  async updateList(
    userId: string,
    listId: string,
    name: string
  ): Promise<List> {
    const lists = await this.repository.updateList(userId, listId, name);
    await this.cache.invalidateCache(userId);
    return lists;
  }

  async deleteList(
    userId: string,
    listId: string
  ): Promise<{ deletedId: string }> {
    const deletedId = await this.repository.deleteList(userId, listId);
    await this.cache.invalidateCache(userId);
    return deletedId;
  }

  async reorderLists(userId: string, orderedIds: string[]): Promise<List[]> {
    const lists = await this.repository.reorderLists(userId, orderedIds);
    await this.cache.setLists(userId, lists);
    return lists;
  }
}
