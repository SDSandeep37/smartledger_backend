import express, { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { validateStockGroup } from "../middlewares/stockGroupValidation.js";
import {
  createStockGroupController,
  deleteStockGroupController,
  getAllStockGroupsController,
  getStockGroupByIdController,
  searchStockGroupsController,
  updateStockGroupController,
} from "../controllers/stockGroupController.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  validateStockGroup,
  createStockGroupController,
);
router.put(
  "/:group_id/update",
  verifyToken,
  validateStockGroup,
  updateStockGroupController,
);
router.get("/:groupId", verifyToken, getStockGroupByIdController);
router.get("/:companyId/company", verifyToken, getAllStockGroupsController);
router.delete("/:groupId/delete", verifyToken, deleteStockGroupController);
router.get("/:companyId/search", verifyToken, searchStockGroupsController);
export default router;
