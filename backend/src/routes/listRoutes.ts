import express from "express";
import * as listController from "../controllers/listController";
import { validateRequestBody } from "@src/middlewares/validateRequestBody";
import {
  createListValidationSchema,
  deleteListValidationSchema,
  reorderListsValidationSchema,
  updateListValidationSchema,
} from "@src/validation";

const router = express.Router();

router.get("/", listController.getLists);
router.post(
  "/",
  validateRequestBody(createListValidationSchema),
  listController.createList
);
router.post(
  "/reorder",
  validateRequestBody(reorderListsValidationSchema),
  listController.reorderLists
);
router.put(
  "/",
  validateRequestBody(updateListValidationSchema),
  listController.updateList
);
router.delete(
  "/",
  validateRequestBody(deleteListValidationSchema),
  listController.deleteList
);

export { router as listRoutes };
