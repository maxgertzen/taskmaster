import express from "express";
import * as taskController from "../controllers/taskController";
import { transformCompletedToString } from "../middlewares/transformTask";

const router = express.Router();

router.get("/:listId", taskController.getTasks);
router.post("/create", taskController.createTask);
router.post(
  "/reorder",
  transformCompletedToString,
  taskController.reorderTasks
);
router.post("/toggle-complete", taskController.toggleCompleteAll);
router.put("/", transformCompletedToString, taskController.updateTask);
router.delete("/", taskController.deleteTask);
router.delete("/bulk-delete", taskController.bulkDelete);

export { router as taskRoutes };
