import { Response, NextFunction } from "express";
import * as taskService from "../services/tasksService";
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  GetTasksRequest,
  DeleteTaskRequest,
  ReorderTasksRequest,
  BulkCompleteRequest,
  BulkDeleteRequest,
} from "../types/requests";
import { ClientTask, Task } from "../models/taskModel";

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

    const task = await taskService.createTask(userId as string, listId, text);
    res.status(201).json(task);
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
    const tasks = await taskService.getTasks(userId as string, listId);
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
    const updatedTask = await taskService.updateTask(
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
    await taskService.deleteTask(userId as string, taskId, listId);
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
    const { listId, oldIndex, newIndex } = req.body;

    const reorderedTasks = await taskService.reorderTasks(
      userId as string,
      listId,
      oldIndex,
      newIndex
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

    const completedTasks = await taskService.toggleCompleteAll(
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
    const { listId, mode = "completed" } = req.body;

    const updatedTasks = await taskService.bulkDelete(
      userId as string,
      listId,
      mode
    );
    res.status(200).json(updatedTasks);
  } catch (error) {
    next(error);
  }
};
