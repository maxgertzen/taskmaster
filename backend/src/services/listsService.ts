import { IListRepository } from "../repositories/interfaces/listRepository";
import { List } from "../models/listModel";

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

  async deleteList(userId: string, listId: string): Promise<{ id: string }> {
    return this.repository.deleteList(userId, listId);
  }

  async reorderLists(
    userId: string,
    oldIndex: number,
    newIndex: number
  ): Promise<List[]> {
    return this.repository.reorderLists(userId, oldIndex, newIndex);
  }
}
