import express from "express";
import * as listController from "../controllers/listController";

const router = express.Router();

router.get("/", listController.getLists);
router.post("/", listController.createList);
router.post("/reorder", listController.reorderLists);
router.put("/", listController.updateList);
router.delete("/", listController.deleteList);

export { router as listRoutes };
