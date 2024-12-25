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
import { TasksService } from "../services";

export function makeTasksController({
  tasksService,
}: {
  tasksService: TasksService;
}) {
  if (!tasksService) {
    throw new Error("TasksService is required for controller creation");
  }

  return {
    createTask: async (
      req: CreateTaskRequest,
      res: Response<ClientTask>,
      next: NextFunction
    ): Promise<void> => {
      try {
        const { userId } = req;
        const { listId, text } = req.body;

        const task = await tasksService.createTask(
          userId as string,
          listId,
          text
        );
        res.status(200).json(task);
      } catch (error) {
        next(error);
      }
    },

    getTasks: async (
      req: GetTasksRequest,
      res: Response<ClientTask[]>,
      next: NextFunction
    ): Promise<void> => {
      try {
        const { userId } = req;
        const { listId } = req.params;

        const tasks = await tasksService.getTasks(userId as string, listId);
        res.status(200).json(tasks);
      } catch (error) {
        next(error);
      }
    },

    getTasksSearchResults: async (
      req: GetTasksSearchResultsRequest,
      res: Response<SearchResults>,
      next: NextFunction
    ): Promise<void> => {
      try {
        const { userId } = req;
        const { search } = req.query;

        const tasks = await tasksService.getTasksSearchResults(
          userId as string,
          search
        );

        res.status(200).json(tasks);
      } catch (error) {
        next(error);
      }
    },

    updateTask: async (
      req: UpdateTaskRequest,
      res: Response<ClientTask["id"]>,
      next: NextFunction
    ): Promise<void> => {
      try {
        const { userId } = req;
        const { id, ...task } = req.body;
        const updatedTask = await tasksService.updateTask(
          userId as string,
          id,
          task as Partial<Task>
        );
        res.status(200).json(updatedTask);
      } catch (error) {
        next(error);
      }
    },

    deleteTask: async (
      req: DeleteTaskRequest,
      res: Response<ClientTask["id"]>,
      next: NextFunction
    ): Promise<void> => {
      try {
        const { userId } = req;
        const { taskId, listId } = req.body;
        await tasksService.deleteTask(userId as string, taskId, listId);
        res.status(200).json(taskId);
      } catch (error) {
        next(error);
      }
    },

    reorderTasks: async (
      req: ReorderTasksRequest,
      res: Response<ClientTask[]>,
      next: NextFunction
    ): Promise<void> => {
      try {
        const { userId } = req;
        const { listId, orderedIds } = req.body;

        const reorderedTasks = await tasksService.reorderTasks(
          userId as string,
          listId,
          orderedIds
        );

        res.status(200).json(reorderedTasks);
      } catch (error) {
        next(error);
      }
    },

    toggleCompleteAll: async (
      req: BulkCompleteRequest,
      res: Response<ClientTask[]>,
      next: NextFunction
    ): Promise<void> => {
      try {
        const { userId } = req;
        const { listId, newCompletedState } = req.body;

        const completedTasks = await tasksService.toggleCompleteAll(
          userId as string,
          listId,
          newCompletedState
        );
        res.status(200).json(completedTasks);
      } catch (error) {
        next(error);
      }
    },

    bulkDelete: async (
      req: BulkDeleteRequest,
      res: Response<ClientTask[]>,
      next: NextFunction
    ): Promise<void> => {
      try {
        const { userId } = req;
        const { listId, mode = "all" } = req.body;

        const updatedTasks = await tasksService.bulkDelete(
          userId as string,
          listId,
          mode
        );
        res.status(200).json(updatedTasks);
      } catch (error) {
        next(error);
      }
    },
  };
}
