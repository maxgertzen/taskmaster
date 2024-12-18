import { IListRepository } from "../../interfaces/listRepository";
import { REDIS_KEYS } from "../../utils/redisKeys";
import { BaseList } from "../../interfaces/entities";
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
    orderedIds: string[]
  ): Promise<BaseList[]> {
    const listKey = REDIS_KEYS.LISTS(userId);
    const existingKeys = await this.redisClient.zRange(listKey, 0, -1);
    const existingIds = existingKeys.map((key) => key.split(":").pop());
    const invalidIds = orderedIds.filter((id) => !existingIds.includes(id));

    if (invalidIds.length) {
      throw new Error(`Invalid list IDs: ${invalidIds.join(", ")}`);
    }

    const reorderedKeys = orderedIds.map((id) => REDIS_KEYS.LIST(userId, id));

    const multi = this.redisClient.multi();

    reorderedKeys.forEach((key, index) => {
      multi.zAdd(listKey, {
        score: index,
        value: key,
      });
      multi.hSet(key, { orderIndex: index });
    });

    await multi.exec();

    const reorderedLists = await Promise.all(
      reorderedKeys.map(async (key) => {
        const listData = await this.redisClient.hGetAll(key);

        if (!listData.id || !listData.name) {
          throw new Error(`Missing fields in list with key: ${key}`);
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

    return reorderedLists;
  }
}
