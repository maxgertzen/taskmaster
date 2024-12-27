import express, { Router } from "express";
import { transformCompletedToString } from "../middlewares/transformTask";
import { validateRequestBody } from "@src/middlewares/validateRequestBody";
import {
  bulkDeleteValidationSchema,
  createTaskValidationSchema,
  deleteTaskValidationSchema,
  reorderTasksValidationSchema,
  toggleCompleteAllValidationSchema,
  updateTaskValidationSchema,
} from "@src/validation";
import { ContainerType } from "@src/types/container";
import { AwilixContainer } from "awilix";

export const configureTaskRoutes = (
  container: AwilixContainer<ContainerType>
): Router => {
  const router = express.Router();
  const {
    getTasksSearchResults,
    getTasks,
    createTask,
    reorderTasks,
    toggleCompleteAll,
    updateTask,
    deleteTask,
    bulkDelete,
  } = container.resolve("tasksController");

  router.get("/search", getTasksSearchResults);
  router.get("/:listId", getTasks);
  router.post(
    "/create",
    validateRequestBody(createTaskValidationSchema),
    createTask
  );
  router.post(
    "/reorder",
    validateRequestBody(reorderTasksValidationSchema),
    transformCompletedToString,
    reorderTasks
  );
  router.post(
    "/toggle-complete",
    validateRequestBody(toggleCompleteAllValidationSchema),
    toggleCompleteAll
  );
  router.put(
    "/",
    validateRequestBody(updateTaskValidationSchema),
    transformCompletedToString,
    updateTask
  );
  router.delete(
    "/",
    validateRequestBody(deleteTaskValidationSchema),
    deleteTask
  );
  router.delete(
    "/bulk-delete",
    validateRequestBody(bulkDeleteValidationSchema),

    bulkDelete
  );

  return router;
};
