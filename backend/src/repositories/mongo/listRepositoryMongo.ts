import { IListRepository } from '../../interfaces/listRepository';
import { ListModel, MongoList } from '../../models/list';
import { BaseList } from '../../interfaces/entities';
import mongoose from 'mongoose';
import { BadRequestError, DatabaseError, NotFoundError } from '@src/errors';

export class ListRepositoryMongo implements IListRepository {
  async createList(userId: string, name: string): Promise<BaseList> {
    try {
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
    } catch (error) {
      throw new DatabaseError(
        'Failed to create list',
        {
          userId,
          name,
        },
        error as Error
      );
    }
  }

  async getLists(userId: string): Promise<BaseList[]> {
    try {
      const lists = await ListModel.find({ userId })
        .sort({ orderIndex: 1 })
        .lean<MongoList[]>();

      if (!lists || lists.length === 0) {
        return [];
      }

      return lists.map((list) => ({
        id: list._id.toString(),
        name: list.name,
        creationDate: list.creationDate,
        userId: list.userId.toString(),
        sharedWith: list.sharedWith?.map((id) => id.toString()),
        orderIndex: list.orderIndex,
      }));
    } catch (error) {
      throw new DatabaseError(
        'Failed to get lists',
        { userId },
        error as Error
      );
    }
  }

  async updateList(
    userId: string,
    listId: string,
    name: string
  ): Promise<BaseList> {
    try {
      const updatedList = await ListModel.findOneAndUpdate(
        { _id: listId, userId },
        { name },
        { new: true }
      ).lean<MongoList>();

      if (!updatedList) {
        throw new NotFoundError(`List with ID ${listId} not found`);
      }

      return {
        id: updatedList._id.toString(),
        name: updatedList.name,
        creationDate: updatedList.creationDate,
        userId: updatedList.userId.toString(),
        sharedWith: updatedList.sharedWith?.map((id) => id.toString()),
        orderIndex: updatedList.orderIndex,
      };
    } catch (error) {
      throw new DatabaseError(
        'Failed to update list',
        {
          userId,
          listId,
          name,
        },
        error as Error
      );
    }
  }

  async deleteList(
    userId: string,
    listId: string
  ): Promise<{ deletedId: string }> {
    try {
      const result = await ListModel.deleteOne({ _id: listId, userId });

      if (result.deletedCount === 0) {
        throw new NotFoundError(`List with ID ${listId} not found`);
      }

      return { deletedId: listId };
    } catch (error) {
      throw new DatabaseError(
        'Failed to delete list',
        {
          userId,
          listId,
        },
        error as Error
      );
    }
  }

  async reorderLists(
    userId: string,
    orderedIds: string[]
  ): Promise<BaseList[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Invalid user ID');
    }

    try {
      const bulkOperations = orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id, userId },
          update: { $set: { orderIndex: index } },
        },
      }));

      const result = await ListModel.bulkWrite(bulkOperations);

      if (result.hasWriteErrors()) {
        throw new DatabaseError('Failed to reorder lists', {
          writeErrors: result.getWriteErrors().map((error) => ({
            code: error.code,
            message: error.errmsg,
          })),
        });
      }

      return await this.getLists(userId);
    } catch (error) {
      throw new DatabaseError('Failed to reorder lists', {}, error as Error);
    }
  }
}
