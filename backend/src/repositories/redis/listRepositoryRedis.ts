import { IListRepository } from "../interfaces/listRepository";
import { redisClient } from "../../config";
import { REDIS_KEYS } from "../../utils/redisKeys";
import { List } from "../../models/listModel";
import { reorderArray } from "../../utils/reorderArray";
import { generateUniqueId } from "../../utils/nanoid";

export class ListRepositoryRedis implements IListRepository {
  async createList(userId: string, name: string): Promise<List> {
    const id = await generateUniqueId();
    const listKey = REDIS_KEYS.LIST(userId, id);
    const creationDate = Date.now();

    await redisClient.hSet(listKey, { id, name, creationDate });
    await redisClient.zAdd(REDIS_KEYS.LISTS(userId), {
      score: creationDate,
      value: listKey,
    });

    return { id, name, creationDate };
  }

  async getLists(userId: string): Promise<List[]> {
    const listIds = await redisClient.zRange(REDIS_KEYS.LISTS(userId), 0, -1);

    if (!listIds.length) return [];

    const lists = await Promise.all(
      listIds.map(async (listId) => {
        const listData = await redisClient.hGetAll(listId);

        if (!listData.id || !listData.name) {
          throw new Error(`Missing fields in list with ID: ${listId}`);
        }

        return {
          id: listData.id,
          name: listData.name,
          creationDate: Number(listData.creationDate),
        } as List;
      })
    );

    return lists;
  }

  async updateList(
    userId: string,
    listId: string,
    name: string
  ): Promise<List> {
    const listKey = REDIS_KEYS.LIST(userId, listId);

    const exists = await redisClient.exists(listKey);
    if (!exists) throw new Error(`List with ID ${listKey} does not exist`);

    await redisClient.hSet(listKey, { name });

    return { id: listId, name, creationDate: Date.now() };
  }

  async deleteList(userId: string, listId: string): Promise<{ id: string }> {
    const listKey = REDIS_KEYS.LIST(userId, listId);

    await redisClient.del(listKey);
    await redisClient.zRem(REDIS_KEYS.LISTS(userId), listKey);

    return { id: listId };
  }

  async reorderLists(
    userId: string,
    oldIndex: number,
    newIndex: number
  ): Promise<List[]> {
    const listKey = REDIS_KEYS.LISTS(userId);
    const listsWithScores = await redisClient.zRangeWithScores(listKey, 0, -1);

    const multi = redisClient.multi();

    const reorderedLists = reorderArray(listsWithScores, oldIndex, newIndex);

    reorderedLists.map(({ value: listId }, index) => {
      return multi.zAdd(listKey, {
        score: index,
        value: listId,
      });
    });

    await multi.exec();

    const reorderedListDetails = await Promise.all(
      reorderedLists.map(async ({ value: listId }) => {
        const listData = await redisClient.hGetAll(listId);

        if (!listData.id || !listData.name) {
          throw new Error(`Missing fields in list with ID: ${listId}`);
        }

        return {
          id: listData.id,
          name: listData.name,
          creationDate: Number(listData.creationDate),
        } as List;
      })
    );

    return reorderedListDetails;
  }
}
