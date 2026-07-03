import express, { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { validateStockItem } from "../middlewares/stockItemsValidation.js";
import {
  createStockItem,
  deleteStockItemController,
  getStockItemById,
  getStockItemsController,
  searchStockItemsController,
  updateStockItem,
} from "../controllers/stockItemsController.js";

const router = express.Router();

router.post("/create", verifyToken, validateStockItem, createStockItem);
router.put("/:itemId/update", verifyToken, validateStockItem, updateStockItem);
router.get("/:itemId", verifyToken, getStockItemById);
router.get("/:companyId/company", verifyToken, getStockItemsController);
router.delete("/:itemId/delete", verifyToken, deleteStockItemController);
router.get("/:companyId/search", verifyToken, searchStockItemsController);

export default router;
