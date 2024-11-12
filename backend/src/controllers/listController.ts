import { Request, Response, NextFunction } from "express";
import * as listService from "../services/listsService";
import {
  CreateListRequest,
  DeleteListRequest,
  ReorderListRequest,
  UpdateListRequest,
} from "../types/requests";
import { List } from "../models/listModel";

export const getLists = async (
  _req: Request,
  res: Response<List[]>,
  next: NextFunction
): Promise<void> => {
  try {
    const lists = await listService.getLists();
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
    const { name } = req.body;

    if (!name) {
      throw new Error("Name is required");
    }

    const newList = await listService.createList(name);
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
    const { name, id } = req.body;

    if (!name) {
      throw new Error("Name is required");
    }

    const updatedList = await listService.updateList(id, name);
    res.status(200).json(updatedList);
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
    const { id } = req.body;

    if (!id) {
      throw new Error("ID is required");
    }

    const result = await listService.deleteList(id);
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
    const { oldIndex, newIndex } = req.body;

    if (typeof oldIndex !== "number" || typeof newIndex !== "number") {
      throw new Error("Both oldIndex and newIndex must be numbers");
    }

    const reorderedLists = await listService.reorderLists(oldIndex, newIndex);
    res.status(200).json(reorderedLists);
  } catch (error) {
    next(error);
  }
};
