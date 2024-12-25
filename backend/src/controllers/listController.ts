import { Request, Response, NextFunction } from "express";
import {
  CreateListRequest,
  DeleteListRequest,
  ReorderListRequest,
  UpdateListRequest,
} from "../types/requests";
import { List } from "../interfaces/entities";
import { getListsService } from "../services";

export const getLists = async (
  req: Request,
  res: Response<List[]>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;
    const lists = await getListsService().getLists(userId as string);
    res.status(200).json(lists);
  } catch (error) {
    next(error);
  }
};

export const createList = async (
  req: CreateListRequest,
  res: Response<List>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;
    const { name } = req.body;

    const newList = await getListsService().createList(userId as string, name);
    res.status(200).json(newList);
  } catch (error) {
    next(error);
  }
};

export const updateList = async (
  req: UpdateListRequest,
  res: Response<List>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;
    const { name, id } = req.body;

    const updatedList = await getListsService().updateList(
      userId as string,
      id,
      name
    );
    res.status(200).json(updatedList as List);
  } catch (error) {
    next(error);
  }
};

export const deleteList = async (
  req: DeleteListRequest,
  res: Response<{ deletedId: string }>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;
    const { id } = req.body;

    const result = await getListsService().deleteList(userId as string, id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const reorderLists = async (
  req: ReorderListRequest,
  res: Response<List[]>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;
    const { orderedIds } = req.body;

    const reorderedLists = await getListsService().reorderLists(
      userId as string,
      orderedIds
    );
    res.status(200).json(reorderedLists);
  } catch (error) {
    next(error);
  }
};
