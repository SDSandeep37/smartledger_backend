import express from "express";
import {
  getUserSession,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protect logout route with token verification
router.post("/logout", verifyToken, logoutUser);

// Protect user session route with token verification
router.get("/session", verifyToken, getUserSession);

export default router;
