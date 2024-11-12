import express from "express";
import * as taskController from "../controllers/taskController";
import { transformCompletedToString } from "../middlewares/transformTask";

const router = express.Router();

router.post("/", taskController.getTasks);
router.post("/create", taskController.createTask);
router.post(
  "/reorder",
  transformCompletedToString,
  taskController.reorderTasks
);
router.put("/", transformCompletedToString, taskController.updateTask);
router.delete("/", taskController.deleteTask);

export { router as taskRoutes };
