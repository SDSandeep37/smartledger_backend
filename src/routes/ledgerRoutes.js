import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { validateLedger } from "../middlewares/ledgerValidation.js";
import {
  createLedger,
  getLedgerById,
  getLedgersByCompanyId,
  updateLedger,
  deleteLedgerById,
  searchLedgerController,
} from "../controllers/ledgerController.js";

const router = express.Router();

router.post("/create", verifyToken, validateLedger, createLedger);
router.put("/:ledgerId/update", verifyToken, validateLedger, updateLedger);
router.get("/:companyId/company", verifyToken, getLedgersByCompanyId);
router.get("/:ledgerId/ledger", verifyToken, getLedgerById);
router.get("/:companyId/search", verifyToken, searchLedgerController);
router.delete("/:ledgerId/delete", verifyToken, deleteLedgerById);
export default router;
