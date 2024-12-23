import { Response, NextFunction } from "express";
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  GetTasksRequest,
  DeleteTaskRequest,
  ReorderTasksRequest,
  BulkCompleteRequest,
  BulkDeleteRequest,
  GetTasksSearchResultsRequest,
} from "../types/requests";
import { ClientTask, SearchResults, Task } from "../interfaces/entities";
import { getTaskService } from "../services";

export const createTask = async (
  req: CreateTaskRequest,
  res: Response<ClientTask>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;
    const { listId, text } = req.body;
    if (!listId || !text) {
      throw new Error("List ID and text are required");
    }

    const task = await getTaskService().createTask(
      userId as string,
      listId,
      text
    );
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (
  req: GetTasksRequest,
  res: Response<ClientTask[]>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;
    const { listId } = req.params;

    const tasks = await getTaskService().getTasks(userId as string, listId);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTasksSearchResults = async (
  req: GetTasksSearchResultsRequest,
  res: Response<SearchResults>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;
    const { search } = req.query;

    const tasks = await getTaskService().getTasksSearchResults(
      userId as string,
      search
    );

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: UpdateTaskRequest,
  res: Response<ClientTask["id"]>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;
    const { id, ...task } = req.body;
    const updatedTask = await getTaskService().updateTask(
      userId as string,
      id,
      task as Partial<Task>
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: DeleteTaskRequest,
  res: Response<ClientTask["id"]>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;
    const { taskId, listId } = req.body;
    await getTaskService().deleteTask(userId as string, taskId, listId);
    res.status(200).json(taskId);
  } catch (error) {
    next(error);
  }
};

export const reorderTasks = async (
  req: ReorderTasksRequest,
  res: Response<ClientTask[]>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;
    const { listId, orderedIds } = req.body;

    if (!orderedIds || !Array.isArray(orderedIds) || orderedIds.length === 0) {
      throw new Error("Ordered IDs are required");
    }

    const reorderedTasks = await getTaskService().reorderTasks(
      userId as string,
      listId,
      orderedIds
    );

    res.status(200).json(reorderedTasks);
  } catch (error) {
    next(error);
  }
};

export const toggleCompleteAll = async (
  req: BulkCompleteRequest,
  res: Response<ClientTask[]>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;
    const { listId, newCompletedState } = req.body;

    const completedTasks = await getTaskService().toggleCompleteAll(
      userId as string,
      listId,
      newCompletedState
    );
    res.status(200).json(completedTasks);
  } catch (error) {
    next(error);
  }
};

export const bulkDelete = async (
  req: BulkDeleteRequest,
  res: Response<ClientTask[]>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;
    const { listId, mode = "all" } = req.body;

    const updatedTasks = await getTaskService().bulkDelete(
      userId as string,
      listId,
      mode
    );
    res.status(200).json(updatedTasks);
  } catch (error) {
    next(error);
  }
};
