import { IListRepository } from "../../interfaces/listRepository";
import { ListModel, MongoList } from "../../models/list";
import { BaseList } from "../../interfaces/entities";

export class ListRepositoryMongo implements IListRepository {
  async createList(userId: string, name: string): Promise<BaseList> {
    const orderIndex = await ListModel.countDocuments({ userId });

    const list = new ListModel({ userId, name, orderIndex });
    const result = await list.save();

    return {
      id: result._id.toString(),
      name: result.name,
      creationDate: result.creationDate,
      userId: result.userId.toString(),
      sharedWith: result.sharedWith?.map((id) => id.toString()),
      orderIndex: result.orderIndex,
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

  async deleteList(
    userId: string,
    listId: string
  ): Promise<{ deletedId: string }> {
    const result = await ListModel.deleteOne({ _id: listId, userId });

    if (result.deletedCount === 0) {
      throw new Error(`List with ID ${listId} not found`);
    }

    return { deletedId: listId };
  }

  async reorderLists(
    userId: string,
    orderedIds: string[]
  ): Promise<BaseList[]> {
    const bulkOperations = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { orderIndex: index } },
      },
    }));

    await ListModel.bulkWrite(bulkOperations);

    return await this.getLists(userId);
  }
}
