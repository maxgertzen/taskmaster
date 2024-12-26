import express, { Router } from "express";
import { validateRequestBody } from "@middlewares/validateRequestBody";
import {
  createListValidationSchema,
  deleteListValidationSchema,
  reorderListsValidationSchema,
  updateListValidationSchema,
} from "@src/validation";
import { getAppContainer } from "@src/container";

export const configureListRoutes = (): Router => {
  const router = express.Router();
  const container = getAppContainer();
  const controller = container.resolve("listsController");

  if (!controller) {
    throw new Error("Controller not found in container");
  }

  router.get("/", controller.getLists);
  router.post(
    "/",
    validateRequestBody(createListValidationSchema),
    controller.createList
  );
  router.post(
    "/reorder",
    validateRequestBody(reorderListsValidationSchema),
    controller.reorderLists
  );
  router.put(
    "/",
    validateRequestBody(updateListValidationSchema),
    controller.updateList
  );
  router.delete(
    "/",
    validateRequestBody(deleteListValidationSchema),
    controller.deleteList
  );

  return router;
};
