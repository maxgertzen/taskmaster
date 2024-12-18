import { IListRepository } from "../../interfaces/listRepository";
import { ListModel, MongoList } from "../../models/list";
import { BaseList } from "../../interfaces/entities";
import {
  withCache,
  withCacheInvalidation,
} from "../../services/cache/cacheWrapper";
import { CACHE_KEYS } from "../../utils/cacheKeys";

export class ListRepositoryMongo implements IListRepository {
  private readonly createListWithCache = withCacheInvalidation(
    async (userId: string, name: string): Promise<BaseList> => {
      const orderIndex = await ListModel.countDocuments({ userId });

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
  );

  private readonly getListsDirect = async (
    userId: string
  ): Promise<BaseList[]> => {
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
  };

  private readonly getListsWithCache = withCache(
    async (userId: string): Promise<BaseList[]> => {
      return this.getListsDirect(userId);
    },
    {
      type: "LISTS",
      keyGenerator: (userId) => CACHE_KEYS.LISTS(userId),
    }
  );

  private readonly updateListWithCache = withCacheInvalidation(
    async (userId: string, listId: string, name: string): Promise<BaseList> => {
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
  );

  private readonly deleteListWithCache = withCacheInvalidation(
    async (userId: string, listId: string): Promise<{ deletedId: string }> => {
      const result = await ListModel.deleteOne({ _id: listId, userId });

      if (result.deletedCount === 0) {
        throw new Error(`List with ID ${listId} not found`);
      }

      return { deletedId: listId };
    }
  );

  private readonly reorderListsWithCache = withCacheInvalidation(
    async (userId: string, orderedIds: string[]): Promise<BaseList[]> => {
      const bulkOperations = orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { orderIndex: index } },
        },
      }));

      await ListModel.bulkWrite(bulkOperations);

      return await this.getListsDirect(userId);
    }
  );

  async createList(userId: string, name: string): Promise<BaseList> {
    return this.createListWithCache(userId, name);
  }

  async getLists(userId: string): Promise<BaseList[]> {
    return this.getListsWithCache(userId);
  }

  async updateList(
    userId: string,
    listId: string,
    name: string
  ): Promise<BaseList> {
    return this.updateListWithCache(userId, listId, name);
  }

  async deleteList(
    userId: string,
    listId: string
  ): Promise<{ deletedId: string }> {
    return this.deleteListWithCache(userId, listId);
  }

  async reorderLists(
    userId: string,
    orderedIds: string[]
  ): Promise<BaseList[]> {
    return this.reorderListsWithCache(userId, orderedIds);
  }
}
