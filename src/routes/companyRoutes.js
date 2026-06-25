import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { validateCompany } from "../middlewares/companyValidation.js";
import {
  createCompany,
  deleteCompanyContoller,
  getCompaniesOfUserContoller,
  getCompanyContoller,
  updateCompany,
} from "../controllers/companyController.js";

const router = express.Router();

router.post("/create", verifyToken, validateCompany, createCompany);
router.put("/:companyId/update", verifyToken, validateCompany, updateCompany);
router.get("/:companyId/company", verifyToken, getCompanyContoller);
router.get("/companies", verifyToken, getCompaniesOfUserContoller);
router.delete("/:companyId", verifyToken, deleteCompanyContoller);

export default router;
