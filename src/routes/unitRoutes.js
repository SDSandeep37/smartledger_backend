import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { validateUnitData } from "../middlewares/unitValidation.js";
import {
  createUnit,
  deleteUnitController,
  getUnitByIdController,
  getUnitsByCompanyController,
  updateUnit,
} from "../controllers/unitController.js";
const router = express.Router();

router.post("/create", verifyToken, validateUnitData, createUnit);
router.put("/:id/update", verifyToken, validateUnitData, updateUnit);
router.get("/:companyId/company", verifyToken, getUnitsByCompanyController);
router.get("/:unitId", verifyToken, getUnitByIdController);
router.delete("/:unitId/delete", verifyToken, deleteUnitController);

export default router;
