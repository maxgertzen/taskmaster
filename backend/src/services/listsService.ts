import { generateUniqueId } from "../utils/nanoid";
import { redisClient } from "../config";
import { List } from "../models/listModel";
import { reorderArray } from "../utils/reorderArray";

export const createList = async (userId: string, name: string) => {
  const id = await generateUniqueId();
  const listKey = `user:${userId}:list:${id}`;
  const creationDate = Date.now();

  await redisClient.hSet(listKey, { id, name, creationDate });

  await redisClient.zAdd(`user:${userId}:lists`, {
    score: creationDate,
    value: listKey,
  });

  return { id, name, creationDate };
};

export const getLists = async (userId: string): Promise<List[]> => {
  const listIds = await redisClient.zRange(`user:${userId}:lists`, 0, -1);

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
        creationDate: listData.creationDate,
      } as List;
    })
  );

  return lists as List[];
};

export const updateList = async (userId: string, id: string, name: string) => {
  const listKey = `user:${userId}:list:${id}`;

  const exists = await redisClient.exists(listKey);
  if (!exists) throw new Error(`List with ID ${listKey} does not exist`);

  await redisClient.hSet(listKey, { name });

  return { id, name };
};

export const deleteList = async (userId: string, id: string) => {
  const listKey = `user:${userId}:list:${id}`;

  await redisClient.del(listKey);
  await redisClient.zRem(`user:${userId}:lists`, listKey);

  return { id };
};

export const reorderLists = async (
  userId: string,
  oldIndex: number,
  newIndex: number
): Promise<List[]> => {
  const listsWithScores = await redisClient.zRangeWithScores(
    `user:${userId}:lists`,
    0,
    -1
  );

  const multiExecution = redisClient.multi();

  const reorderedLists = reorderArray(listsWithScores, oldIndex, newIndex);

  reorderedLists.map(({ value: listId }, index) => {
    return multiExecution.zAdd(`user:${userId}:lists`, {
      score: index,
      value: listId,
    });
  });

  await multiExecution.exec();

  const reorderedListDetails = await Promise.all(
    reorderedLists.map(async ({ value: listId }) => {
      const listData = await redisClient.hGetAll(listId);

      if (!listData.id || !listData.name) {
        throw new Error(`Missing fields in list with ID: ${listId}`);
      }

      return {
        id: listData.id,
        name: listData.name,
        creationDate: listData.creationDate,
      } as List;
    })
  );

  return reorderedListDetails;
};
