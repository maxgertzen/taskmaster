import express from "express";
import * as taskController from "../controllers/taskController";
import { transformCompletedToString } from "../middlewares/transformTask";
import { validateRequestBody } from "@src/middlewares/validateRequestBody";
import {
  bulkDeleteValidationSchema,
  createTaskValidationSchema,
  deleteTaskValidationSchema,
  getTasksSearchResultsValidationSchema,
  getTasksValidationSchema,
  reorderTasksValidationSchema,
  toggleCompleteAllValidationSchema,
  updateTaskValidationSchema,
} from "@src/validation";

const router = express.Router();

router.get(
  "/search",
  validateRequestBody(getTasksSearchResultsValidationSchema),
  taskController.getTasksSearchResults
);
router.get(
  "/:listId",
  validateRequestBody(getTasksValidationSchema),
  taskController.getTasks
);
router.post(
  "/create",
  validateRequestBody(createTaskValidationSchema),
  taskController.createTask
);
router.post(
  "/reorder",
  validateRequestBody(reorderTasksValidationSchema),
  transformCompletedToString,
  taskController.reorderTasks
);
router.post(
  "/toggle-complete",
  validateRequestBody(toggleCompleteAllValidationSchema),
  taskController.toggleCompleteAll
);
router.put(
  "/",
  validateRequestBody(updateTaskValidationSchema),
  transformCompletedToString,
  taskController.updateTask
);
router.delete(
  "/",
  validateRequestBody(deleteTaskValidationSchema),
  taskController.deleteTask
);
router.delete(
  "/bulk-delete",
  validateRequestBody(bulkDeleteValidationSchema),

  taskController.bulkDelete
);

export { router as taskRoutes };
