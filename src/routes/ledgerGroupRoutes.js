import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { validateLedgerGroup } from "../middlewares/ledgerGroupValidation.js";
import {
  createLedgerGroup,
  deleteLG,
  getAllLG4Company,
  getLGById,
  updateLedgerGroup,
} from "../controllers/ledgerGroupController.js";

const router = express.Router();

router.post("/create", verifyToken, validateLedgerGroup, createLedgerGroup);
router.put(
  "/:ledgerGroupId/update",
  verifyToken,
  validateLedgerGroup,
  updateLedgerGroup,
);

router.get("/:companyId/all", verifyToken, getAllLG4Company);
router.get("/:id", verifyToken, getLGById);
router.delete("/:id", verifyToken, deleteLG);

export default router;
