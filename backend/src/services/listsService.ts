import { List } from "../interfaces/entities";
import { IListRepository } from "../interfaces/listRepository";

export class ListService {
  private repository: IListRepository;

  constructor(repository: IListRepository) {
    this.repository = repository;
  }

  async createList(userId: string, name: string): Promise<List> {
    return this.repository.createList(userId, name);
  }

  async getLists(userId: string): Promise<List[]> {
    return this.repository.getLists(userId);
  }

  async updateList(
    userId: string,
    listId: string,
    name: string
  ): Promise<List> {
    return this.repository.updateList(userId, listId, name);
  }

  async deleteList(
    userId: string,
    listId: string
  ): Promise<{ deletedId: string }> {
    return this.repository.deleteList(userId, listId);
  }

  async reorderLists(userId: string, orderedIds: string[]): Promise<List[]> {
    return this.repository.reorderLists(userId, orderedIds);
  }
}
