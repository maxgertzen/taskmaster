import { IListRepository } from "../../interfaces/listRepository";
import { REDIS_KEYS } from "../../utils/redisKeys";
import { BaseList } from "../../interfaces/entities";
import { reorderArray } from "../../utils/reorderArray";
import { generateUniqueId } from "../../utils/nanoid";
import { getRedisClient } from "../../config/database";

export class ListRepositoryRedis implements IListRepository {
  private redisClient = getRedisClient();

  async createList(userId: string, name: string): Promise<BaseList> {
    const id = await generateUniqueId();
    const creationDate = new Date().toISOString();
    const orderIndex = Date.now();
    const listKey = REDIS_KEYS.LIST(userId, id);

    const listData: BaseList = { id, name, creationDate, userId, orderIndex };

    await this.redisClient
      .multi()
      .hSet(listKey, Object.entries(listData).flat())
      .zAdd(REDIS_KEYS.LISTS(userId), {
        score: orderIndex,
        value: listKey,
      })
      .exec();

    return listData;
  }

  async getLists(userId: string): Promise<BaseList[]> {
    const listIds = await this.redisClient.zRange(
      REDIS_KEYS.LISTS(userId),
      0,
      -1
    );

    if (!listIds.length) return [];

    const lists = await Promise.all(
      listIds.map(async (listId) => {
        const listData = await this.redisClient.hGetAll(listId);

        if (!listData.id || !listData.name) {
          throw new Error(`Missing fields in list with ID: ${listId}`);
        }

        return {
          id: listData.id,
          name: listData.name,
          creationDate: listData.creationDate,
          userId,
          orderIndex: Number(listData.orderIndex),
        };
      })
    );

    return lists.sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async updateList(
    userId: string,
    listId: string,
    name: string
  ): Promise<BaseList> {
    const listKey = REDIS_KEYS.LIST(userId, listId);

    const exists = await this.redisClient.exists(listKey);
    if (!exists) throw new Error(`List with ID ${listKey} does not exist`);

    await this.redisClient.hSet(listKey, { name });

    const listData = await this.redisClient.hGetAll(listKey);
    return {
      id: listId,
      name: listData.name,
      creationDate: listData.creationDate,
      userId,
      orderIndex: Number(listData.orderIndex),
    };
  }

  async deleteList(
    userId: string,
    listId: string
  ): Promise<{ deletedId: string }> {
    const listKey = REDIS_KEYS.LIST(userId, listId);

    await this.redisClient.del(listKey);
    await this.redisClient.zRem(REDIS_KEYS.LISTS(userId), listKey);

    return { deletedId: listId };
  }

  async reorderLists(
    userId: string,
    oldIndex: number,
    newIndex: number
  ): Promise<BaseList[]> {
    const listKey = REDIS_KEYS.LISTS(userId);
    const listsWithScores = await this.redisClient.zRangeWithScores(
      listKey,
      0,
      -1
    );

    const multi = this.redisClient.multi();

    const reorderedLists = reorderArray(listsWithScores, oldIndex, newIndex);

    reorderedLists.map(({ value: listKey }, index) => {
      return multi.zAdd(listKey, {
        score: index,
        value: listKey,
      });
    });

    await multi.exec();

    const reorderedListDetails = await Promise.all(
      reorderedLists.map(async ({ value: listKey }) => {
        const listData = await this.redisClient.hGetAll(listKey);

        if (!listData.id || !listData.name) {
          throw new Error(`Missing fields in list with key: ${listKey}`);
        }

        return {
          id: listData.id,
          name: listData.name,
          creationDate: listData.creationDate,
          userId,
          orderIndex: Number(listData.orderIndex),
        } as BaseList;
      })
    );

    return reorderedListDetails.sort((a, b) => a.orderIndex - b.orderIndex);
  }
}
