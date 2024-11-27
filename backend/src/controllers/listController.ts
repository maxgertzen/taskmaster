import { Request, Response, NextFunction } from "express";
import {
  CreateListRequest,
  DeleteListRequest,
  ReorderListRequest,
  UpdateListRequest,
} from "../types/requests";
import { List } from "../models/listModel";
import { getListService } from "../services";

export const getLists = async (
  req: Request,
  res: Response<List[]>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;
    const lists = await getListService().getLists(userId as string);
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

    if (!name) {
      throw new Error("Name is required");
    }

    const newList = await getListService().createList(userId as string, name);
    res.status(201).json(newList);
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

    if (!name) {
      throw new Error("Name is required");
    }

    const updatedList = await getListService().updateList(
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
  res: Response<List["id"]>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;
    const { id } = req.body;

    if (!id) {
      throw new Error("ID is required");
    }

    const result = await getListService().deleteList(userId as string, id);
    res.status(204).json(result.id);
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
    const { oldIndex, newIndex } = req.body;

    if (typeof oldIndex !== "number" || typeof newIndex !== "number") {
      throw new Error("Both oldIndex and newIndex must be numbers");
    }

    const reorderedLists = await getListService().reorderLists(
      userId as string,
      oldIndex,
      newIndex
    );
    res.status(200).json(reorderedLists);
  } catch (error) {
    next(error);
  }
};
