import express from "express";

import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createVoucherController,
  deleteVoucherController,
  getCompanyVouchersController,
  getVoucherController,
  searchVoucherController,
} from "../controllers/voucherController.js";
import { validateVoucher } from "../middlewares/voucherValidation.js";

const router = express.Router();

// Create Voucher (Purchase / Sales)
router.post("/create", verifyToken, validateVoucher, createVoucherController);

// Get all vouchers of a company
router.get("/:companyId/company", verifyToken, getCompanyVouchersController);

// Search vouchers with voucher_no or ledger_name
router.get("/:companyId/search", verifyToken, searchVoucherController);

// Get voucher by id
router.get("/:voucherId", verifyToken, getVoucherController);

// Delete voucher
router.delete("/:voucherId", verifyToken, deleteVoucherController);

export default router;
