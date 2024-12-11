import { IListRepository } from "../../interfaces/listRepository";
import { ListModel, MongoList } from "../../models/list";
import { reorderArray } from "../../utils/reorderArray";
import { BaseList } from "../../interfaces/entities";

export class ListRepositoryMongo implements IListRepository {
  async createList(userId: string, name: string): Promise<BaseList> {
    const orderIndex = await ListModel.find({ userId })
      .sort({ orderIndex: -1 })
      .limit(1)
      .lean()
      .then((lists) => (lists[0]?.orderIndex ?? -1) + 1);

    const list = new ListModel({ userId, name, orderIndex });
    await list.save();

    return {
      id: list._id.toString(),
      name: list.name,
      creationDate: list.creationDate,
      userId: list.userId.toString(),
      sharedWith: list.sharedWith?.map((id) => id.toString()),
      orderIndex: list.orderIndex,
    };
  }

  async getLists(userId: string): Promise<BaseList[]> {
    const lists = await ListModel.find({ userId })
      .sort({ orderIndex: 1 })
      .lean<MongoList[]>();

    return lists.map((list) => ({
      id: list._id.toString(),
      name: list.name,
      creationDate: list.creationDate,
      userId: list.userId.toString(),
      sharedWith: list.sharedWith?.map((id) => id.toString()),
      orderIndex: list.orderIndex,
    }));
  }

  async updateList(
    userId: string,
    listId: string,
    name: string
  ): Promise<BaseList> {
    const updatedList = await ListModel.findOneAndUpdate(
      { _id: listId, userId },
      { name },
      { new: true }
    ).lean<MongoList>();

    if (!updatedList) {
      throw new Error(`List with ID ${listId} not found`);
    }

    return {
      id: updatedList._id.toString(),
      name: updatedList.name,
      creationDate: updatedList.creationDate,
      userId: updatedList.userId.toString(),
      sharedWith: updatedList.sharedWith?.map((id) => id.toString()),
      orderIndex: updatedList.orderIndex,
    };
  }

  async deleteList(userId: string, listId: string): Promise<{ id: string }> {
    const result = await ListModel.deleteOne({ _id: listId, userId });

    if (result.deletedCount === 0) {
      throw new Error(`List with ID ${listId} not found`);
    }

    return { id: listId };
  }

  async reorderLists(
    userId: string,
    oldIndex: number,
    newIndex: number
  ): Promise<BaseList[]> {
    const lists = await this.getLists(userId);
    const reorderedLists = reorderArray(lists, oldIndex, newIndex);

    await Promise.all(
      reorderedLists.map((list, index) =>
        ListModel.updateOne({ _id: list.id }, { orderIndex: index })
      )
    );

    return reorderedLists;
  }
}
